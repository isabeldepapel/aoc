use std::fs::File;
use std::io::prelude::*;

fn read_file(fpath: &str) -> std::io::Result<String> {
    let mut file = File::open(fpath)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn get_calories(wrapped_string: Result<String, std::io::Error>) -> Vec<u64> {
    let calories: Vec<u64> = wrapped_string
        .unwrap()
        .trim()
        .split("\n\n")
        .map(|s| s.split("\n").collect())
        .map(|s: Vec<&str>| s.iter().map(|n| n.parse::<u64>().unwrap()).collect())
        .map(|n: Vec<u64>| n.into_iter().reduce(|a, b| a + b).unwrap())
        .collect();

    calories
}

fn reducer(mut arr: [u64; 3], val: u64) -> [u64; 3] {
    // arr is the top 3 vals desc sort
    if val > arr[0] {
        arr[2] = arr[1];
        arr[1] = arr[0];
        arr[0] = val;
    } else if val > arr[1] {
        arr[2] = arr[1];
        arr[1] = val;
    } else if val > arr[2] {
        arr[2] = val;
    }
    arr
}

fn find_top_three(calories: Vec<u64>) -> [u64; 3] {
    let top_three = calories.clone().into_iter().fold([0, 0, 0], reducer);
    top_three
}

fn main() -> std::io::Result<()> {
    let calories = read_file("testInput.txt");
    let calories = get_calories(calories);
    assert_eq!(calories.clone().into_iter().max().unwrap(), 24000);

    println!(
        "Result is {}",
        get_calories(read_file("input.txt")).iter().max().unwrap()
    );

    assert_eq!(find_top_three(calories).iter().sum::<u64>(), 45000);

    println!(
        "Result is {:?}",
        find_top_three(get_calories(read_file("input.txt")))
            .iter()
            .sum::<u64>()
    );
    Ok(())
}
