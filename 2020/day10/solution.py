from functools import reduce

def read_input(filename='input.txt'):
    with open(filename) as f:
        adapters = [int(line) for line in f.read().splitlines()]
        return sorted(adapters)

def get_distribution(adapters):
    distribution = dict({ 1: 0, 2: 0, 3: 0 })
    device_joltage = adapters[-1] + 3

    current_joltage = 0
    for adapter in adapters:
        difference = adapter - current_joltage

        distribution[difference] += 1
        current_joltage = adapter
    
    # add the device, which is a difference of three
    distribution[3] += 1
    return distribution

def generate_graph(adapters):
    graph = dict()
    i = 0
    while i < len(adapters):
        adapter = adapters[i]
        start = i
        end = i+1

        while adapter
        graph[adapter]


def test():
    adapters = read_input('test_input.txt')
    dist = get_distribution(sorted(adapters))
    dist_product = dist[1] * dist[3]
    assert dist_product == 35, f'product is {dist_product}'
    
    new_adapters = read_input('test_input2.txt')
    new_dist = get_distribution(sorted(new_adapters))
    new_dist_product = new_dist[1] * new_dist[3]
    assert new_dist_product == (22 * 10), f'product is {new_dist[1]} * {new_dist[3]}'

    possible_combos = count_possible_arrangements(adapters)
    assert possible_combos == 8, f'num combos is {possible_combos}'

    new_possible_combos = count_possible_arrangements(new_adapters)
    assert new_possible_combos == 19208, f'num combos is {new_possible_combos}'

def run():
    test()

    adapters = read_input('input.txt')
    dist = get_distribution(adapters)
    print(dist)
    print(dist[1] * dist[3])

    # print(adapters)


run()