def read_input(filename='input.txt'):
    with open(filename) as f:
        notes = f.read().splitlines()
        timestamp = notes[0]
        schedule = notes[1].split(',')
    return {
        'timestamp': int(timestamp),
        'schedule': schedule
    }

def get_running_buses(schedule:list):
    return map(int, 
        filter(lambda x: x != 'x', schedule)
    )

def get_earliest_bus(notes:dict):
    timestamp, schedule = notes.values()
    buses = get_running_buses(schedule)

    earliest_times = []
    for bus in buses:
        mult = timestamp // bus
        earliest_times.append((bus * mult + bus, bus))
    
    return min(earliest_times)

def get_schedule_with_offsets(schedule:list):
    schedule_with_offsets = dict()
    for i in range(len(schedule)):
        if schedule[i] != 'x':
            # schedule_with_offsets[i] = int(schedule[i])
            schedule_with_offsets[int(schedule[i])] = i
    return schedule_with_offsets

def part1(notes:dict):
    timestamp = notes['timestamp']
    earliest_bus = get_earliest_bus(notes)

    arrival_time, bus_id = earliest_bus
    return (arrival_time - timestamp) * bus_id

# def found_timestamp(timestamp, schedule_with_offsets:dict):
#     # for offset, bus_id in schedule_with_offsets.items():
#     for bus_id, offset in schedule_with_offsets.items():
#         if (timestamp + offset) % bus_id != 0:
#             return False

#     return True

def gcd(a,b):
    """Greatest common divisor"""
    while b > 0:
        a, b = b, a % b
    return a

def lcm(a,b):
    """Least common multiple"""
    return a * b / gcd(a,b)

def t():
    # a = 373, offset = 50
    # b = 367, offset = 19
    t = 323
    # t = 115953
    while (t + 19) % 367 != 0:
        t += 373
    print(f'found t: {t}')

def found_timestamp(schedule_with_offsets:dict, buses:list, t:int):
    # Checks the buses except for the last two
    # for i in range()
    for i in range(2, len(buses)):
        bus = buses[i]
        offset = schedule_with_offsets[bus]
        if (t + offset) % bus != 0:
            return False
    return True

def find_offset_lcm(larger, smaller, schedule_with_offsets, starting_t=None):
    larger_offset = schedule_with_offsets[larger]
    smaller_offset = schedule_with_offsets[smaller]
    if starting_t is None:
        t = larger - larger_offset
        print('starting t', t)
    else:
        t = starting_t + larger

    while (t + smaller_offset) % smaller != 0:
        t += larger
    print('offset lcm', t)
    return t

def find_next_lcm(offset_lcm1, offset_lcm2, schedule_with_offsets):
    buses = sorted(schedule_with_offsets.keys(), reverse=True)
    t1 = find_offset_lcm(buses[0], buses[1], schedule_with_offsets, starting_t=t1)
    t2 = find_offset_lcm(buses[0], buses[2], schedule_with_offsets, starting_t=t1)

    last_three_lcm = lcm(t1, t2)
    print('next lcm', last_three_lcm)
    
def part2(notes:dict):
    schedule = notes['schedule']
    schedule_with_offsets = get_schedule_with_offsets(schedule)
    print(schedule_with_offsets)
    # {0: 19, 9: 41, 13: 37, 19: 367, 32: 13, 36: 17, 48: 29, 50: 373, 73: 23}
    # {19: 0, 41: 9, 37: 13, 367: 19, 13: 32, 17: 36, 29: 48, 373: 50, 23: 73}

    buses = sorted(schedule_with_offsets.keys(), reverse=True)
    offsets = list(schedule_with_offsets.values())
    print(buses)

    # Iterate through lcms of largest two numbers
    t = find_offset_lcm(buses[0], buses[1], schedule_with_offsets)
    # t1 = find_offset_lcm(buses[0], buses[1], schedule_with_offsets)
    # t2 = find_offset_lcm(buses[0], buses[2], schedule_with_offsets)
    # print(t1, t2)
    # last_three_lcm = lcm(t1, t2)
    # print(last_three_lcm)

    while True:
        found = found_timestamp(schedule_with_offsets, buses, t)
        if t > 100000000000 and t % 500000000000 == 0:
            print('current t', t)
        # print('t', t)
        if found:
            print('found the right t', t)
            return t
        t = find_offset_lcm(buses[0], buses[1], schedule_with_offsets, t)
        # print(t)
# {7: 0, 
# 13: 1, 
# 59: 4, 
# 31: 6, 
# 19: 7}
# [59, 31, 19, 13, 7]
    # t 1065805
    # t 1067045
    # t 1068285
    # t 1069525
    
    # while True: 
    #     if t > 1068790: 
    #         print(f'failed, current t:{t}')
    #         # return

    #     found = found_timestamp(t, schedule_with_offsets)
    #     if found:
    #         print('found the right t', t)
    #         return t
    #     t += 1

# (t / 373)x - 31 = (t/367)y
# (367t/373)x - 11377 = ty
# 367tx - 4243621 = 373ty
# 367tx - 373ty = 4243621




# (t + 19) / 367 = x   348
# (t + 50) / 373 = y   323
# 348x >= 323y

# 373x - 31 >= 367x

# 373x - 31 >= 367
# 373x >= 398  148454
# 373x - 41 >= 41
# 373x >= 82

def test():
    filename = 'test_input.txt'
    notes = read_input(filename)
    val = part1(notes)
    assert val == 295, f'val is {val}'

    part2(notes)
    
def run():
    test()

    notes = read_input()
    timestamp = notes['timestamp']
    val = part1(notes)
    print(val)

    # part2(notes)

run()