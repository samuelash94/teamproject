var nodemailer = require('nodemailer');
require('dotenv/config');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "4770GroupB@gmail.com",
        pass: process.env.MAILER_PASS
    }
    // remember to implement a config file before using this
});

module.exports.sendInitialEmail = function (receiver){
// setup e-mail data with unicode symbols

  var mailOptions = {
      from: '<4770GroupB@gmail.com>', // sender address
      to: receiver, // list of receivers
      subject: 'Welcome to our application!', // Subject line
      text: 'Hello World', // plaintext body
      html: '<b>This is a test ?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}
