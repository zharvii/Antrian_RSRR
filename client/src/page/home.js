import React, { useState, useEffect, cloneElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import { forwardRef } from "react";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import RefreshIcon from "@material-ui/icons/Refresh";
import Typography from "@material-ui/core/Typography";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.100.19:3000/";
const socket = socketIOClient(ENDPOINT);

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const url = "http://192.168.100.19:3000/api/counter";

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openInfo, setOpenInfo] = React.useState(false);

  const handleClickOpenInfo = () => {
    setOpenInfo(true);
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  const [data, setData] = useState([]);

  const [poli, setPoli] = useState([]);

  let [con, setCon] = useState("KOSONG");
  let [pol, setPol] = useState("KOSONG");
  let [kat, setKat] = useState("KOSONG");

  let [panggil, setPanggil] = useState({});

  const call = (data) => {
    setPanggil(data);
    socket.emit("call", { counter: con, data: data });
    socket.emit("setdisplay", {
      counter: con,
      data: data,
    });
    fetch("http://192.168.100.19:3000/api/counter/call/" + data.no, {
      headers: {
        key: "hsdusay98wquey98327er8oiuwqhd89",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Terpangil");
      });
  };

  const ulangi = () => {
    socket.emit("call", { counter: con, data: panggil });
  };

  // const selesai = () => {
  //   // alert(panggil.no);
  //   fetch("http://localhost:3000/api/counter/call/" + panggil.no, {
  //     headers: {
  //       key: "hsdusay98wquey98327er8oiuwqhd89",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       fetchData();
  //     });
  // };

  const fetchData = () => {
    //Fetch Data Dokter
    setLoading(true);
    fetch(url + "/getByPoli/" + kat + "/" + pol, {
      headers: {
        key: "hsdusay98wquey98327er8oiuwqhd89",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });

    //Fetch Data Poli
    fetch("http://192.168.100.19:3000/api/poli/active", {
      headers: {
        key: "hsdusay98wquey98327er8oiuwqhd89",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setPoli(res.data);
      });
  };

  useEffect(() => {
    localStorage.setItem("kategori", "KOSONG");
    localStorage.setItem("poli", "KOSONG");
    fetchData();
    socket.on("connect", () => {
      console.log("Connect");
    });

    // socket.on("sing", (res) => {
    //   console.log(res);
    //   let terbilang = [
    //     "Kosong",
    //     "Satu",
    //     "Dua",
    //     "Tiga",
    //     "Empat",
    //     "Lima",
    //     "Enam",
    //     "Tujuh",
    //     "Delapan",
    //     "Sembilan",
    //   ];

    //   let counter = parseInt(res.counter.toString().substring(1, 2));
    //   let kategori =
    //     res.data.kategori == "U"
    //       ? "UMUM"
    //       : res.data.kategori == "J"
    //       ? "BPJS"
    //       : "";
    //   let kode = res.data.kode;
    //   let d1 = parseInt(res.data.seq.substring(0, 1));
    //   let d2 = parseInt(res.data.seq.substring(1, 2));
    //   let d3 = parseInt(res.data.seq.substring(2, 3));

    //   let text =
    //     "Antrian! ;" +
    //     kategori +
    //     "! , Nomor , " +
    //     kode +
    //     " ," +
    //     terbilang[d1] +
    //     ";" +
    //     terbilang[d2] +
    //     ";" +
    //     terbilang[d3] +
    //     " , Ke! Konter ," +
    //     terbilang[counter];
    //   console.log(text);
    //   var msg = new SpeechSynthesisUtterance();
    //   var voices = window.speechSynthesis.getVoices();
    //   console.log("data", voices);
    //   msg.voice = voices[10];
    //   msg.rate = 9 / 10;
    //   msg.pitch = 0;
    //   msg.text = text;
    //   msg.volume = 10;
    //   msg.onend = function (e) {
    //     console.log("Finished in " + e.elapsedTime + " seconds.");
    //   };
    //   speechSynthesis.speak(msg);
    // });

    socket.on("new", (pesan) => {
      console.log(pesan);
      if (!open) {
        if (
          localStorage.getItem("kategori") != null &&
          localStorage.getItem("poli") != null
        ) {
          setLoading(true);
          fetch(
            url +
            "/getByPoli/" +
            localStorage.getItem("kategori") +
            "/" +
            localStorage.getItem("poli"),
            {
              headers: {
                key: "hsdusay98wquey98327er8oiuwqhd89",
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              setData(res.data);
              setLoading(false);
            });
        } else if (
          localStorage.getItem("kategori") != null &&
          localStorage.getItem("poli") == null
        ) {
          fetch(
            url +
            "/getByPoli/" +
            localStorage.getItem("kategori") +
            "/" +
            "KOSONG",
            {
              headers: {
                key: "hsdusay98wquey98327er8oiuwqhd89",
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              setData(res.data);
              setLoading(false);
            });
        } else if (
          localStorage.getItem("kategori") == null &&
          localStorage.getItem("poli") != null
        ) {
          fetch(
            url + "/getByPoli/" + "KOSONG" + "/" + localStorage.getItem("poli"),
            {
              headers: {
                key: "hsdusay98wquey98327er8oiuwqhd89",
              },
            }
          )
            .then((res) => res.json())
            .then((res) => {
              setData(res.data);
              setLoading(false);
            });
        } else {
          fetch(url + "/getByPoli/" + "KOSONG" + "/" + "KOSONG", {
            headers: {
              key: "hsdusay98wquey98327er8oiuwqhd89",
            },
          })
            .then((res) => res.json())
            .then((res) => {
              setData(res.data);
              setLoading(false);
            });
        }
      }
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderStyle: "outset",
        borderRadius: "7px",
      }}
    >
      <Grid
        container
        spacing={1}
        style={{ marginBottom: 10, paddingRight: "15px", paddingLeft: "15px" }}
      >
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="lCounter">Counter</InputLabel>
            <Select
              labelId="lCounter"
              id="counter"
              onChange={(e) => {
                setCon(e.target.value);
              }}
            >
              <MenuItem value="C1">Counter 1</MenuItem>
              <MenuItem value="C2">Counter 2</MenuItem>
              <MenuItem value="C3">Counter 3</MenuItem>
            </Select>
            <FormHelperText>Pilih Counter</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="lKat">Kategori</InputLabel>
            <Select
              labelId="lKat"
              id="kat"
              onChange={async (e) => {
                await setKat(e.target.value);
                localStorage.setItem("kategori", e.target.value);
              }}
            >
              <MenuItem value="KOSONG">Semua</MenuItem>
              <MenuItem value="J">Bpjs</MenuItem>
              <MenuItem value="U">Umum</MenuItem>
            </Select>
            <FormHelperText>Pilih Kategori</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="lPoli">Poli</InputLabel>
            <Select
              labelId="lPoli"
              id="poli"
              onChange={async (e) => {
                await setPol(e.target.value);
                localStorage.setItem("poli", e.target.value);
              }}
            >
              <MenuItem value="KOSONG">Semua</MenuItem>

              {poli.map((obj, index) => (
                <MenuItem value={obj.kode}>{obj.poli}</MenuItem>
              ))}
            </Select>
            <FormHelperText>Pilih Poli</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid
          item
          xs={2}
          style={{
            margin: "auto",
            textAlign: "right",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
            style={{ height: "45px", marginTop: "4px" }}
          >
            <RefreshIcon style={{ marginRight: "7px" }} />
            Refresh
          </Button>
        </Grid>
      </Grid>
      <MaterialTable
        title="Daftar Antrian"
        icons={tableIcons}
        isLoading={loading}
        columns={[
          {
            title: "No. Antrian",
            field: "no",
            cellStyle: { paddingLeft: "30px" },
            headerStyle: { paddingLeft: "30px" },
            render: (rowData) => (
              <Typography>{rowData.no.toString().substring(1, 5)}</Typography>
            ),
          },

          { title: "Pelayanan", field: "pelayanan" },
          {
            title: "Kategori",
            field: "kategori",
            lookup: { J: "BPJS", U: "UMUM" },
          },
          { title: "Dokter", field: "dokter" },
          {
            title: "Action",
            field: "dipanggil",
            cellStyle: { textAlign: "right", paddingRight: "90px" },
            headerStyle: {
              textAlign: "right",
              paddingRight: "70px",
            },
            render: (rowData) => (
              <IconButton
                onClick={async (e) => {
                  if (con == "KOSONG") {
                    handleClickOpenInfo();
                  } else {
                    await call(rowData);
                    handleClickOpen();
                  }
                }}
              >
                <RecordVoiceOverIcon />
              </IconButton>
            ),
          },
        ]}
        data={data}
        actions={
          [
            // {
            //   icon: RecordVoiceOverIcon,
            //   tooltip: "Panggil",
            //   onClick: (event, rowData) => handleClickOpen(),
            // },
            // {
            //   icon: RefreshIcon,
            //   tooltip: "Refresh Data",
            //   isFreeAction: true,
            //   onClick: () => fetchData(),
            // },
          ]
        }
        options={{
          actionsColumnIndex: -1,
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
            </div>
          ),
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        disableBackdropClick={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Panggil Nomor Antrian"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Nomor antrian ini sudah terpanggil
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              ulangi();
            }}
          >
            Ulangi
          </Button>
          <Button
            onClick={() => {
              // selesai();
              handleClose();
              fetchData();
            }}
            color="secondary"
          >
            Selesai
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInfo}
        onClose={handleCloseInfo}
        disableBackdropClick={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Antrian"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Untuk Memangil Mohon Pilih Counter
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo} color="primary">
            Oke
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
