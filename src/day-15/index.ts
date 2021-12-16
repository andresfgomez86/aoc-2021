import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

interface Position {
  x: number,
  y: number,
  risk: number
  previous: string
}

const printPath = (input: string[], tags: Map<string, Position>) => {
  let current = `${input.length - 1},${input[0].length - 1}`;
  let count = tags.get(current)!.risk;
  while (current !== "0,0") {
    const [y,x] = current.split(',').map(value => parseInt(value)); 
    count -= parseInt(input[y][x]);
    console.log(current, input[y][x], tags.get(current)!.risk);
    
    current = tags.get(current)!.previous;
  }
}

const getRisk = (y: number, x: number, input: string[]) => {
  let originalY = y;
  let originalX = x;
  let extraYRisk = 0;
  let extraXRisk = 0;
  if (y >= input.length) {
    originalY = y % input.length;
    extraYRisk = Math.floor(y / input.length);
  }
  if (x >= input[0].length) {
    originalX = x % input[0].length;
    extraXRisk = Math.floor(x / input[0].length);
  }
  originalY = originalY === input.length ? 0 : originalY;
  originalX = originalX === input[0].length ? 0 : originalX;
  const newRisk = parseInt(input[originalY][originalX]) + extraYRisk + extraXRisk;
  if (newRisk > 9) {
    return newRisk - 9;
  }
  return newRisk;
}

const getPathRisk = (input: string[], xTimes = 1) => {
  let queue: string[] = [];
  const tags = new Map<string, Position>();
  const root: Position = {
    x: 0,
    y: 0,
    risk: 0,
    previous: ''
  }
  tags.set('0,0', root);
  let x = 0;
  let y = 0;
  let pathFound = false;
  while (!pathFound) {
    const accumRisk = tags.get(`${y},${x}`)?.risk || 0;
    if (y - 1 >= 0 && x >= 0) {
      const id = `${y-1},${x}`;
      const risk = getRisk(y-1, x, input);
      const up: Position = {
        x,
        y: y-1,
        risk: accumRisk + risk,
        previous: `${y},${x}`
      }
      if (!tags.has(id)) {
        queue.push(id);
      }
      if (!tags.has(id) || up.risk <= tags.get(id)!.risk) {
        tags.set(id, up);
      }
    }
    if (y + 1 < input.length * xTimes && x >= 0) {
      const id = `${y+1},${x}`;
      const risk = getRisk(y+1, x, input);
      const down: Position = {
        x,
        y: y+1,
        risk: accumRisk + risk,
        previous: `${y},${x}`
      }
      if (!tags.has(id)) {
        queue.push(id);
      }
      if (!tags.has(id) || down.risk <= tags.get(id)!.risk) {
        tags.set(id, down);
      }
    }
    if (x - 1 >= 0 && y >= 0) {
      const id = `${y},${x-1}`;
      const risk = getRisk(y, x-1, input);
      const left: Position = {
        x: x-1,
        y,
        risk: accumRisk + risk,
        previous: `${y},${x}`
      }
      if (!tags.has(id)) {
        queue.push(id);
      }
      if (!tags.has(id) || left.risk <= tags.get(id)!.risk) {
        tags.set(id, left);
      }
    }
    if (x + 1 < input[0].length * xTimes && y >= 0) {
      const id = `${y},${x+1}`;
      const risk = getRisk(y, x+1, input);
      const right: Position = {
        x: x+1,
        y,
        risk: accumRisk + risk,
        previous: `${y},${x}`
      }
      if (!tags.has(id)) {
        queue.push(id);
      }
      if (!tags.has(id) || right.risk <= tags.get(id)!.risk) {
        tags.set(id, right);
      }
    }
    queue = queue.sort((a, b) => tags.get(b)!.risk - tags.get(a)!.risk)
    const next = queue.pop();
    if (next) {
      x = tags.get(next!)!.x;
      y = tags.get(next!)!.y;
    } else {
      pathFound = true;
    }
  }

  // printPath(input, tags);
  
  return tags.get(`${input.length * xTimes - 1},${input[0].length * xTimes - 1}`)!.risk
}

const partOne = (input: string[]) => {
  return getPathRisk(input);
}

const partTwo = (input: string[]) => {
  return getPathRisk(input, 5);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));