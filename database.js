const Sequelize = require("sequelize")
require('dotenv').config()

let database, server, userName, password, port, schema = '';


database = process.env.DATABASE
userName = process.env.DBUSERNAME
password = process.env.DBPASSWORD
server = process.env.SERVER
port = process.env.DBPORT
schema = process.env.SCHEMA
console.log(userName)
const uri = `${database}://${userName}:${password}@${server}:${port}/${schema}`
console.log(uri);
const db = new Sequelize(uri, {
    logging: false

})



db.authenticate()
    .then(() => {
        console.log("DB connection is established");
    })
    .catch(err => {
        console.log('Unable to Connect to DB.', err.error)
    })

module.exports = db;