import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

interface Packet {
  version: string;
  typeID: string;
  literalValue: string;
  subpackets: Packet[];
  value: number;
}

const hexToBin: {[key: string]: string} = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  "A": "1010",
  "B": "1011",
  "C": "1100",
  "D": "1101",
  "E": "1110",
  "F": "1111"
};

const operations: {[key: string]: (subpackets: Packet[], literalValue: string)=>number} = {
  "000": (subpackets: Packet[], literalValue: string) => subpackets.reduce((count, current: Packet) => count + current.value, 0),
  "001": (subpackets: Packet[], literalValue: string) => subpackets.reduce((count, current: Packet) => count * current.value, 1),
  "010": (subpackets: Packet[], literalValue: string) => subpackets.reduce((count, current: Packet) => Math.min(count, current.value), Infinity),
  "011": (subpackets: Packet[], literalValue: string) => subpackets.reduce((count, current: Packet) => Math.max(count, current.value), -Infinity),
  "100": (subpackets: Packet[], literalValue: string) => parseInt(literalValue, 2),
  "101": (subpackets: Packet[], literalValue: string) => subpackets[0].value > subpackets[1].value ? 1 : 0,
  "110": (subpackets: Packet[], literalValue: string) => subpackets[0].value < subpackets[1].value ? 1 : 0,
  "111": (subpackets: Packet[], literalValue: string) => subpackets[0].value === subpackets[1].value ? 1 : 0
}

const versions: number[] = [];

const decode = (hex: string) => {
  let decoded = "";
  for (let i = 0; i < hex.length; i++) {
    decoded += hexToBin[hex[i]];
  }
  return decoded;
}

const shiftN = (binary: string[], times: number) => {
  let value = "";
  for (let i = 0; i < times; i++) {
    value += binary.shift();
  }
  return value;
}

const getPackage = (binary: string[]): Packet => {
  const version = shiftN(binary, 3);
  versions.push(parseInt(version, 2));
  const typeID = shiftN(binary, 3);
  let subpackets: Packet[] = [];
  let literalValue: string = "";

  if (typeID === "100") {
    let isLastGroup = false;
    let value = "";
    let length = 6;
    while (!isLastGroup) {
      const group = shiftN(binary, 5);
      isLastGroup = group[0] === "0";
      value += group.slice(1, group.length);
      length += 5;
    }
    literalValue = value;
  } else {
    const lengthTypeID = shiftN(binary, 1);
    if (lengthTypeID === "0") {
      const subpacketsLength = parseInt(shiftN(binary, 15), 2);
      const binaryInitialLength = binary.length;
      while (binaryInitialLength - binary.length < subpacketsLength) {
        const currentSubPackage = getPackage(binary);
        subpackets.push(currentSubPackage);
      }
    } else {
      const subpacketsQty = parseInt(shiftN(binary, 11), 2);
      for (let i = 0; i < subpacketsQty; i++) {
        const currentSubPackage = getPackage(binary);
        subpackets.push(currentSubPackage);
      }
    }

  }
  const value: number = operations[typeID](subpackets, literalValue);
  return {
    version,
    typeID,
    literalValue,
    subpackets,
    value
  };
}

const partOne = (input: string[]) => {
  const transmission = input[0];
  let decoded = decode(transmission).split("");
  const root = getPackage(decoded)
  return versions.reduce((count, current) => count + current);
} 

const partTwo = (input: string[]) => {
  const transmission = input[0];
  let decoded = decode(transmission).split("");
  const root = getPackage(decoded)
  return root.value;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));