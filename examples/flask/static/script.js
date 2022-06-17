// SYSTEM PARAMS
const LIFE_CYCLES = 3000; // battery life
const SAMPLE_PER_DAY = 1000; // sampling rate
const MIN_V = 12; //14.8 V
const MAX_V = 17; //15.6 V
const COEFF = 500; // gain

var getParams = function (data) {
    // system params
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
    console.log(filteredData);
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
    var slope = ((lv - hv) / ((1 - thv + tlv) * (24 * 60 * 60))) * COEFF;
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
    var arbitraryCompensation = 27;
    return tf
        .loadLayersModel("http://127.0.0.1:5000/static/model.json")
        .then(function (model) {
            var pred = model.predict(tf.tensor([input]));
            var output = Math.round(pred.dataSync()[0]) + arbitraryCompensation;
            if (output < arbitraryCompensation) {
                output = 0;
            }
            var result = output.toString();

            return result;
        });
};

var run = async function (data) {
    var params = getParams(data);
    var input = params.input;
    var modelIn = +input; // values should be between -43 to -80
    while (modelIn > -43 || modelIn < -63) {
        console.log("from", modelIn);
        if (modelIn > -43) {
            modelIn -= 10;
            console.log(modelIn);
        } else if (modelIn < -63) {
            modelIn += 10;
            console.log(modelIn);
        }
    }
    var cycles = +(await modelPred(modelIn));
    var result = 100 - (cycles / LIFE_CYCLES) * 100;
    if (result > 0) {
        return result;
    } else {
        return 0;
    }
};

// 코드 시작
const resultElem = document.getElementById("prediction");
run(data).then((result) => {
    resultElem.innerHTML = result + "%";
});
// 코드 끝
