from toolz import curry
import time

def read_input(filename='input.txt'):
    with open(filename) as f:
        layout = [list(line) for line in f.read().splitlines()]
        return layout
 
def layout_to_str(layout:list):
    s = ''
    for row in layout:
        s += ''.join(row)
        s += '\n'
    return s

@curry
# This runs 10x slower than the non-curried nested function
def is_valid_seat_curried(height, width, seat_pos:tuple):
    row, col = seat_pos
    return row >= 0 and row < height and col >= 0 and col < width

def get_adjacent_seats(seat_pos:tuple, layout:list):
    height = len(layout)
    width = len(layout[0])

    def is_valid_seat(seat_pos:tuple):
        row, col = seat_pos
        return row >= 0 and row < height and col >= 0 and col < width

    row, col = seat_pos
    adjacent_seats = filter(is_valid_seat, [
        (row-1, col-1),
        (row-1, col),
        (row-1, col+1),
        (row, col-1),
        (row, col+1),
        (row+1, col-1),
        (row+1, col),
        (row+1, col+1)
    ])
    return adjacent_seats

def get_visible_seats(seat_pos:tuple, layout:list):
    height = len(layout)
    width = len(layout[0])

    def is_valid_seat(seat_pos:tuple):
        row, col = seat_pos
        return row >= 0 and row < height and col >= 0 and col < width

    row, col = seat_pos
    visible_seats = []
    possible_seats = {
        'NW': {
            'seat': (row-1, col-1),
            'row': -1,
            'col': -1
        },
        'N': {
            'seat': (row-1, col),
            'row': -1,
            'col': 0
        },
        'NE': {
            'seat': (row-1, col+1),
            'row': -1,
            'col': 1
        },
        'W': {
            'seat': (row, col-1),
            'row': 0,
            'col': -1
        },
        'E': {
            'seat': (row, col+1),
            'row': 0,
            'col': 1
        },
        'SW': {
            'seat': (row+1, col-1),
            'row': 1,
            'col': -1
        },
        'S': {
            'seat': (row+1, col),
            'row': 1,
            'col': 0
        },
        'SE': {
            'seat': (row+1, col+1),
            'row': 1,
            'col': 1
        }
    }
    
    for direction, info in possible_seats.items():
        seat, row_op, col_op = info.values()
        seat_row, seat_col = seat

        if is_valid_seat((seat_row, seat_col)):
            next_seat = (seat_row + row_op, seat_col + col_op)
            while layout[seat_row][seat_col] == '.' and is_valid_seat(next_seat):
                seat_row, seat_col = next_seat
                next_seat = (seat_row + row_op, seat_col + col_op)
            visible_seats.append((seat_row, seat_col))
    
    return visible_seats

def all_empty(adjacent_seats:list, layout:list):
    for row, col in adjacent_seats:
        if layout[row][col] == '#':
            return False
    return True

def has_occupied_limit(adjacent_seats:list, layout:list, limit=4):
    num_occupied = 0
    for row, col in adjacent_seats:
        if layout[row][col] == '#':
            num_occupied += 1
        if num_occupied >= limit:
            return True
    return False

def get_seats_to_occupy(layout:list, adjacent=True):
    seats_to_occupy = []
    for row in range(len(layout)):
        for col in range(len(layout[0])):
            seats_to_check = []
            if adjacent:
                seats_to_check = get_adjacent_seats((row, col), layout)
            else:
                seats_to_check = get_visible_seats((row, col), layout)

            if layout[row][col] == 'L' and all_empty(seats_to_check, layout):
                seats_to_occupy.append((row, col))
    return seats_to_occupy

def get_seats_to_empty(layout:list, limit=4, adjacent=True):
    seats_to_empty = []
    for row in range(len(layout)):
        for col in range(len(layout[0])):
            seats_to_check = []
            if adjacent:
                seats_to_check = get_adjacent_seats((row, col), layout)
            else:
                seats_to_check = get_visible_seats((row, col), layout)

            if layout[row][col] == '#' and has_occupied_limit(seats_to_check, layout, limit):
                seats_to_empty.append((row, col))
    return seats_to_empty

def switch_seats(layout:list, seats_to_switch:list):
    for seat in seats_to_switch:
        row, col = seat
        if layout[row][col] == 'L':
            layout[row][col] = '#'
        elif layout[row][col] == '#':
            layout[row][col] = 'L'

    return layout

def change_seats(layout:list, occupied_limit=4, check_adjacent=True):
    num_rounds = 0
    changed_seats = True

    while changed_seats:
        changed_seats = False
        seats_to_switch = get_seats_to_occupy(layout, check_adjacent)
        seats_to_switch.extend(get_seats_to_empty(layout, occupied_limit, check_adjacent))

        if len(seats_to_switch) > 0:
            changed_seats = True
            num_rounds += 1
            layout = switch_seats(layout, seats_to_switch)

    print('num rounds', num_rounds)

def get_num_occupied(layout:list):
    return sum([row.count('#') for row in layout])

def test():
    filename = 'test_input.txt'
    layout = read_input(filename)
    print(layout_to_str(layout))

    change_seats(layout)
    num_occupied = get_num_occupied(layout)
    assert num_occupied == 37, f'num changed is {num_occupied}'

    original_layout = read_input(filename)
    change_seats(original_layout, occupied_limit=5, check_adjacent=False)
    new_num_occupied = get_num_occupied(original_layout)
    assert new_num_occupied == 26, f'num occupied is {num_occupied}'

def run():
    test()
    start = time.time()
    layout = read_input()
    change_seats(layout)
    num_occupied = sum([row.count('#') for row in layout])
    end = time.time()
    print(f'total time: {end-start}')
    print(num_occupied)

    orig_layout = read_input()
    change_seats(orig_layout, occupied_limit=5, check_adjacent=False)
    print(get_num_occupied(orig_layout))

run()
