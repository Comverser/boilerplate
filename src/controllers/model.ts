let tf = require("@tensorflow/tfjs-node-gpu");

let lifeArr = [];
const slopeArr = [
  -0.0000436014824504033, -0.0000441306266548984, -0.0000448229493500672,
  -0.0000455684666210981, -0.0000463070155128501, -0.0000470477534697718,
  -0.0000476190476190476, -0.0000483792936623125, -0.0000492610837438423,
  -0.0000500751126690034, -0.0000510725229826353, -0.0000521104742053152,
  -0.0000531632110579478, -0.0000542888165038001, -0.0000554323725055432,
  -0.0000566251415628538,
];

for (let i = 0; i < 16; i++) {
  const element: number = i * 100;
  lifeArr.push(element);
}

const tfSlope = tf.tensor(slopeArr);
const tfLife = tf.tensor(lifeArr);

let X = tf.input({ shape: [1] });
let Y = tf.layers.dense({ units: 1 }).apply(X);
let model = tf.model({ inputs: X, outputs: Y });
let compileParam = {
  optimizer: tf.train.adam(),
  loss: tf.losses.meanSquaredError,
};
model.compile(compileParam);

let fitParam = { epochs: 10000 };

model.fit(tfSlope, tfLife, fitParam).then((result: any) => {
  let predictResult = model.predict(tfSlope);
  predictResult.print();
});
