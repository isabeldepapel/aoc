def read_input(filename='input.txt'):
    with open(filename) as f:
        sections = f.read().split('\n\n')

        ticket_notes = dict()
        ticket_notes['notes'] = sections[0].strip().split('\n')            
        ticket_notes['mine'] = list(map(int, sections[1].strip().split('\n')[1].split(',')))
        ticket_notes['nearby'] = [list(map(int, [char for char in line.split(',')])) for line in sections[2].strip().split('\n')[1:]]
        
        # parse num ranges in notes
        orig_notes = ticket_notes['notes']
        ticket_notes['notes'] = dict()
        for l in orig_notes:
            field, vals = l.split(': ')
            parsed_line = vals.split(' or ')
            ranges = [tuple(map(int, range_str.split('-'))) for range_str in parsed_line]
            ticket_notes['notes'][field] = ranges
        # print(ticket_notes)
        return ticket_notes

def is_valid(num_ranges:list, ticket:list):
    for num in ticket:
        valid = True
        for rule in num_ranges:
            for min_num, max_num in rule:
                if num < min_num or num > max_num:
                    return False
    return True

def get_valid_rules(rules:dict, ticket:list):
    valid_rules_by_pos = dict()
    # for num in ticket:
    for i in range(len(ticket)):
        num = ticket[i]
        rules = set()
        for rule_name, rule_list in rules.items():
            for rule in rule_list:
                for min_num, max_num in rule:
                    if num >= min_num and num <= max_num:
                        rules.add(rule_name)
        valid_rules_by_pos[i] = rules
    print(valid_rules_by_pos)
    return valid_rules_by_pos

def find_invalid_tickets(notes:dict):
    ticket_notes = notes['notes']
    num_ranges = ticket_notes.values()
    # print(num_ranges)
    # num_ranges = []
    # for l in ticket_notes:
    #     parsed_line = l[l.index(':') +2:].split(' or ')
    #     ranges = [tuple(map(int, range_str.split('-'))) for range_str in parsed_line]
    #     num_ranges.append(ranges)

    invalid_tickets = dict()
    nearby = notes['nearby']
    # for ticket in notes['nearby']:
    for i in range(len(nearby)):
        ticket = nearby[i]
        for num in ticket:
            invalid = True
            for rule in num_ranges:
                for min_num, max_num in rule:
                    if num >= min_num and num <= max_num:
                        invalid = False
            if invalid:
                # invalid_tickets.append((i, num))
                invalid_tickets[i] = num

    return invalid_tickets
    # return sum(invalid_tickets)

def get_valid_tickets(notes:dict, invalid_tickets:dict):
    valid_tickets = []
    nearby = notes['nearby']

    for i in range(len(nearby)):
        if i not in invalid_tickets:
            valid_tickets.append(nearby[i])
    
    return valid_tickets

def identify_fields(notes:dict, invalid_tickets:dict):
    valid_tickets = get_valid_tickets(notes, invalid_tickets)

    

def test():
    filename = 'test_input.txt'
    notes = read_input(filename)
    invalid_tickets = find_invalid_tickets(notes)
    error_rate = sum(invalid_tickets.values())
    assert error_rate == 71, f'error rate is {error_rate}'

    valid_tickets = get_valid_tickets(notes, invalid_tickets)
    assert valid_tickets == [[7,3,47]]

def run():
    test()

    notes = read_input()
    invalid_tickets = find_invalid_tickets(notes)
    print(sum(invalid_tickets.values()))
    # print(find_invalid_tickets(notes))
    valid_tickets = get_valid_tickets(notes, invalid_tickets)
    print(len(valid_tickets))

run()