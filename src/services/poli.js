const express = require("express");
const db = require("../db");
const model = require("../models/poli");
const ObjectID = require("mongodb").ObjectID;

const name = "poli";

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

const getById = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }

    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
      return res.json({
        message: "ID Invalid",
        data: [],
      });
    }

    let data = await db.collection(name).findOne({ _id: ObjectID(id) });

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

const getActive = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        data: [],
      });
    }

    let data = await db.collection(name).find({ state: "Y" }).toArray();

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

const editState = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        state: "423",
      });
    }

    const { id, state } = req.params;

    if (!ObjectID.isValid(id)) {
      return res.json({
        message: "ID Invalid",
        state: "421",
      });
    }

    if (state != "Y" && state != "N") {
      return res.json({
        message: "State Invalid",
        state: "422",
      });
    }

    let exec = await db
      .collection(name)
      .updateOne({ _id: ObjectID(id) }, { $set: { state: state } });

    let pr = await JSON.parse(exec);
    if (pr.n == 1 || pr.n != 0) {
      return res.send({
        message: "Success",
        state: "200",
      });
    }

    return res.json({
      message: "No State Updated",
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
        state: "423",
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

    let count = await db.collection(name).find({ kode: body.kode }).count();

    if (count > 0) {
      return res.json({
        message: "Kode Is Used",
        state: "410",
      });
    }

    let exec = await db.collection(name).insertOne({
      kode: body.kode,
      poli: body.poli,
      bpjs: "-",
      umum: "-",
      dumum: "-",
      dbpjs: "-",
      state: "Y",
    });

    let pr = await JSON.parse(exec);
    if (pr.ok == 1 || pr.ol != 0) {
      return res.json({
        message: "Success",
        state: "200",
      });
    }

    return res.json({
      message: "Failed Create Data",
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

const edit = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        state: "423",
      });
    }

    const { id } = req.params;
    const { body } = req;
    const result = await model.validate(body);
    const { value, error } = result;
    const valid = error == null;

    if (!ObjectID.isValid(id)) {
      return res.json({
        message: "ID Invalid",
        state: "421",
      });
    }

    if (!valid) {
      return res.send({
        message: "Model Invalid",
        state: "422",
      });
    }

    let data = await db.collection(name).findOne({ _id: ObjectID(id) });

    if (data.kode != body.kode) {
      let count = await db.collection(name).find({ kode: body.kode }).count();

      if (count > 0) {
        return res.json({
          message: "Kode Is Used",
          state: "410",
        });
      }

      let exec = await db
        .collection(name)
        .updateOne(
          { _id: ObjectID(id) },
          { $set: { kode: body.kode, poli: body.poli } }
        );

      let pr = await JSON.parse(exec);
      if (pr.n == 1 || pr.n != 0) {
        return res.send({
          message: "Success",
          state: "200",
        });
      } else {
        return res.json({
          message: "Failed Edit Data",
          state: "204",
        });
      }
    } else {
      let exec = await db
        .collection(name)
        .updateOne({ _id: ObjectID(id) }, { $set: { poli: body.poli } });

      let pr = await JSON.parse(exec);
      if (pr.n == 1 || pr.n != 0) {
        return res.send({
          message: "Success",
          state: "200",
        });
      } else {
        return res.json({
          message: "Failed Create Data",
          state: "204",
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

const remove = async (req, res, next) => {
  try {
    const { key } = req.headers;

    if (key != process.env.APP_KEY) {
      return res.status(422).json({
        message: "Invalid Request",
        state: "423",
      });
    }

    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
      return res.json({
        message: "ID Invalid",
        state: "421",
      });
    }

    let exec = await db.collection(name).deleteOne({ _id: ObjectID(id) });

    let pr = await JSON.parse(exec);

    if (pr.n == 1 || pr.n != 0) {
      return res.send({
        message: "Success",
        state: "200",
      });
    }

    return res.json({
      message: "Failed",
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
  getById: getById,
  getActive: getActive,
  editState: editState,
  create: create,
  edit: edit,
  remove: remove,
};
