const tgl = document.querySelector("#tgl");
const jam = document.querySelector("#jam");
const gu = document.querySelector("#gu");
const gb = document.querySelector("#gb");
const au = document.querySelector("#aumum");
const ab = document.querySelector("#abpjs");
const socket = io("http://192.168.100.19:3000/");

socket.on("connect", () => {
  console.log("Connect");
});

let cuter = (str) => {
  if (str == "-") {
    return str;
  } else {
    return str.substring(1, 5);
  }
};

let init = () => {
  const url = "http://192.168.100.19:3000/api/poli/active";
  const response = fetch(url, {
    headers: {
      key: "hsdusay98wquey98327er8oiuwqhd89",
    },
  })
    .then((res) => res.json())
    .then((col) => {
      // console.log(col.data)
      gu.innerHTML = "";
      gb.innerHTML = "";
      var data = col.data;
      var html = "";
      var html2 = "";
      var size = col.data.length;
      var count = col.data.length - 1;
      var value = size / 3;
      var rowCount = Math.ceil(value);

      for (var i = 0; i < rowCount; i++) {
        html += '<div class="row">';
        html2 += '<div class="row">';
        for (var u = 0; u < 3; u++) {
          html +=
            '<div class="col-md-4"><div class="card border-primary mb-3"><div class="card-header bg-transparent border-primary" style="text-align: center;"><b>' +
            data[count]["poli"] +
            '</b></div><div class="card-body text-primary"><h5 class="card-title" style="text-align: center; font-size: 3em;" id="U' +
            data[count]["kode"] +
            '">' +
            cuter(data[count]["umum"]) +
            '</h5></div><div class="card-footer bg-transparent border-primary" style="text-align: center;"><marquee scrollamount="1"  style="width: 100%;" behavior="" direction=""><b id="DU' +
            data[count]["kode"] +
            '">' +
            data[count]["dumum"] +
            "</b></marquee></div></div></div>";
          html2 +=
            '<div class="col-md-4"><div class="card border-success mb-3"><div class="card-header bg-transparent border-success" style="text-align: center;"><b>' +
            data[count]["poli"] +
            '</b></div><div class="card-body text-success"><h5 class="card-title" style="text-align: center; font-size: 3em;" id="J' +
            data[count]["kode"] +
            '">' +
            cuter(data[count]["bpjs"]) +
            '</h5></div><div class="card-footer bg-transparent border-success" style="text-align: center;"><marquee scrollamount="1" style="width: 100%;" behavior="" direction="" ><b id="DJ' +
            data[count]["kode"] +
            '">' +
            data[count]["dbpjs"] +
            "</b>  </marquee></div></div></div>";
          count--;
          if (count < 0) {
            break;
          }
        }
        html += "</div>";
        html2 += "</div>";
      }

      // console.log(html)
      // console.log(html2)
      gu.innerHTML = html;
      gb.innerHTML = html2;
    });
};

let formatDate = (date) => {
  if (date !== undefined && date !== "") {
    var myDate = new Date(date);
    var month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][myDate.getMonth()];
    var str = myDate.getDate() + " " + month + " " + myDate.getFullYear();
    return str;
  }
  return "";
};

function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  jam.innerHTML = h + ":" + m + ":" + s + " WIB";
  tgl.innerHTML = formatDate(new Date());
  var t = setTimeout(startTime, 500);
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  } // add zero in front of numbers < 10
  return i;
}

startTime();
init();

socket.on("getdisplay", (res) => {
  console.log("trigred");
  if (res.data.kategori == "J") {
    ab.innerHTML = "";
    ab.innerHTML = res.data.no.substring(1, 5);
  } else if (res.data.kategori == "U") {
    au.innerHTML = "";
    au.innerHTML = res.data.no.substring(1, 5);
  } else {
    ab.innerHTML = "";
    au.innerHTML = "";
    ab.innerHTML = "-";
    au.innerHTML = "-";
  }
  console.log(document.querySelector("#" + res.data.kategori + res.data.kode));
  document.querySelector("#" + res.data.kategori + res.data.kode).innerHTML =
    "";
  document.querySelector("#D" + res.data.kategori + res.data.kode).innerHTML =
    "";
  document.querySelector("#" + res.data.kategori + res.data.kode).innerHTML =
    res.data.no.substring(1, 5);
  document.querySelector("#D" + res.data.kategori + res.data.kode).innerHTML =
    res.data.dokter;
});
