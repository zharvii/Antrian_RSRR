import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import { forwardRef } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DomainDisabledIcon from "@material-ui/icons/DomainDisabled";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import UpdateIcon from "@material-ui/icons/Update";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.100.19:3000/";
const socket = socketIOClient(ENDPOINT);

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <UpdateIcon {...props} ref={ref} />),
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

export default function Poli() {
  const { useState } = React;

  const url = "http://192.168.100.19:3000/api/poli";

  const [columns, setColumns] = useState([
    { title: "ID", field: "_id", hidden: true },
    {
      title: "Kode",
      field: "kode",
    },
    { title: "Nama Poli", field: "poli" },
    {
      title: "Status",
      field: "state",
      editable: "never",
      render: (rowData) => (
        <Typography
          style={rowData.state == "Y" ? { color: "green" } : { color: "red" }}
        >
          {rowData.state == "Y" ? "Buka" : "Libur"}
        </Typography>
      ),
    },
  ]);
  const [qna, setQna] = React.useState("Ubah Status Poli?");

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch(url + "/", {
      headers: {
        key: "hsdusay98wquey98327er8oiuwqhd89",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <MaterialTable
        title="Daftar Poli"
        icons={tableIcons}
        columns={columns}
        data={data}
        localization={{
          body: {
            deleteTooltip: "Update Status Poli",
            editRow: {
              deleteText: qna,
              cancelTooltip: "Batal",
              saveTooltip: "Simpan",
            },
          },
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                fetch(url + "/create", {
                  method: "POST",
                  body: JSON.stringify(newData),
                  headers: {
                    "Content-Type": "application/json",
                    key: "hsdusay98wquey98327er8oiuwqhd89",
                  },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res);

                    if (res.state == "200") {
                      setStatus("Success");
                      setMsg("Berhasil Menambahkan Poli");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "421") {
                      setStatus("Error");
                      setMsg("Invalid Object Id");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "423") {
                      setStatus("Error");
                      setMsg("Invalid Request");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "422") {
                      setStatus("Error");
                      setMsg("Invalid Model");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "410") {
                      setStatus("Error");
                      setMsg("Kode Poli Sudah Digunakan");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "402") {
                      setStatus("Error");
                      setMsg("Gagal Menambahkan Poli");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "500") {
                      setStatus("Error");
                      setMsg("Server Error");
                      fetchData();
                      handleClickOpen();
                    } else {
                      setStatus("Error");
                      setMsg("unknown Error");
                      fetchData();
                      handleClickOpen();
                    }

                    resolve();
                  });
              }, 100);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                console.log(newData);
                fetch(url + "/edit/" + oldData._id, {
                  method: "POST",
                  body: JSON.stringify(newData),
                  headers: {
                    "Content-Type": "application/json",
                    key: "hsdusay98wquey98327er8oiuwqhd89",
                  },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res);

                    if (res.state == "200") {
                      setStatus("Success");
                      setMsg("Berhasil Merubah Data Poli");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "421") {
                      setStatus("Error");
                      setMsg("Invalid Object Id");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "423") {
                      setStatus("Error");
                      setMsg("Invalid Request");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "422") {
                      setStatus("Error");
                      setMsg("Invalid Model");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "410") {
                      setStatus("Error");
                      setMsg("Kode Poli Sudah Digunakan");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "402") {
                      setStatus("Error");
                      setMsg("Gagal Merubah Data Poli");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "500") {
                      setStatus("Error");
                      setMsg("Server Error");
                      fetchData();
                      handleClickOpen();
                    } else {
                      setStatus("Error");
                      setMsg("unknown Error");
                      fetchData();
                      handleClickOpen();
                    }

                    resolve();
                  });
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let state = "";
                if (oldData.state == "Y") {
                  state = "N";
                } else {
                  state = "Y";
                }
                fetch(url + "/editState/" + oldData._id + "/" + state, {
                  headers: {
                    key: "hsdusay98wquey98327er8oiuwqhd89",
                  },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res);

                    if (res.state == "200") {
                      setStatus("Success");
                      if (state == "Y") {
                        setMsg("Berhasil Mengaktifkan Poli");
                      } else {
                        setMsg("Berhasil Menonaktifkan Poli");
                      }
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "421") {
                      setStatus("Error");
                      setMsg("Invalid Object Id");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "423") {
                      setStatus("Error");
                      setMsg("Invalid Request");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "402") {
                      setStatus("Error");
                      setMsg("Gagal Merubah Status Dokter");
                      fetchData();
                      handleClickOpen();
                    } else if (res.state == "500") {
                      setStatus("Error");
                      setMsg("Server Error");
                      fetchData();
                      handleClickOpen();
                    } else {
                      setStatus("Error");
                      setMsg("unknown Error");
                      fetchData();
                      handleClickOpen();
                    }

                    socket.emit("setpoli", "Poli Update");
                    // setQna("");
                    resolve();
                  });
              }, 100);
            }),
        }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{status}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Oke
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
