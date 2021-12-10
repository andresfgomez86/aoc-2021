import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const validElements = new Map<string, string>();
validElements.set('(', ')');
validElements.set('[', ']');
validElements.set('{', '}');
validElements.set('<', '>');

const partOne = (input: string[]) => {
  const scores = new Map<string, number>();
  scores.set(')', 3);
  scores.set(']', 57);
  scores.set('}', 1197);
  scores.set('>', 25137);

  let finalScore = 0;

  for (const line of input) {
    const history: string[] = [];
    let isCorrupted = false;
    for (let i = 0; i < line.length && !isCorrupted; i++) {
      const element = line[i];
      if (validElements.has(element)) {
        history.push(element);
      } else {
        const lastOpener = history.pop() || '';
        if (validElements.get(lastOpener) !== element) {
          isCorrupted = true;
          finalScore += scores.get(element) || 0;
        }
      }
    }
  }
  return finalScore;
} 

const partTwo = (input: string[]) => {

  const scores = new Map<string, number>();
  scores.set(')', 1);
  scores.set(']', 2);
  scores.set('}', 3);
  scores.set('>', 4);

  let incompleteScores: number[] = [];
  for (const line of input) {
    let history: string[] = [];
    let isCorrupted = false;
    for (let i = 0; i < line.length && !isCorrupted; i++) {
      const element = line[i];
      if (validElements.has(element)) {
        history.push(element);
      } else {
        const lastOpener = history.pop() || '';
        if (validElements.get(lastOpener) !== element) {
          isCorrupted = true;
          history = [];
        }
      }
    }

    if (history.length) {
      let incompleteScore: number = 0;
      for (let i = history.length - 1; i >= 0; i--) {
        const lastOpener = history.pop() || '';
        const elementScore = scores.get(validElements.get(lastOpener) || '') || 0;
        incompleteScore = incompleteScore * 5 + elementScore;
      }
      incompleteScores.push(incompleteScore);
    }
  }
  incompleteScores = incompleteScores.sort((a, b) => a - b);
  return incompleteScores[Math.floor(incompleteScores.length / 2)];
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));