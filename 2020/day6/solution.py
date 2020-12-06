from functools import reduce

def read_input(filename='input.txt'):
    with open(filename) as f:
        groups = [line.split('\n') for line in f.read().strip().split('\n\n')]
        grouped_answers = [[set(item) for item in group] for group in groups]      
        return grouped_answers

def get_sum_count(grouped_answers:list, set_operation='union'):
    """
    Returns the sum of the count of distinct questions for each group. Part 1 answer.

    Parameters:
    grouped_answers (list): A list of the answers for the group, with each person's answer in a separate set
    set_operation (str): Type of operation to do on the set: union or intersection. Defaults to union

    Returns an int
    """
    # reduce group list of sets to a single set per group
    if set_operation == 'union':
        grouped_sets = [reduce(lambda x,y: x|y, group) for group in grouped_answers]
    else:
        grouped_sets = [reduce(lambda x,y: x&y, group) for group in grouped_answers]
    return reduce(lambda x,y: x+y, [len(group) for group in grouped_sets])

def test():
    grouped_answers = read_input('test_input.txt')
    union_sum_count = get_sum_count(grouped_answers)
    assert union_sum_count == 11

    intersection_sum_count = get_sum_count(grouped_answers, 'intersection')
    assert intersection_sum_count == 6

def run():
    test()
    grouped_answers = read_input('input.txt')
    print(get_sum_count(grouped_answers))
    print(get_sum_count(grouped_answers, 'intersection'))

run()
