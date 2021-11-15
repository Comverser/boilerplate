declare const XLSX: any;

const excel_file = <HTMLInputElement>document.getElementById("excel_file");

const fetchJson = (jsonData: object) => {
  fetch("http://localhost:3000/api/params", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((res) => res.json())
    .then((data) => {
      const { hv, lv, dthv, dtlv, slope } = data;
      let pSlope = document.getElementById("slope");
      let pHv = document.getElementById("hv");
      let pDthv = document.getElementById("dthv");
      let pLv = document.getElementById("lv");
      let pDtlv = document.getElementById("dtlv");
      pSlope!.textContent = JSON.stringify(slope);
      pHv!.textContent = JSON.stringify(hv);
      pDthv!.textContent = JSON.stringify(dthv);
      pLv!.textContent = JSON.stringify(lv);
      pDtlv!.textContent = JSON.stringify(dtlv);
    })
    .catch((err) => {
      console.error(err);
    });
};

const exportToJsonFile = (jsonData: object) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileDefaultName = "data.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

excel_file.addEventListener("change", (event: Event) => {
  if (
    ![
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ].includes((event.target as HTMLInputElement).files![0].type)
  ) {
    (<HTMLDivElement>document.getElementById("excel_data")).innerHTML =
      '<div class="alert alert-danger">Only .xlsx or .xls file format are allowed</div>';

    excel_file.value = "";

    return false;
  }

  var reader = new FileReader();
  reader.readAsArrayBuffer((event.target as HTMLInputElement).files![0]);
  reader.onload = function (event: Event) {
    var data = new Uint8Array(reader.result as Uint8Array);
    var work_book = XLSX.read(data, { type: "array" });
    var sheet_name = work_book.SheetNames;
    var sheet_data = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {
      header: 1,
    });

    fetchJson(sheet_data);

    if (sheet_data.length > 0) {
      var table_output = '<table class="table table-striped table-bordered">';

      for (var row = 0; row < sheet_data.length; row++) {
        table_output += "<tr>";

        for (var cell = 0; cell < sheet_data[row].length; cell++) {
          if (row == 0) {
            table_output += "<th>" + sheet_data[row][cell] + "</th>";
          } else {
            table_output += "<td>" + sheet_data[row][cell] + "</td>";
          }
        }
        table_output += "</tr>";
      }
      table_output += "</table>";

      (<HTMLDivElement>document.getElementById("excel_data")).innerHTML =
        table_output;
    }
    excel_file.value = "";
  };
});
