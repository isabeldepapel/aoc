import itertools

def read_input(filename):
    with open(filename) as f:
        return [int(num) for num in f.read().splitlines()]

def find_num(nums, preamble=25):
    for i in range(preamble, len(nums)):
        current_num = nums[i]
        preamble_nums = nums[i-preamble:i]

        sums = list(map(sum, itertools.combinations(preamble_nums, 2)))

        if current_num not in sums:
            return current_num

def find_weakness(num_list, num):
    start = 0
    end = 0
    running_sum = num_list[0]

    while running_sum != num:
        while running_sum < num:
            end += 1
            running_sum += num_list[end]
        
        while running_sum > num:
            running_sum -= num_list[start]
            start += 1

    nums = num_list[start:end+1]
    return (max(nums) + min(nums))

def test():
    nums = read_input('test_input.txt')
    num = find_num(nums, 5)
    assert num == 127, f'num is {num}'

    weakness = find_weakness(nums, num)
    assert weakness == 62


def run():
    test()
    nums = read_input('input.txt')
    num = find_num(nums, 25)
    print(num)

    weakness = find_weakness(nums, num)
    print(weakness)

run()