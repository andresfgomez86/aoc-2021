import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n\n");

let paper: string[][] = [];

const fold = (dotList: string[], axis: string, value: number) => {
  let dots = new Set<string>();
  paper = [];
  if (axis === "y") {
    for (const dot of dotList) {
      const [initialX, initialY] = dot.split(",").map(value => parseInt(value));
      let x = initialX;
      let y = initialY;
      if (initialY > value) {
        const diff = initialY - value;
        y = value - diff;
      } else if (initialY === value) {
        continue;
      }
      paper[y] ??= [];
      paper[y][x] = "#";
      dots.add(`${x},${y}`);
    }
  } else {
    for (const dot of dotList) {
      const [initialX, initialY] = dot.split(",").map(value => parseInt(value));
      let x = initialX;
      let y = initialY;
      if (initialX > value) {
        const diff = initialX - value;
        x = value - diff;
      } else if (initialX === value) {
        continue;
      }
      paper[y] ??= [];
      paper[y][x] = "#";
      dots.add(`${x},${y}`);
    }
  }
  return Array.from(dots);
};

const printPaper = (input: string[][]) => {
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      input[i][j] ??= "."; 
    }
  }
  input.forEach(row => console.log(row.join("")));
}

const partOne = (input: string[]) => {
  const instructions = input[1].split("\n").map(instr => {
    const current = instr.split("=");
    return {
      axis: current[0][current[0].length - 1],
      value: parseInt(current[1])
    }
  }).slice(0, 1);

  let dotList = input[0].split("\n");
  for (const instr of instructions) {
    dotList = fold(dotList, instr.axis, instr.value);
  }
  return dotList.length;
} 

const partTwo = (input: string[]) => {
  const instructions = input[1].split("\n").map(instr => {
    const current = instr.split("=");
    return {
      axis: current[0][current[0].length - 1],
      value: parseInt(current[1])
    }
  });

  let dotList = input[0].split("\n");
  for (const instr of instructions) {
    dotList = fold(dotList, instr.axis, instr.value);
  }
  printPaper(paper);
  return dotList.length;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));