const fast2sms = require("fast-two-sms");

module.exports = {
  sendMessage: (number, message) => {
    const options = {
      authorization: process.env.authorisation,
      sender_id: "EXPOSTORE",
      message: message,
      numbers: [number],
    };

    fast2sms
      .sendMessage(options)
      .then((response) => {
        console.log("message send successfully");
      })
      .catch((err) => {
        console.log("Some error happened");
      });
  },
};
