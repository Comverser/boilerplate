const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
// require("@tensorflow/tfjs-node-gpu");

let lifeArr = [];
const slopeArr = [
  -0.0000436014824504033, -0.0000441306266548984, -0.0000448229493500672,
  -0.0000455684666210981, -0.0000463070155128501, -0.0000470477534697718,
  -0.0000476190476190476, -0.0000483792936623125, -0.0000492610837438423,
  -0.0000500751126690034, -0.0000510725229826353, -0.0000521104742053152,
  -0.0000531632110579478, -0.0000542888165038001, -0.0000554323725055432,
  -0.0000566251415628538,
].map((x) => x * 1000000);

for (let i = 0; i < 16; i++) {
  const element: number = i * 100;
  lifeArr.push(element);
}

const tfSlope = tf.tensor(slopeArr);
const tfLife = tf.tensor(lifeArr);

// let X = tf.input({ shape: [1] });
// let Y = tf.layers.dense({ units: 1 }).apply(X);
// let model = tf.model({ inputs: X, outputs: Y });

const input = tf.input({ shape: [1] });
const dense1 = tf.layers.dense({ units: 32, activation: "relu" }).apply(input);
const dense2 = tf.layers.dense({ units: 32, activation: "relu" }).apply(dense1);
const dense3 = tf.layers.dense({ units: 32, activation: "relu" }).apply(dense2);
const dense4 = tf.layers.dense({ units: 32, activation: "relu" }).apply(dense3);
const dense5 = tf.layers
  .dense({ units: 1, activation: "linear" })
  .apply(dense4);
const model = tf.model({ inputs: input, outputs: dense5 });

let compileParam = {
  optimizer: tf.train.adam(),
  loss: tf.losses.meanSquaredError,
};
model.compile(compileParam);

let fitParam = {
  epochs: 100000,
  callbacks: {
    onEpochEnd: (epoch: any, logs: any) => console.log("epoch", epoch, logs),
  },
};

// model.fit(tfSlope, tfLife, fitParam).then((result: any) => {
//   let predictResult = model.predict(tfSlope);
//   predictResult.print();
//   console.log(predictResult.arraySync()[0][0]);

//   let weights = model.getWeights();
//   let weight = weights[0].arraySync()[0][0];
//   let bias = weights[1].arraySync()[0];
//   console.log(weight, bias, weight * slopeArr[0] + bias);

//   model.save("file://./model");
// });

const loadModel = async () => {
  const handler = tfn.io.fileSystem("./src/model/model.json");
  const model = await tf.loadLayersModel(handler);
  console.log("Model loaded");
  const output = model.predict(tfSlope);
  output.print();
};
loadModel();
