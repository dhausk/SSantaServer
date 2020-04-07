require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const valid = require("./MiddleWare/validate");
const list = require("./MiddleWare/createList");
const emailObj= require("./MiddleWare/emailObj");

app.disable('x-powered-by')

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

// app.use('/form', valid());
// app.use('/form', list());
// app.use('/form', emailObj());

const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  service: "yahoo",
  port: 587,
  pool: true,
  secure: true, 
  auth: {
    username: "dhassick@yahoo.com",
    password: "Dhsg(imm)",
  },
  logger: true,
});
console.log(transporter)
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP is connected, ready for messages");
  }
});

app.post('/single', cors(), (req, res, next) => {
  let message = {
    from: 'dhassick@yahoo.com', // my email server address
    to: `${req.body.toEmail}`,  // The admins email
    subject: `Test Email from Local 4040`,
    text: `${req.body.message}`,
  };
  console.log(message)
  transporter.sendMail(message, (err, info, response) => {
    console.log("info: " + info);
    console.log("error: " + err);
    console.log(response);
  });
  res.status(200).json(`func ran`);
})


// app.post('/form', cors(), (req, res, next) => {
// //   check if form submittal is valid
//   if (req.valid) {
//     // map over email que and send the emails
//     req.emailQue.map(email => {
//        // send mail with defined transport object
//       transporter.sendMail(email, (err, info) => {
//        console.log("info: "+ info);
//        console.log("error: "+ err)
//       });
//     })
//     // send success message
//     console.log(req.body)
//     res.status(200).json('Emails have been Sent')
//   } else {
//     res.status(500).json('Whoops please double check all emails and make sure they are correct.')
//   }
// })

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
