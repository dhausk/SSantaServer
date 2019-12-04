const dotenv = require('dotenv');
dotenv.config({ path: './env' });
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const valid = require("./validate");
const list = require("./createList");
const emailObj= require("./emailObj");


app.disable('x-powered-by')

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/form', valid());
app.use('/form', list());
app.use('/form', emailObj());

console.log(process.env.USER_NAME)
const transporter = nodemailer.createTransport({
  pool: true,
  host: "in-v3.mailjet.com",
  service: "mailjet",
  port: 587,
  secure: false, 
  auth: {
    username: process.env.USER_NAME,
    password: process.env.PW
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post('/form', cors(), (req, res, next) => {
//   check if form submittal is valid
  if (req.valid) {
    // map over email que and send the emails
    req.emailQue.map(email => {
       // send mail with defined transport object
      transporter.sendMail(email, (err, info) => {
       console.log("info: "+ info);
       console.log("errors: "+ err)
      });
    })
    // send success message
    console.log(req.body)
    res.status(200).json('Emails have been Sent')
  } else {
    res.status(500).json('Whoops please double check all emails and make sure they are correct.')
  }
})

app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  console.log(err.message)
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

const port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
