// fetch("short.json")
//   .then((res) => res.json())
//   .then((json) => console.log(json));

import fs from "fs";
import path from "path";

let raw: Buffer = fs.readFileSync(path.resolve(__dirname, "./long.json"));
let data = JSON.parse(raw.toString() as string);

// the latest day of measurement
const dataCol3 = data.map((v: any, i: number) => v[2]).slice(1);
const uniqueCol3 = Array.from(new Set(dataCol3)).sort().reverse();
let latestDay: number = uniqueCol3[0] as number;
while (
  data.filter((elem: any) => {
    return elem[2] === latestDay;
  }).length < 100
) {
  latestDay -= 1;
}

// the latest data
const latestData = data.filter((elem: any) => {
  return elem[2] === latestDay;
});

// voltage and time to analyze
const voltage = latestData.map((v: any) => v[1]);
const time = latestData.map((v: any) => v[3]);

console.log(voltage);
console.log(time);
console.log(data[2]);
