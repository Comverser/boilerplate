// fetch("short.json")
//   .then((res) => res.json())
//   .then((json) => console.log(json));

import fs from "fs";
import path from "path";

let raw: Buffer = fs.readFileSync(path.resolve(__dirname, "./short.json"));
let data: JSON = JSON.parse(raw.toString() as string);

for (const key in data) {
  if (Object.prototype.hasOwnProperty.call(data, key)) {
    const element = data[key];
    console.log(element);
  }
}
