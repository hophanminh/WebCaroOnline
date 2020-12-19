const mysql = require("mysql");
const util = require("util");
const config = require('../config/default.json');

// test
// CHANGE DATABASE HERE
// const pool = mysql.createPool(config.mysql);
// const pool = mysql.createPool(config.mysql_cloud);      // hosted database
const pool = mysql.createPool(config.mysqlPM);


////////////////////////////////////////////////////


const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
    load: sql_string => mysql_query(sql_string),
    loadSafe: (sql_string, entity) => mysql_query(sql_string, entity),

    add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
    delete: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, [condition]),

    patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),
};