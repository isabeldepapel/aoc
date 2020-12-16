from functools import reduce
from collections import defaultdict

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

def generate_graph(adapters:list):
    graph = defaultdict(lambda:None)
    adapters = [0] + adapters # Add 0 to the graph
    
    i = 0
    while i < len(adapters):
        adapter = adapters[i]
        
        start = i + 1
        end = i + 3
        edges = set()
        while start <= end and start < len(adapters):
            if adapters[start] <= adapter + 3:
                edges.add(adapters[start])
            start += 1

        graph[adapter] = edges
        i += 1

    # add final edge to the device (adapter + 3)
    graph[adapters[-1]] = set([adapters[-1] + 3])
    return graph

def dfs_helper(graph:dict, node:int, memo:dict):
    neighbors = graph[node]
    if not neighbors:
        return 1
    
    count = 0
    for neighbor in neighbors:
        if neighbor in memo:
            count += memo[neighbor]
        else:
            count += dfs_helper(graph, neighbor, memo)
    memo[node] = count
    return count

def dfs(graph:dict):
    path_memo = dict()

    count = dfs_helper(graph, 0, path_memo)
    return count

def get_streaks(adapters:list) -> list:
    i = 0
    num_streaks = []
    streaks = []
    adapters = [0] + adapters # Add 0 to the list

    while i < len(adapters):
        start = i
        end = i + 1

        while end < len(adapters) and adapters[end] == adapters[end-1] + 1:
            end += 1

        streaks.append(tuple(adapters[start:end]))
        num_streaks.append(end - start)
        i = end
    
    print(streaks)
    return sorted(num_streaks)

def count_arrangements(num_streaks:list) -> int:
    # Num arrangements is the multiple of all possible combinations of the groups
    # The number of combos in a group is equal to the sum of the preceding three combos
    # (starting with combo length 4)
    # Index of num_combos is the length of the streak 
    num_combos = [1, 1, 1, 2, 4, 7]
    num_combos_len = len(num_combos)

    while num_streaks[-1] > num_combos_len:
        num_combos.append(sum(num_combos[-3:]))
        num_combos_len += 1
    
    total = reduce(lambda x,y: x*y, [num_combos[num] for num in num_streaks])
    print(total)
    return total

def test():
    adapters = read_input('test_input.txt')
    dist = get_distribution(sorted(adapters))
    dist_product = dist[1] * dist[3]
    assert dist_product == 35, f'product is {dist_product}'
    
    new_adapters = read_input('test_input2.txt')
    new_dist = get_distribution(sorted(new_adapters))
    new_dist_product = new_dist[1] * new_dist[3]
    assert new_dist_product == (22 * 10), f'product is {new_dist[1]} * {new_dist[3]}'

    # using combos
    num_combos = count_arrangements(get_streaks(adapters))
    assert num_combos == 8, f'num combos is {possible_combos}'

    new_num_combos = count_arrangements(get_streaks(new_adapters))
    assert new_num_combos == 19208, f'num combos is {new_num_combos}'
    
    # using dfs
    graph = generate_graph(adapters)
    print(graph)
    num_combos_with_dfs = dfs(graph)
    assert num_combos_with_dfs == 8, f'num combos is {num_combos_with_dfs}'

    new_graph = generate_graph(new_adapters)
    print(new_graph)
    new_num_combos_with_dfs = dfs(new_graph)
    assert new_num_combos_with_dfs == 19208, f'num combos is {new_num_combos_with_dfs}'


def run():
    test()

    adapters = read_input('input.txt')
    dist = get_distribution(adapters)
    print(dist)
    print(dist[1] * dist[3])

    print(adapters)
    num_streaks = get_streaks(adapters)
    count_arrangements(num_streaks)


run()