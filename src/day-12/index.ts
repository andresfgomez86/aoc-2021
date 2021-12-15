import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

interface Cave {
  id: string,
  connected: Map<string, Cave | undefined>
}

const checkIfUpperCase = (text: string) => {
  return text === text.toUpperCase();
}

const populateGraph = (input: string[]): Map<string, Cave> => {
  const caves = new Map<string, Cave>();
  for (const row of input) {
    const [from, to] = row.split("-");
    if (!caves.has(from)) {
      const newCave: Cave = {
        id: from,
        connected: new Map<string, Cave>()
      }
      caves.set(from, newCave);
    }
    if (!caves.has(to)) {
      const newCave: Cave = {
        id: to,
        connected: new Map<string, Cave>()
      }
      caves.set(to, newCave);
    }
    caves.get(from)?.connected.set(to, caves.get(to));
    caves.get(to)?.connected.set(from, caves.get(from));
  }
  return caves;
}

const navigateGraph = (start: Cave | undefined, visited: Set<string>, currentPath: string[], paths: string[], ableToRepeat = false) => {
  for (const current of start?.connected.values() || []) {
    if (current?.id === 'start') {
      continue;
    }
    const name = current?.id || "";
    const path = [...currentPath];
    const visitedCopy = new Set(visited);
    let newAbleToRepeat = ableToRepeat;
    if (visitedCopy.has(name) && ableToRepeat) {
      newAbleToRepeat = false;
      visitedCopy.delete(name);
    }
    if (!visitedCopy.has(name)) {
      path.push(name);
      if(!checkIfUpperCase(name)) {
        visitedCopy.add(name);
      }
      if(name === 'end') {
        paths.push(path.join(","));
      } else {
        navigateGraph(current, visitedCopy, path, paths, newAbleToRepeat);
      }
    }
  }
}

const partOne = (input: string[]) => {
  const caves = populateGraph(input);
  const start = caves.get('start');
  const visited = new Set<string>();
  visited.add('start');
  const paths: string[] = [];
  navigateGraph(start, visited, ['start'], paths);
  return paths.length;
} 

const partTwo = (input: any) => {
  const ableToRepeat = true;
  const caves = populateGraph(input);
  const start = caves.get('start');
  const visited = new Set<string>();
  visited.add('start');
  const paths: string[] = [];
  navigateGraph(start, visited, ['start'], paths, ableToRepeat);
  return paths.length;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));