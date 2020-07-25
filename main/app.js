var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
require('dotenv').config()
var Utils = require('../utils/utils')



var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", 'https://taskreminder-kd.herokuapp.com');
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS")
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors())

app.use("/task", require('../routes/taskRoutes'))

app.use("/users", require('../routes/userRoutes'))

async function sendMail(){
    setInterval(Utils.sendReminder,1 * 60 * 1000)
}
 
sendMail()
module.exports = app;
