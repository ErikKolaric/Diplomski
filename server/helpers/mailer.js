require("dotenv").config();
const mailjet = require('node-mailjet').apiConnect(
  process.env.MAILJET_API_KEY || 'your-mailjet-api-key',
  process.env.MAILJET_API_SECRET || 'your-mailjet-api-secret'
);

const sendMail = (to, subject, text, html) => {
  const request = mailjet
    .post("send", { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: "getbrandboost@outlook.com",
            Name: "Excited User"
          },
          To: [
            {
              Email: to,
              Name: "Recipient"
            }
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        }
      ]
    });

  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.error(err.statusCode);
    });
};

module.exports = sendMail;