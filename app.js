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




app.post('/form', (req, res, next) => {
// Transporter set up
  let transporter = nodemailer.createTransport({
    jsonTransport: true
  });
  // check if form submittal is valid
  if (req.valid) {
    // map over email que and send the emails
    req.emailQue.map(email => {
       // send mail with defined transport object
      transporter.sendMail(email, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
        console.log(info.message); // JSON string
      });
    })
    // send success message
    res.status(200).json('success')

  } else {
    next(new Error(`nope it didn't take.`))
  }
 
})

app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

const port = process.env.PORT || 4040;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
