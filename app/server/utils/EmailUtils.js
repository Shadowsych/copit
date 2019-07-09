// email packages
var nodemailer = require("nodemailer");

// config packages
var emailServiceConfig = require("../../../config/email/email_service.json");

class EmailUtils {
  // send an email to the email service
  static async sendEmail(to, subject, html) {
    // create an email transporter
    let transporter = nodemailer.createTransport({
      host: emailServiceConfig.host,
      port: emailServiceConfig.port,
      secure: emailServiceConfig.secure,
      auth: {
        user: emailServiceConfig.user,
        pass: emailServiceConfig.pass
      }
    });

    // setup the mail options
    let mailOptions = {
      from: emailServiceConfig.user,
      to: to,
      subject: subject,
      html: html
    }

    // send the email via the transporter
    transporter.sendMail(mailOptions, (error, data) => {
      if(!error) {
        // the email was sent successfully
        console.log("Email sent: " + data.response);
      } else {
        // an error occurred when sending the email
        console.log(error);
      }
    });
  }
}
module.exports = EmailUtils;
