def read_input(filename='input.txt'):
    with open(filename) as f:
        instructions = [(line[0], int(line[1:])) for line in f.read().splitlines()]
    return instructions

def get_dir_to_move(current_dir, rotation, right=True):
    if not right:
        rotation *= -1
    rotation_to_dir = {
        0: 'N',
        90: 'E',
        180: 'S',
        270: 'W'
    }
    dir_to_rotation = {
        'N': 0,
        'E': 90,
        'S': 180,
        'W': 270
    }

    new_rotation = (dir_to_rotation[current_dir] + rotation) % 360
    return rotation_to_dir[new_rotation]

def move(current_pos:tuple, move_dir:str, num:int):
    x, y = current_pos

    if move_dir == 'N':
        y -= num
    elif move_dir == 'S':
        y += num
    elif move_dir == 'W':
        x -= num
    elif move_dir == 'E':
        x += num
    
    return (x, y)

def navigate(instructions:list):
    current_pos = (0, 0)
    current_dir = 'E'

    for instruction in instructions:
        op, num = instruction

        if op == 'R':
            current_dir = get_dir_to_move(current_dir, num)
        elif op == 'L':
            current_dir = get_dir_to_move(current_dir, num, right=False)
        elif op == 'F':
            current_pos = move(current_pos, current_dir, num)
        else:
            current_pos = move(current_pos, op, num)

    return current_pos

def get_manhattan_dist(pos:tuple):
    x, y = pos
    return abs(x) + abs(y)

def rotate_waypoint(waypoint_pos:tuple, rotation_dir:str, rotation_num:int):
    x, y = waypoint_pos
    if rotation_dir == 'L':
        rotation_num *= -1
    rotation = (rotation_num) % 360

    rotated_coords = {
        0: (x, y),
        90: (-y, x),
        180: (-x, -y),
        270: (y, -x)
    }
    new_pos = rotated_coords[rotation]
    return new_pos

def move_waypoint(waypoint_offset:tuple, move_dir:str, move_num:int):
    new_offset = move(waypoint_offset, move_dir, move_num)
    return new_offset

def move_to_waypoint(waypoint_offset:tuple, ship_pos:tuple, move_num:int):
    x, y = waypoint_offset
    ship_x, ship_y = ship_pos
    move_x, move_y = (x * move_num, y * move_num)

    return (ship_x + move_x, ship_y + move_y)

def navigate_with_waypoint(instructions:list):
    current_pos = (0, 0)
    waypoint_offset = (10, -1)
    waypoint_offset_x, waypoint_offset_y = 10, -1

    for instruction in instructions:
        op, num = instruction
        if op == 'L' or op == 'R':
            waypoint_offset = rotate_waypoint(waypoint_offset, op, num)
        elif op == 'F':
            current_pos = move_to_waypoint(waypoint_offset, current_pos, num)
        else:
            waypoint_offset = move_waypoint(waypoint_offset, op, num)
    
    return current_pos

def test():
    filename = 'test_input.txt'
    instructions = read_input(filename)
    print(instructions)

    new_pos = navigate(instructions)
    assert get_manhattan_dist(new_pos) == 25, f'manhattan dist is {get_manhattan_dist(new_pos)}'

    pos_with_waypoint = navigate_with_waypoint(instructions)
    assert get_manhattan_dist(pos_with_waypoint) == 286, f'manhattan dist is {get_manhattan_dist(pos_with_waypoint)}'

def run():
    test()

    instructions = read_input()
    new_pos = navigate(instructions)
    print(get_manhattan_dist(new_pos))

    pos_with_waypoint = navigate_with_waypoint(instructions)
    print(get_manhattan_dist(pos_with_waypoint))
    
run()