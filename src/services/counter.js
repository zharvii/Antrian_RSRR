const express = require("express");
const db = require("../db");
const model = require("../models/counter");

const name = "counter";

const get = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }
    let data = await db.collection(name).find().toArray();

    if (data.length > 0) {
      return res.json({
        message: "Success",
        data: data,
      });
    }

    return res.json({
      message: "Empty Data",
      data: [],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      data: [],
    });
  }
};

const getByNo = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }
    const { no } = req.params;

    let data = await db.collection(name).findOne({ no: no });

    if (data != null) {
      return res.json({
        message: "Success",
        data: data,
      });
    }

    return res.json({
      message: "Data Empty",
      data: [],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      data: [],
    });
  }
};

const getByPoli = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }
    const { kat, kode } = req.params;

    let condition = {};

    if (kat != "KOSONG" && kode != "KOSONG") {
      condition = {
        $and: [{ kode: kode }, { kategori: kat }, { dipanggil: "N" }],
      };
    } else if (kat != "KOSONG" && kode == "KOSONG") {
      condition = {
        $and: [{ kategori: kat }, { dipanggil: "N" }],
      };
    } else if (kat == "KOSONG" && kode != "KOSONG") {
      condition = {
        $and: [{ kode: kode }, { dipanggil: "N" }],
      };
    } else {
      condition = { dipanggil: "N" };
    }

    let data = await db.collection(name).find(condition).toArray();

    // let data = await db
    //   .collection(name)
    //   .find({
    //     $and: [{ kode: kode }, { kategori: kat }],
    //   })
    //   .toArray();

    if (data.length > 0) {
      return res.json({
        message: "Success",
        data: data,
      });
    }

    return res.json({
      message: "Empty Data",
      data: [],
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      data: [],
    });
  }
};

const call = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }
    const { no } = req.params;

    let newValue = { $set: { dipanggil: "Y" } };
    let kategori = no.substring(0, 1);
    let poli = no.substring(1, 2);

    if (kategori == "J") {
      let antrian = await db.collection(name).findOne({ no: no });
      newValue = { $set: { bpjs: no, dbpjs: antrian.dokter } };
    } else if (kategori == "U") {
      let antrian = await db.collection(name).findOne({ no: no });
      newValue = { $set: { umum: no, dumum: antrian.dokter } };
    } else {
      newValue = { $set: { bpjs: "-", umum: "-", dumum: "-", dbpjs: "-" } };
    }

    let setDisplay = await db
      .collection("poli")
      .updateOne({ kode: poli }, newValue);

    let exec = await db
      .collection(name)
      .updateOne({ no: no }, { $set: { dipanggil: "Y" } });

    let pr = await JSON.parse(exec);
    let ur = await JSON.parse(setDisplay);

    if (pr.n == 1 || pr.n != 0) {
      return res.send({
        message: "Success",
        state: "200",
      });
    }

    return res.json({
      message: "No Data Updated",
      state: "204",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      state: "500",
    });
  }
};

const create = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }

    const { body } = req;
    const result = await model.validate(body);
    const { value, error } = result;
    const valid = error == null;

    if (!valid) {
      return res.send({
        message: "Model Invalid",
        state: "422",
      });
    }

    let data = await db
      .collection(name)
      .find({ $and: [{ kategori: body.kategori }, { kode: body.kode }] })
      .toArray();

    if (data.length < 1) {
      let seq = "001";
      let nomor = body.kategori + body.kode + seq;
      let object = {
        no: nomor,
        seq: seq,
        pelayanan: body.pelayanan,
        kategori: body.kategori,
        kode: body.kode,
        dokter: body.dokter,
        dipanggil: "N",
      };

      let exec = await db.collection(name).insertOne(object);

      let pr = await JSON.parse(exec);
      if (pr.ok == 1 || pr.ol != 0) {
        return res.json({
          message: "Success",
          state: "200",
          data: object,
        });
      } else {
        return res.json({
          message: "Failed Create Data",
          state: "204",
          data: object,
        });
      }
    } else {
      let obj = data[data.length - 1];
      let no = obj.no;
      let num = no.toString().substring(2, 5);
      let increment = parseInt(num) + 1;
      let seq = increment.toString().padStart(3, "0");
      let nomor = body.kategori + body.kode + seq;
      let object = {
        no: nomor,
        seq: seq,
        pelayanan: body.pelayanan,
        kategori: body.kategori,
        kode: body.kode,
        dokter: body.dokter,
        dipanggil: "N",
      };

      let exec = await db.collection(name).insertOne(object);

      let pr = await JSON.parse(exec);
      if (pr.ok == 1 || pr.ol != 0) {
        return res.json({
          message: "Success",
          state: "200",
          data: object,
        });
      } else {
        return res.json({
          message: "Failed Create Data",
          state: "204",
          data: object,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      state: "500",
    });
  }
};

const reset = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        state: "422",
      });
    }
    let unset = await db
      .collection("poli")
      .updateMany(
        {},
        { $set: { bpjs: "-", umum: "-", dumum: "-", dbpjs: "-" } }
      );
    let exec = await db.collection(name).deleteMany({});

    let pr = await JSON.parse(exec);
    let ur = await JSON.parse(unset);

    if (pr.ok == 1 || pr.ok != 0) {
      return res.send({
        message: "Success",
        state: "200",
      });
    }

    return res.json({
      message: "Data Empty",
      state: "204",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Error",
      state: "500",
    });
  }
};

module.exports = {
  get: get,
  getByNo: getByNo,
  getByPoli: getByPoli,
  call: call,
  create: create,
  reset: reset,
};
