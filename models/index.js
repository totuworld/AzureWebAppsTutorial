"use strict";

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const env       = process.env.NODE_ENV || "development";
const config    = require('../config/config.json')[env];

//환경 변수를 활용하면 해당 환경을 우선으로 적용한다. 
const username  = process.env.DBUSERNAME || config.username;
const password  = process.env.DBPASSWORD || config.password; 

var sequelize = new Sequelize(config.database, username, password, config);
var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;