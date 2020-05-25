const Sequelize = require("sequelize")

const db = new  ('postgres://uaywvxyj:PQIbaoWyoOcp2VBAu71gbP_r4zC9wZAs@drona.db.elephantsql.com:5432/uaywvxyj',{
    logging: false

})



db.authenticate()
    .then(() => {
        console.log("DB connection is established");
    })

module.exports = db;