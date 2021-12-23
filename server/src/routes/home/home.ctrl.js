"use strict";
import mysql from "mysql";
import path from "path";
import fs from "fs";
import { dbConfig } from "../../../config/database.js";
import { convertAudioToScript } from "../../../modules/speechToText/speechToTextApi.js";
import { getFileInstance } from "../../models/UserStorage.js";
import { translation } from "../../../modules/translation/translateApi.js";
import { getHashFileName } from "../../../common/stringUtils.js";
import { storeLocalScript } from "../../../common/fileUtils.js";

const __dirname = path.resolve();
const connection = mysql.createConnection(dbConfig);

const output = {
  home: (req, res) => {
    console.log("home");
    // res.render("home/index");
  },
  login: (req, res) => {
    console.log("login");
    // res.render("home/login");
  },
  register: (req, res) => {
    console.log("hi");
    // res.render("home/register");
  },
  getlist: (req, res) => {
    const connection = mysql.createConnection(dbConfig);
    const sql = `SELECT * from Scripts where user_pk = ${req.query.user_pk};`;
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if (rows?.length > 0) {
        console.log(rows);
        return res.json({
          success: true,
          filelist: rows,
        });
      } else {
        return res.json({
          success: false,
          msg: "파일이 존재하지 않습니다.",
        });
      }
    });
  },

  getfile: (req, res) => {
    var connection = mysql.createConnection(dbConfig);
    var sql = `SELECT * from Scripts where script_id = '${req.query.script_id}';`;
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if (rows?.length > 0) {
        fs.readFile(rows[0].path, "utf8", function (err, data) {
          console.log(data);
          return res.json({
            success: true,
            content: data,
          });
        });
      } else {
        return res.json({
          success: false,
          msg: "파일이 존재하지 않습니다.",
        });
      }
    });
  },
};

const process = {
  register: (req, res) => {
    var connection = mysql.createConnection(dbConfig);
    var sql = `SELECT * from Users where id = '${req.body.id}';`;
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if (rows?.length > 0) {
        return res.json({
          success: false,
          msg: "이미 존재하는 아이디입니다.",
        });
      } else {
        sql = `INSERT INTO Users VALUES ('${req.body.id}','${
          req.body.psword
        }',${Math.floor(Math.random() * 10000)});`;
        connection.query(sql, function (err, rows, fields) {
          if (err) {
            console.log(err);
          } else {
            return res.json({
              success: true,
              msg: "회원가입에 성공했습니다.",
            });
          }
        });
      }
    });
  },
  login: (req, res) => {
    var connection = mysql.createConnection(dbConfig);
    var sql = `SELECT * from Users where id = '${req.body.id}' and password = '${req.body.psword}';`;
    connection.query(sql, function (err, rows, fields) {
      if (err) {
        console.log(err);
      }
      if (rows?.length > 0) {
        console.log(rows);
        return res.json({
          user_pk: rows[0].user_pk,
          success: true,
        });
      } else {
        console.log(req.body);
        return res.json({
          success: false,
          msg: "로그인에 실패했습니다.",
        });
      }
    });
  },
  uploadAudio: async (req, res) => {
    if (req.files === undefined) {
      res.status(400); // bad request는 400번
    }

    const file = getFileInstance(req.files.file)
    const fileHashName = getHashFileName(file.path);
    
    // STT 수행
    const script = await convertAudioToScript(
      file.path,
      file.extension
    );
    // 결과를 local에 json으로 저장. 오디오 이름에 _script 붙임.
    storeLocalScript(JSON.stringify({ data: script }), fileHashName);
    
    console.log(script);

    /* const pk = Math.floor(Math.random() * 10000);

    var connection = mysql.createConnection(dbConfig);
    var sql = `INSERT INTO Scripts VALUES (${pk},${req.body.user_pk},"${scriptPath}","${file.name}","${req.body.date}");INSERT INTO Audios VALUES (${pk},"${audioPath}","${file.name}","${req.body.date}",${req.body.user_pk});`;
    connection.query(sql, function (err, rows, fields){
      if (err) {
        console.log(err);
      }
      if (rows?.length > 0) {
        res.status(200).send("OK");
      } else {
        console.log(req.body);
        return res.json({
          success: false,
          msg: "업로드에 실패했습니다.",
        });
      }
    })*/
  },
};

export default { output, process };
