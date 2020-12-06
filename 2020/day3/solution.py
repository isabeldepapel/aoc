from functools import reduce

def read_input():
    with open('input.txt') as f:
        tree_map = [list(line.strip()) for line in f]
        return tree_map

def move_step(current_pos, step, chart):
    map_height = len(chart)
    map_width = len(chart[0])

    current_x, current_y = current_pos
    move_x, move_y = step

    new_x = (current_x + move_x) % map_width
    new_y = (current_y + move_y)

    return (new_x, new_y)
   
def find_trees(step):
    my_map = read_input()
    
    current_pos = (0, 0)
    y = current_pos[1]
    num_trees = 0

    while y < len(my_map) - 1:
        current_pos = move_step(current_pos, step, my_map)
        x, y = current_pos
        
        if my_map[y][x] == '.':
            my_map[y][x] = 'O'
        else:
            my_map[y][x] = 'X'
            num_trees += 1

    return num_trees

print(find_trees((3, 1)))

def compare_trees():
    steps = [
        (1, 1),
        (3, 1),
        (5, 1),
        (7, 1),
        (1, 2)
    ]

    trees = reduce(lambda x, y: x*y, [find_trees(step) for step in steps])
    return trees

compare_trees()