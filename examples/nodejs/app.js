var getParams = function (data) {
    const SAMPLE_PER_DAY = 1000;
    const MIN_V = 3.7 * 4; //14.8 V
    const MAX_V = 3.9 * 4; //15.6 V

    // system params
    var coeff = 6.59;
    var startTime = 0.729167; // 17:30
    var endTime = 0.291667; // 7:00
    // the latest day of measurement
    var dataCol3 = data
        .map(function (v, i) {
            return v[2];
        })
        .slice(1);
    var uniqueCol3 = Array.from(new Set(dataCol3)).sort().reverse();
    var latestDay = uniqueCol3[0];
    while (
        data.filter(function (elem) {
            return elem[2] === latestDay;
        }).length <
        SAMPLE_PER_DAY * 0.6
    ) {
        latestDay -= 1;
    }
    // the latest data
    var filteredData = data.filter(function (elem) {
        return (
            elem[1] >= MIN_V &&
            elem[1] <= MAX_V &&
            ((elem[2] === latestDay - 1 && elem[3] > startTime) ||
                (elem[2] === latestDay && elem[3] <= endTime))
        );
    });
    // the latest data by unique voltage
    var tempDict = {};
    var latestUniq = [];
    for (var i = 0; i < filteredData.length; i++) {
        var item = filteredData[i];
        var rep = item[1].toString() + item[2].toString();
        if (!tempDict[rep]) {
            tempDict[rep] = true;
            latestUniq.push(item);
        }
    }
    // calcuate
    var arrV = latestUniq.map(function (v) {
        return v[1];
    });
    var arrT = latestUniq.map(function (v) {
        return v[3];
    });
    var hv = Math.max.apply(Math, arrV);
    var lv = Math.min.apply(Math, arrV);
    var thv = arrT[arrV.indexOf(hv)];
    var tlv = arrT[arrV.indexOf(lv)];

    var dthv = new Date(Math.round(thv * (24 * 60 * 60)) * 1000)
        .toISOString()
        .substr(11, 8);
    var dtlv = new Date(Math.round(tlv * (24 * 60 * 60)) * 1000)
        .toISOString()
        .substr(11, 8);
    var slope = ((lv - hv) / ((1 - thv + tlv) * (24 * 60 * 60))) * coeff;
    var params = {};
    params["hv"] = hv;
    params["lv"] = lv;
    params["dthv"] = dthv;
    params["dtlv"] = dtlv;
    params["slope"] = slope;
    params["input"] = slope * 1000000;

    return params;
};

var modelPred = function (input) {
    var tfn = require("@tensorflow/tfjs-node");

    var arbitraryCompensation = 27;
    return tfn
        .loadLayersModel("file://./model/model.json")
        .then(function (model) {
            var pred = model.predict(tfn.tensor([input]));
            var output = Math.round(pred.dataSync()[0]) + arbitraryCompensation;
            if (output < arbitraryCompensation) {
                output = 0;
            }
            var result = output.toString();

            return result;
        });
};

var run = async function (dataIn) {
    var params = getParams(dataIn);
    var input = params.input;
    var modelIn = +JSON.stringify(input);
    return await modelPred(modelIn);
};

// 코드 시작
var example = require("./example-data");
var dataIn = example.data;

run(dataIn).then((data) => {
    console.log(data);
});
// 코드 끝
