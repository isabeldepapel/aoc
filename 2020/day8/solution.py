import re

def read_input(filename='input.txt'):
    with open(filename) as f:
        instructions = [tuple(line.split(' ')) for line in f.read().splitlines()]
    return instructions

def get_acc_value(instructions):
    run_lines = set()
    acc = 0
    i = 0

    while i not in run_lines and i < len(instructions):
        instruction = instructions[i]
        op, num_string = instruction
        run_lines.add(i)

        if op == 'nop':
            i += 1
        elif op == 'acc':
            acc += int(num_string)
            i += 1
        elif op == 'jmp':
            i += int(num_string)
    return acc

def has_loop(instructions):
    run_lines = set()
    i = 0

    while i < len(instructions):
        if i in run_lines:
            return True

        instruction = instructions[i]
        op, num_string = instruction
        run_lines.add(i)

        if op == 'nop':
            i += 1
        elif op == 'acc':
            i += 1
        elif op == 'jmp':
            i += int(num_string)

    return False

def fix_instructions(instructions):
    for i in range(len(instructions)):
        instruction = instructions[i]
        op = instruction[0]

        if op == 'acc':
            continue

        new_op = ''
        if op == 'nop':
            new_op = 'jmp'
        elif op == 'jmp':
            new_op = 'nop'
        
        new_instruction = (new_op, instruction[1])
        new_instructions = instructions[0:i] + [new_instruction] + instructions[i+1:]

        if not has_loop(new_instructions):
            return new_instructions

def test():
    instructions = read_input('test_input.txt')

    val = get_acc_value(instructions)
    assert val == 5, f'acc val is {val}'

    new_instructions = fix_instructions(instructions)
    final_val = get_acc_value(new_instructions)
    assert final_val == 8, f'acc val is {final_val}'

def run():
    test()
    instructions = read_input()
    val = get_acc_value(instructions)
    print(val)

    new_instructions = fix_instructions(instructions)
    new_val = get_acc_value(new_instructions)
    print(new_val)

run()