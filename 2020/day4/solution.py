import re
from functools import reduce

def read_input(filename):
    with open(filename) as f:
        passport_data = [re.split(r'[\s]', data) for data in f.read().strip().split('\n\n')]
        passports = [dict([item.split(':') for item in data]) for data in passport_data]
        return passports

def has_required_fields(passport):
    required_fields = set(['ecl', 'pid', 'eyr', 'hcl', 'byr', 'iyr', 'cid', 'hgt'])
    passport_fields = set(passport.keys())

    has_required_fields = (required_fields.difference(passport_fields) == set() 
                or required_fields.difference(passport_fields) == set(['cid']))
    return has_required_fields

def has_valid_fields(passport):
    # Assumes that all the relevant strings can be typecast into ints without throwing TypeErrors
    rules = dict({
        'byr': lambda x: int(x) >= 1920 and int(x) <= 2002,
        'iyr': lambda x: int(x) >= 2010 and int(x) <= 2020,
        'eyr': lambda x: int(x) >= 2020 and int(x) <= 2030,
        'hgt': lambda s: ((s[-2:] == 'cm' and (int(s[:-2]) >= 150 and int(s[:-2]) <= 193))
                            or (s[-2:] == 'in' and (int(s[:-2]) >= 59 and int(s[:-2]) <= 76))),
        'hcl': lambda s: (re.match(r'#[0-9a-f]{6}', s) is not None),
        'ecl': lambda s: s in set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']),
        'pid': lambda x: len(x) == 9 and int(x) >= 0,
        'cid': lambda x: True
    })

    for field in passport.keys():
        if not rules[field](passport[field]):
            return False    
    return True

def count_valid_passports_part1(filename):
    passports = read_input(filename)
    return [has_required_fields(passport) for passport in passports].count(True)


def count_valid_passports_part2(filename):
    passports = read_input(filename)
    return [(has_required_fields(passport) and has_valid_fields(passport)) for passport in passports].count(True)

def test():
    assert(count_valid_passports_part1('test_input.txt') == 2)
    assert(count_valid_passports_part2('invalid_input.txt') == 0)
    assert(count_valid_passports_part2('valid_input.txt') == 4)

test() 
print(count_valid_passports_part1('input.txt'))
print(count_valid_passports_part2('input.txt'))