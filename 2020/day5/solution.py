SEARCH_TYPES = {
    'row': {
        'length': 128,
        'char': 'F'
    },
    'col': {
        'length': 8,
        'char': 'L'
    }
}

def read_input(filename):
    with open(filename) as f:
        return f.read().splitlines()

def binary_seat_search(seat_info, search_type):
    """Return the column or row of the seat.

    Parameters:
    seat_info (str): Contains the row or column info to identify the seat location.
    seach_type (str): 'row' or 'col'. The type of search (row or column)

    Returns:
    int: Row or Col of the seat
    """
    
    search_info = SEARCH_TYPES[search_type]
    num_steps = len(seat_info)
    length = search_info['length']
    char = search_info['char']

    start = 0
    end = length - 1
    i = 0

    while i < num_steps:
        mid = (end - start) // 2 + start
        if seat_info[i] == char:
            end = mid
        else:
            start = mid + 1
        i += 1
    
    return start # start will = end in the last iteration


def get_seat(boarding_pass):
    row_info = boarding_pass[:7]
    col_info = boarding_pass[7:]

    row = binary_seat_search(row_info, 'row')
    col = binary_seat_search(col_info, 'col')

    seat_id = (row * 8 + col)

    return (row, col, seat_id)

def test():
    answers = [
        (70, 7, 567),
        (14, 7, 119),
        (102, 4, 820)
    ]

    boarding_passes = read_input('test_input.txt')
    seats = [get_seat(boarding_pass) for boarding_pass in boarding_passes]
    for i in range(3):
        assert seats[i] == answers[i]

def run():
    test()

    boarding_passes = read_input('input.txt')
    seats = [get_seat(boarding_pass) for boarding_pass in boarding_passes]
    print(max(seats)[2]) # part1

    seat_ids = sorted([seat[2] for seat in seats])
    
    for i in range(len(seat_ids) - 2):
        if seat_ids[i + 1] != seat_ids[i] + 1:
            return seat_ids[i] + 1

print(run())
