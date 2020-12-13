import re

def read_input(filename='input.txt'):
    with open(filename) as f:
        rules_data = [[item.strip().split(' ') for item in re.split(r'contain |, ', line)] for line in f]
        return rules_data

        # reverse_rules = dict()
        # for rule_data in rules_data:
        #     container = ' '.join(rule_data[0][:2])
        #     for contained_data in rule_data[1:]:
        #         if contained_data[0] == 'no':
        #             if 'empty' in reverse_rules:
        #                 reverse_rules['empty'].add(container)
        #             else:
        #                 reverse_rules['empty'] = set([container])
        #         else:
        #             num = int(contained_data[0])
        #             color = ' '.join(contained_data[1:3])
        #             if color in reverse_rules:
        #                 reverse_rules[color][container] = num
        #             else:
        #                 reverse_rules[color] = { container: num }

        # # print(reverse_rules)
        # return reverse_rules
    
def generate_contained_by_graph(rules_data:list):
    """
    Returns a dict representing a graph of which bags are contained by other bags, and in what numbers.
    For example, if blue bags contain 2 red bags, then the dict would be { red: { blue: 2 } }.
    The inverse of generate_container_graph.

    Parameters:
    rules_data (list): A list of parsed input where each rule is a list of lists, each part of the rule
    itself split into a list based on whitespace.

    Returns a dict
    """
    rules = dict()
    for rule_data in rules_data:
        container = ' '.join(rule_data[0][:2])
        for contained_data in rule_data[1:]:
            if contained_data[0] == 'no':
                if 'empty' in rules:
                    rules['empty'].add(container)
                else:
                    rules['empty'] = set([container])
            else:
                num = int(contained_data[0])
                color = ' '.join(contained_data[1:3])
                if color in rules:
                    rules[color][container] = num
                else:
                    rules[color] = { container: num }

    return rules

def generate_container_graph(rules_data):
    """
    Returns a dict representing a graph of which bags contain other bags, and in what numbers.
    For example, if blue bags contain 2 red bags, then the dict would be { blue: { red: 2 } }.
    The inverse of generate_contained_by_graph.

    Parameters:
    rules_data (list): A list of parsed input where each rule is a list of lists, each part of the rule
    itself split into a list based on whitespace.

    Returns a dict
    """

    rules = dict()
    for rule_data in rules_data:
        container = ' '.join(rule_data[0][:2])
        for contained_data in rule_data[1:]:
            if contained_data[0] != 'no':
                # rules[container] = {}
            # else:
                num = int(contained_data[0])
                color = ' '.join(contained_data[1:3])
                if container in rules:
                    rules[container][color] = num
                else:
                    rules[container] = { color: num }
    
    return rules

def get_container_bags_count(rules):
    bags = set(list(rules['shiny gold'].keys()))
    bags_to_check = set(list(rules['shiny gold'].keys()))

    while bags_to_check:
        bag = bags_to_check.pop()
        if bag not in bags:
            bags.add(bag)

        if bag in rules:
            bags_to_check = bags_to_check.union(rules[bag].keys())
    
    return len(bags)

def get_total_bag_count(rules, current_bag='shiny gold'):
    if current_bag not in rules:
        return 0
    
    info = rules[current_bag]
    return sum([num + (num * get_total_bag_count(rules, color)) for (color, num) in info.items()])

def test():
    data = read_input('test_input.txt')
    contained_by_bags_rules = generate_contained_by_graph(data) 
    num_container_bags = get_container_bags_count(contained_by_bags_rules)
    assert num_container_bags == 4

    container_bags_rules = generate_container_graph(data)
    print(container_bags_rules)
    num_contained_bags = get_total_bag_count(container_bags_rules)
    assert num_contained_bags == 32, f'num bags is {num_contained_bags}'
    
    new_data = read_input('test_input2.txt')
    new_container_bags_rules = generate_container_graph(new_data)
    new_num_bags = get_total_bag_count(new_container_bags_rules)
    assert new_num_bags == 126, f'num bags is {new_num_bags}'

def run():
    test()
    data = read_input('input.txt')
    contained_by_bags_rules = generate_contained_by_graph(data)
    num_container_bags = get_container_bags_count(contained_by_bags_rules)
    print(num_container_bags)

    container_bags_rules = generate_container_graph(data)
    total_bag_count = get_total_bag_count(container_bags_rules)
    print(total_bag_count)

run()