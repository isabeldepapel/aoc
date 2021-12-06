use std::fs::File;
use std::io::prelude::*;

fn read_file(fpath: &str) -> std::io::Result<String> {
  let mut file = File::open(fpath)?;
  let mut contents = String::new();
  file.read_to_string(&mut contents)?;
  Ok(contents)
}

fn parse_line(s: &str) -> (i32, i32, i32) {
  let test: Vec<&str> = s.trim().split(' ').collect();
  let dir = test[0];
  let num = test[1].parse::<i32>().unwrap();

  match dir {
    "forward" => return (num, 0, num),
    "up" => return (0, -num, 0),
    "down" => return (0, num, 0),
    _ => return (0, 0, 0),
  }
}

fn parse_file(wrapped_string: Result<String, std::io::Error>) -> Vec<(i32, i32, i32)> {
  let directions = wrapped_string
    .unwrap()
    .trim()
    .split('\n')
    .map( |s| parse_line(s))
    .collect();
  directions
}

fn reducer(prev: (i32, i32, i32), curr: &(i32, i32, i32)) -> (i32, i32, i32) {
  let (x1, y1, z1) = prev;
  let (x2, y2, z2) = curr;
  (x1 + x2, y1 + y2, z1 + z2 * (y2 + y1))
}

fn main() -> std::io::Result<()> {
  let test_steps = parse_file(read_file("../testInput.txt"));
  let final_pos = test_steps.iter().fold((0, 0, 1), reducer);
  assert_eq!(final_pos.0 * final_pos.1, 150);

  let steps = parse_file(read_file("../input.txt"));
  let final_pos = steps.iter().fold((0, 0, 1), reducer);
  println!("Result is: {}", final_pos.0 * final_pos.1);

  let final_pos = test_steps.iter().fold((0, 0, 0), reducer);
  assert_eq!(final_pos.0 * final_pos.2, 900);

  let final_pos = steps.iter().fold((0, 0, 0), reducer);
  println!("Result is: {}", final_pos.0 * final_pos.2);
  Ok(())
}