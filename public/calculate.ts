// fetch("short.json")
//   .then((res) => res.json())
//   .then((json) => console.log(json));

import fs from "fs";

let data = fs.readFileSync("./short.json");

