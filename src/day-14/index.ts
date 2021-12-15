import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n\n");

const getMinAndMax = (ocurrences: Map<string, number>) => {
  let minValue = Infinity;
  let maxValue = -Infinity;
  ocurrences.forEach((value) => {
    if (value >= maxValue) {
      maxValue = value;
    }
    if (value <= minValue) {
      minValue = value;
    }
  });
  return [minValue, maxValue];
};

const partOne = (input: string[]) => {
  const template = input[0];
  const pairs = input[1].split("\n");
  const rules = new Map<string, string>();
  const occurrences = new Map<string, number>();
  for (const pair of pairs) {
    const [from, to] = pair.split(" -> ");
    rules.set(from, to);
  }
  let result = template;
  for (let i = 0; i < 10; i++) {
    let temp = result;
    let inserted = 0;
    occurrences.clear();
    occurrences.set(result[0], 1);
    for (let j = 0; j < result.length - 1; j++) {
      const from = `${result[j]}${result[j+1]}`;
      const to = rules.get(from) || "";
      const part1 = temp.slice(0, j+inserted+1);
      const part2 = temp.slice(j+inserted+1);
      temp = `${part1}${to}${part2}`;
      occurrences.set(result[j+1], (occurrences.get(result[j+1]) || 0)+1);
      occurrences.set(to, (occurrences.get(to) || 0)+1);
      inserted++;
    }
    result = temp;
  }
  const [min, max] = getMinAndMax(occurrences);
  return max - min;
} 

const partTwo = (input: any) => {
  const template = input[0];
  const rawRules = input[1].split("\n");
  const rules = new Map<string, string>();
  let occurrences = new Map<string, number>();
  for (const rule of rawRules) {
    const [from, to] = rule.split(" -> ");
    rules.set(from, to);
  }

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i+1];
    occurrences.set(pair, (occurrences.get(pair) || 0) + 1);
  }

  for (let i = 0; i < 40; i++) {
    const temp = new Map<string, number>();
    occurrences.forEach((count, pair) => {
      const to = rules.get(pair);
      const leftPair = pair[0] + to;
      const rightPair = to + pair[1];

      temp.set(leftPair, (temp.get(leftPair) || 0) + count);
      temp.set(rightPair, (temp.get(rightPair) || 0) + count);
    })
    occurrences = temp;
  }

  const letterOcurrences = new Map<string, number>();
  occurrences.forEach((count, pair) => {
    const leftLetter = pair[0];
    letterOcurrences.set(leftLetter, (letterOcurrences.get(leftLetter) || 0) + count);
  });

  letterOcurrences.set(template[template.length - 1], (letterOcurrences.get(template[template.length - 1]) || 0) + 1);

  const [min, max] = getMinAndMax(letterOcurrences);
  return max - min;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));
