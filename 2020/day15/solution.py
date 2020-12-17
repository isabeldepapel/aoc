def read_input(test=False):
    if test:
        return [0,3,6]
    return [13,16,0,12,15,1]

def run_nums(starting_nums:list, limit=2020):
    nums = dict({ starting_nums[i]: [None, i] for i in range(len(starting_nums)) })
    i = len(starting_nums)
    num_list = starting_nums.copy()
    current_num = num_list[-1]

    while i < limit:
        prev_num = current_num
        turns = nums[prev_num]

        if turns[0] is None:
            current_num = 0

            if 0 not in nums:
                nums[0] = [None, i]
            else:
                nums[0] = [nums[0][1], i]
        else:
            delta = turns[-1] - turns[-2]
            current_num = delta

            if delta not in nums:
                nums[delta] = [None, i]
            else:
                nums[delta] = [nums[delta][1], i]
        i += 1

    print('cur num', current_num)
    return current_num

def test():
    starting_nums = read_input(test=True)
    run_nums(starting_nums)

def run():
    test()
    starting_nums = read_input()
    run_nums(starting_nums)
    run_nums(starting_nums, limit=30000000)

run()
