let span = document.getElementsByClassName("close")[0];
let span1 = document.getElementsByClassName("close")[1];
let cards = document.querySelectorAll(".card");
let card2 = document.querySelectorAll(".card2");
let modal = document.querySelector("#myModal");
let modal2 = document.querySelector("#myModal2");
let gBpjs = document.querySelector("#gb");
let gUmum = document.querySelector("#gu");
let bBpjs = document.querySelector("#bpjs");
let bUmum = document.querySelector("#umum");
let pel = document.querySelector("#pel");
let kat = document.querySelector("#kat");
let kode = document.querySelector("#kode");
let dok = document.querySelector("#dok");
let mbpjs = document.querySelector(" #myModal").querySelector("#mBpjs");
let mumum = document.querySelector(" #myModal2").querySelector("#mUmum");

const socket = io("http://192.168.100.19:3000/");

socket.on("connect", () => {
  console.log("Connect");
});

socket.on("sing", (res) => {
  console.log(res);
  let terbilang = [
    "Kosong",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
  ];

  let counter = parseInt(res.counter.toString().substring(1, 2));
  let kategori =
    res.data.kategori == "U" ? "UMUM" : res.data.kategori == "J" ? "BPJS" : "";
  let kode = res.data.kode;
  let d1 = parseInt(res.data.seq.substring(0, 1));
  let d2 = parseInt(res.data.seq.substring(1, 2));
  let d3 = parseInt(res.data.seq.substring(2, 3));

  let text =
    "Antrian! ;" +
    kategori +
    "! , Nomor! , " +
    kode +
    "! ," +
    terbilang[d1] +
    ";" +
    terbilang[d2] +
    ";" +
    terbilang[d3] +
    ". KE KONTER! ," +
    terbilang[counter] +
    "!";
  console.log(text);
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  console.log("data", voices);
  msg.voice = voices[10];
  msg.rate = 8 / 10;
  msg.pitch = 0;
  msg.text = text;
  msg.volume = 10;
  msg.onend = function (e) {
    console.log("Finished in " + e.elapsedTime + " seconds.");
  };
  speechSynthesis.speak(msg);
});

let eventFire = (el, etype) => {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
};

document.addEventListener(
  "click",
  function (event) {
    if (event.target.matches(".card") || event.target.matches(".btitle")) {
      kode.value = event.target.dataset.kode;
      var url =
        "http://192.168.100.19:3000/api/dokter/getByPoli/" +
        event.target.dataset.kode;
      const response = fetch(url, {
        headers: {
          key: "hsdusay98wquey98327er8oiuwqhd89",
        },
      })
        .then((res) => res.json())
        .then((col) => {
          console.log(col.data);
          mbpjs.innerHTML = "";
          var data = col.data;
          var html = "";
          var size = col.data.length;
          var count = col.data.length - 1;
          var value = size / 4;
          var rowCount = Math.ceil(value);

          for (var i = 0; i < rowCount; i++) {
            html += "<section>";
            html += '<div class="row" style="padding: 10px;">';
            for (var u = 0; u < 4; u++) {
              html +=
                '<div class="column"><div class="card3" style="height: 117px;" data-pel="' +
                data[count]["pelayanan"] +
                '" data-nama="' +
                data[count]["nama"] +
                '"><h3 class="btitle3" data-pel="' +
                data[count]["pelayanan"] +
                '" data-nama="' +
                data[count]["nama"] +
                '">' +
                data[count]["nama"] +
                "</h3></div></div>";
              count--;
              if (count < 0) {
                break;
              }
            }
            html += "</div>";
            html += "</section>";
          }
          mbpjs.innerHTML = html;

          console.log(html);

          modal.style.display = "block";
        });
    }

    if (event.target.matches(".card2") || event.target.matches(".btitle2")) {
      kode.value = event.target.dataset.kode;
      var url =
        "http://192.168.100.19:3000/api/dokter/getByPoli/" +
        event.target.dataset.kode;
      const response = fetch(url, {
        headers: {
          key: "hsdusay98wquey98327er8oiuwqhd89",
        },
      })
        .then((res) => res.json())
        .then((col) => {
          console.log(col.data);
          mumum.innerHTML = "";
          var data = col.data;
          var html = "";
          var size = col.data.length;
          var count = col.data.length - 1;
          var value = size / 4;
          var rowCount = Math.ceil(value);

          for (var i = 0; i < rowCount; i++) {
            html += "<section>";
            html += '<div class="row" style="padding: 10px;">';
            for (var u = 0; u < 4; u++) {
              html +=
                '<div class="column"><div class="card4" style="height: 117px;" data-pel="' +
                data[count]["pelayanan"] +
                '" data-nama="' +
                data[count]["nama"] +
                '"><h3 class="btitle4" data-pel="' +
                data[count]["pelayanan"] +
                '" data-nama="' +
                data[count]["nama"] +
                '">' +
                data[count]["nama"] +
                "</h3></div></div>";
              count--;
              if (count < 0) {
                break;
              }
            }
            html += "</div>";
            html += "</section>";
          }
          mumum.innerHTML = html;
          console.log(html);

          modal2.style.display = "block";
        });
    }

    if (
      event.target.matches(".card3") ||
      event.target.matches(".card4") ||
      event.target.matches(".btitle3") ||
      event.target.matches(".btitle4")
    ) {
      pel.value = event.target.dataset.pel;
      dok.value = event.target.dataset.nama;

      var url = "http://192.168.100.19:3000/api/counter/create";
      var data = {
        pelayanan: pel.value,
        kategori: kat.value,
        kode: kode.value,
        dokter: dok.value,
      };

      fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          key: "hsdusay98wquey98327er8oiuwqhd89",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
          modal.style.display = "none";
          modal2.style.display = "none";
          console.log(response.data.no);
          if (
            event.target.matches(".card3") ||
            event.target.matches(".btitle3")
          ) {
            eventFire(document.getElementById("kb"), "click");
          } else if (
            event.target.matches(".card4") ||
            event.target.matches(".btitle4")
          ) {
            eventFire(document.getElementById("ku"), "click");
          }
          socket.emit("add", "New Data Added");
          var url = "http://192.168.100.19:3000/print/" + response.data.no;
          var myWindow = window.open(url, "", "width=200,height=100");
          myWindow.focus();
        })
        .catch((error) => console.error("Error:", error));
    }
  },
  false
);

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
      gBpjs.innerHTML = "";
      gUmum.innerHTML = "";
      var data = col.data;
      var html = "";
      var html2 = "";
      var size = col.data.length;
      var count = col.data.length - 1;
      var value = size / 4;
      var rowCount = Math.ceil(value);

      for (var i = 0; i < rowCount; i++) {
        html += "<section>";
        html += '<div class="row">';
        html2 += "<section>";
        html2 += '<div class="row">';
        for (var u = 0; u < 4; u++) {
          html +=
            '<div class="column"><div data-id="test" style="height: 130px;" class="card" data-kode="' +
            data[count]["kode"] +
            '"><h5 class="btitle" data-kode="' +
            data[count]["kode"] +
            '">' +
            data[count]["poli"] +
            "</h5></div></div>";
          html2 +=
            '<div class="column"><div data-id="test" style="height: 130px;" class="card2" data-kode="' +
            data[count]["kode"] +
            '"><h5 class="btitle2" data-kode="' +
            data[count]["kode"] +
            '">' +
            data[count]["poli"] +
            "</h5></div></div>";
          count--;
          if (count < 0) {
            break;
          }
        }
        html += "</div>";
        html += "</section>";
        html2 += "</div>";
        html2 += "</section>";
      }

      // console.log(html)
      // console.log(html2)
      gBpjs.innerHTML = html;
      gUmum.innerHTML = html2;
    });
};

init();

socket.on("getpoli", (msg) => {
  init();
});

span.addEventListener("click", () => {
  modal.style.display = "none";
});

span1.addEventListener("click", () => {
  modal2.style.display = "none";
});

bBpjs.addEventListener("click", () => {
  kat.value = "J";
});

bUmum.addEventListener("click", () => {
  kat.value = "U";
});
