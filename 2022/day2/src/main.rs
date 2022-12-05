use phf::phf_map;
use std::fs::File;
use std::io::prelude::*;

fn read_file(fpath: &str) -> std::io::Result<String> {
    let mut file = File::open(fpath)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn get_strategy_guide(wrapped_string: Result<String, std::io::Error>) -> Vec<Vec<String>> {
    let guide: Vec<Vec<String>> = wrapped_string
        .unwrap()
        .trim()
        .split("\n")
        .map(|s| s.split(" ").map(String::from).collect())
        .collect();
    guide
}

#[derive(Debug, Clone, Copy)]
enum Outcome {
    Lose = 0,
    Draw = 3,
    Win = 6,
}

#[derive(PartialEq, Debug, Clone, Copy)]
enum Shape {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

static OPP_MOVES: phf::Map<&'static str, Shape> = phf_map! {
  "A" => Shape::Rock,
  "B" => Shape::Paper,
  "C" => Shape::Scissors
};

static MY_MOVES: phf::Map<&'static str, Shape> = phf_map! {
  "X" => Shape::Rock,
  "Y" => Shape::Paper,
  "Z" => Shape::Scissors
};

static OUTCOMES: phf::Map<&'static str, Outcome> = phf_map! {
  "X" => Outcome::Lose,
  "Y" => Outcome::Draw,
  "Z" => Outcome::Win
};

fn get_outcome(opp: &str, me: &str) -> Outcome {
    if OPP_MOVES[opp] == MY_MOVES[me] {
        Outcome::Draw
    } else if OPP_MOVES[opp] as i32 - MY_MOVES[me] as i32 == 1
        || OPP_MOVES[opp] as i32 - MY_MOVES[me] as i32 == -2
    // rock beats scissors
    {
        Outcome::Lose
    } else {
        Outcome::Win
    }
}

fn get_move(opp: &str, outcome: &str) -> Shape {
    let opp_move: Shape = OPP_MOVES[opp];
    // Apparently there's no easy way to look up an enum variant by its discriminant
    // so this a super jank quick hack to get the shape from the discriminant
    let shapes: [Shape; 3] = [Shape::Rock, Shape::Paper, Shape::Scissors];
    match OUTCOMES[outcome] {
        Outcome::Draw => opp_move,
        Outcome::Win => {
            // winning move is opp_move + 1; subtract one after mod since
            // discriminant starts at 1, not 0 (for idx)
            // need to handle modding negative nums
            // so add a three after sutracting the final 1 and mod again
            let idx: i8 = ((opp_move as usize + 1) % 3) as i8 - 1;
            let uidx: usize = (idx + 3) as usize % 3;
            shapes[uidx]
        }
        Outcome::Lose => {
            // same as above, but losing move is opp_move - 1
            let idx: i8 = ((opp_move as usize) as i8 - 1) % 3 - 1;
            let uidx = (idx + 3) as usize % 3;
            shapes[uidx]
        }
    }
}

fn get_score_from_moves(line: Vec<String>) -> i32 {
    // Get shape from move
    let opp_move = &line[0];
    let my_move = &line[1];

    // Score is shape plus outcome
    let score = MY_MOVES[my_move] as i32 + get_outcome(opp_move, my_move) as i32;
    score
}

fn get_score_from_outcome(line: Vec<String>) -> i32 {
    let opp_move = &line[0];
    let outcome = &line[1];

    let my_move = get_move(opp_move, outcome);
    let score = my_move as i32 + OUTCOMES[outcome] as i32;
    score
}

fn main() -> std::io::Result<()> {
    let test_guide = get_strategy_guide(read_file("testInput.txt"));
    println!("guide is {:?}", test_guide);
    let test_result: i32 = test_guide
        .iter()
        .map(|line| get_score_from_moves(line.to_vec()))
        .sum();
    assert_eq!(test_result, 15);

    let guide = get_strategy_guide(read_file("input.txt"));

    let result: i32 = guide
        .iter()
        .map(|line: &Vec<String>| get_score_from_moves(line.to_vec()))
        .sum();

    println!("Result is {}", result);

    assert_eq!(
        test_guide
            .iter()
            .map(|line: &Vec<String>| get_score_from_outcome(line.to_vec()))
            .sum::<i32>(),
        12
    );

    println!(
        "new result is {}",
        guide
            .iter()
            .map(|line: &Vec<String>| get_score_from_outcome(line.to_vec()))
            .sum::<i32>()
    );
    Ok(())
}
