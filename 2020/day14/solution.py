def read_input(filename='input.txt'):
    with open(filename) as f:
       
        mask_instructions = [line.strip().split('\n') for line in f.read().split('mask = ')]
        instructions = [[item[0], item[1:]] for item in mask_instructions[1:]]

        parsed_instructions = []
        for mask, mem_instructions in instructions:
            mask_info = dict()
            for i in range(len(mask)):
                # if mask[i] != 'X':
                mask_info[i] = mask[i]
            parsed_mem_instructions = dict()
            for mem_instruction in mem_instructions:
                mem_address, value = mem_instruction.split(' = ')
                address = mem_address[4:-1]
                if address not in parsed_mem_instructions:
                    parsed_mem_instructions[address] = [int(value)]
                else:
                    parsed_mem_instructions[address].append(int(value))
            parsed_instructions.append([mask_info, parsed_mem_instructions])

        return parsed_instructions

def apply_mask_to_val(mask:dict, val:int) -> str:
    bin_str = format(val, '036b')
    new_str = list(bin_str)
    for i, new_val in mask.items():
        if new_val == 'X':
            continue
        new_str[i] = new_val
    return ''.join(new_str)

def apply_mask_to_mem(mask:dict, val:int) -> list:
    bin_str = format(val, '036b')
    new_str = list(bin_str)
    floating_indexes = []
    for i, new_val in mask.items():
        if new_val == '0':
            continue
        elif new_val == '1':
            new_str[i] = new_val
        else:
            # separate out Xs
            floating_indexes.append(i)
    
    # apply floating nums
    num_mem_writes = len(floating_indexes)

    mem_writes = [new_str]
    mem_writes_len = 1
    for i in range(len(floating_indexes)):
        idx_to_change = floating_indexes[i]

        dup = [item.copy() for item in mem_writes]
        first_half = [item[0:idx_to_change] + ['0'] + item[idx_to_change+1:] for item in dup]
        second_half = [item[0:idx_to_change] + ['1'] + item[idx_to_change+1:] for item in mem_writes]
        mem_writes = first_half + second_half

    return [''.join(item) for item in mem_writes]

def run_program_1(instructions:list):
    memory = dict()
    for mask, mem_vals in instructions:
        for address, mem_vals in mem_vals.items():
            # Ignore anything but the final val
            val = mem_vals[-1]
            memory[address] = apply_mask_to_val(mask, val)            

    total = sum(map(lambda x: int(x, 2), memory.values()))
    return total

def run_program_2(instructions:list):
    memory = dict()
    for mask, mem_vals in instructions:
        for address, mem_vals in mem_vals.items():
            mem_addresses = apply_mask_to_mem(mask, int(address))

            for mem_address in mem_addresses:
                memory[mem_address] = mem_vals[-1]
    
    total = sum(map(lambda x: int(x), memory.values()))
    print('total', total)
    return total

def test():
    filename = 'test_input.txt'
    instructions = read_input(filename)
   
    total = run_program_1(instructions)
    assert total == 165, f'total is {total}'

    new_instructions = read_input('test_input2.txt')
    new_total = run_program_2(new_instructions)
    assert new_total == 208, f'new total is {new_total}'

def run():
    test()

    instructions = read_input()
    total = run_program_1(instructions)

    new_total = run_program_2(instructions)

run()