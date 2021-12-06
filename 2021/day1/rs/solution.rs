use std::fs::File;
use std::io::prelude::*;

fn read_file(fpath: &str) -> std::io::Result<String> {
    let mut file = File::open(fpath)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn get_numbers(wrapped_string: Result<String, std::io::Error>) -> Vec<i32> {
    let numbers: Vec<i32> = wrapped_string
        .unwrap()
        .trim()
        .split('\n')
        .map(|s| s.parse::<i32>().unwrap())
        .collect();

    numbers
}

fn count_increasing(numbers: Vec<i32>, window: usize) -> i32 {
  let mut count = 0;
  for i in 0..numbers.len() - window {
    if numbers[i + window] > numbers[i] {
      count += 1;
    }
  }
  count
}

fn main() -> std::io::Result<()> {
    let numbers = read_file("../testInput.txt");
    let numbers = get_numbers(numbers);
    assert_eq!(count_increasing(numbers, 1), 7);

    let count = count_increasing(get_numbers(read_file("../input.txt")), 1);
    println!("Result is: {}", count);

    assert_eq!(count_increasing(get_numbers(read_file("../testInput.txt")), 3), 5);

    println!("Result is {}", count_increasing(get_numbers(read_file("../input.txt")), 3));
    Ok(())
}