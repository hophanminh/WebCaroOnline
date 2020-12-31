const mysql = require("mysql");
const util = require("util");
const config = require("../config/default-config.json");

const pool = mysql.createPool(config["mysql-local"]);
//const pool = mysql.createPool(config["mysql_cloud"]);

const query = util.promisify(pool.query).bind(pool);

module.exports = {
    load: sql => query(mysql),
    loadSafe: (sql, entity) => query(sql, entity),
    add: (tableName, entity) => query(`insert into ${tableName} set ?`, entity),
    delete: (tableName, condition) => query(`delete from ${tableName} where ?`,[condition]),
    patch: (tableName, entity, condition) => query(`update ${tableName} set ? where ?`, [entity, condition]),
}