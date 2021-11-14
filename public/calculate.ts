// fetch("short.json")
//   .then((res) => res.json())
//   .then((json) => console.log(json));

import fs from "fs";
import path from "path";


let raw: Buffer = fs.readFileSync(path.resolve(__dirname, "./long.json"));

let data = JSON.parse(raw.toString() as string);

const dataCol3 = data.map((v: any, i: number) => v[2]).slice(1);
// console.log(dataCol3);

const uniqueCol3 = Array.from(new Set(dataCol3));
console.log(uniqueCol3);


