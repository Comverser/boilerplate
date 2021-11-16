import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const index = (req: Request, res: Response) => {
  res.render("index");
};

const getParams = (req: Request, res: Response) => {
  let data = req.body;

  // system params
  const coeff: number = 6.59;
  const minV: number = 3.7 * 4; //14.8 V
  const maxV: number = 3.9 * 4; //15.6 V
  const startTime: number = 0.729167; // 17:30
  const endTime: number = 0.291667; // 7:00
  const samplePerDay = 1000;

  // the latest day of measurement
  const dataCol3 = data.map((v: any, i: number) => v[2]).slice(1);
  const uniqueCol3 = Array.from(new Set(dataCol3)).sort().reverse();
  let latestDay: number = uniqueCol3[0] as number;
  while (
    data.filter((elem: any) => {
      return elem[2] === latestDay;
    }).length <
    samplePerDay * 0.6
  ) {
    latestDay -= 1;
  }

  // the latest data
  const filteredData = data.filter((elem: any) => {
    return (
      elem[1] >= minV &&
      elem[1] <= maxV &&
      ((elem[2] === latestDay - 1 && elem[3] > startTime) ||
        (elem[2] === latestDay && elem[3] <= endTime))
    );
  });

  // the latest data by unique voltage
  let tempDict: any = {};
  let latestUniq = [];
  for (let i = 0; i < filteredData.length; i++) {
    let item = filteredData[i];
    let rep = item[1].toString() + item[2].toString();

    if (!tempDict[rep]) {
      tempDict[rep] = true;
      latestUniq.push(item);
    }
  }

  // calcuate
  const arrV: any = latestUniq.map((v: any) => v[1]);
  const arrT: any = latestUniq.map((v: any) => v[3]);
  const hv: number = Math.max(...arrV);
  const lv: number = Math.min(...arrV);

  const thv: number = arrT[arrV.indexOf(hv)];
  const tlv: number = arrT[arrV.indexOf(lv)];

  const dthv = new Date(Math.round(thv * (24 * 60 * 60)) * 1000)
    .toISOString()
    .substr(11, 8);
  const dtlv = new Date(Math.round(tlv * (24 * 60 * 60)) * 1000)
    .toISOString()
    .substr(11, 8);

  const slope: number =
    ((lv - hv) / ((1 - thv + tlv) * (24 * 60 * 60))) * coeff;

  let params: any = {};

  params["hv"] = hv;
  params["lv"] = lv;
  params["dthv"] = dthv;
  params["dtlv"] = dtlv;
  params["slope"] = slope;
  params["input"] = slope * 1000000;

  fs.writeFileSync(
    path.join(__dirname, "..", "/params.json"),
    JSON.stringify(params)
  );

  res.json(params);
};

const getModel = (req: Request, res: Response) => {
  // const model = JSON.parse(
  //   fs.readFileSync(path.join(__dirname, "..", "/model/model.json")).toString()
  // );

  // const readJson = fs
  //   .readFileSync(path.join(__dirname, "..", "/model/model.json"))
  //   .toString();

  // const readBin = fs
  //   .readFileSync(path.join(__dirname, "..", "/model/weights.bin"))
  //   .toString();

  // const model = {
  //   json: readJson,
  //   bin: readBin,
  // };

  // res.json(model);
};

const getTest = (req: Request, res: Response) => {
  res.send("Hello");
};

const postTest = (req: Request, res: Response) => {
  console.log(JSON.stringify(req.body));
  res.send("Hello");
};

export default { index, getParams, getModel, getTest, postTest };
