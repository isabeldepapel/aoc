import functools

def part_one():
    f = open('input.txt', 'r')
    num_valid_policies = 0

    for line in f:
        data = line.strip()
        [policy, password] = data.split(':')
        [required_letter_repeats, letter] = policy.split(' ')
        [min_req, max_req] = map(int, required_letter_repeats.split('-'))
        
        actual_letter_repeats = [char == letter for char in password].count(True)
        return actual_letter_repeats >= min_req and actual_letter_repeats <= max_req

    f.close()
    return num_valid_policies

print(part_one())

def part_two():
    f = open('input.txt', 'r')
    num_valid_policies = 0

    for line in f:
        data = line.strip()
        [policy, password_with_whitespace] = data.split(':')
        [positions, letter] = policy.split(' ')
        [index1, index2] = map(lambda x: int(x) - 1, positions.split('-'))
        [position1, position2] = map(int, positions.split('-'))

        password = password_with_whitespace.strip()

        if (password[index1] == letter and password[index2] != letter):
            num_valid_policies += 1
        elif (password[index1] != letter and password[index2] == letter):
            num_valid_policies += 1
    
    f.close()
    return num_valid_policies

print(part_two())