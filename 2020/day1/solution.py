from functools import reduce 

DESIRED_SUM = 2020

def read_file():
    with open('input.txt') as f:
        nums = [int(line.strip()) for line in f]
        return nums

def get_complements():
    num_list = read_file()

    complements = set()
    for num in num_list:
        if num in complements:
            return (num, DESIRED_SUM - num)
        complements.add(DESIRED_SUM - num)

complements = get_complements(nums)
print(complements[0] * complements[1])

def get_triples():   
    num_list = read_file()
    len_nums = len(num_list)
    for i in range(len_nums):
        num = nums[i]
        first_complement = DESIRED_SUM - num
        second_complements = set()

        for j in range(len_nums):
            if i != j:
                num_to_check = nums[j]
                
                if num_to_check in second_complements:
                    triple = (num_to_check, first_complement - num_to_check, num)
                    return triple

                second_complements.add(first_complement - num_to_check)

triple = get_triples(nums)
print(reduce(lambda x, y: x * y, triple))
