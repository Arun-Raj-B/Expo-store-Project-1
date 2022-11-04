const fast2sms = require("fast-two-sms");
const randomOTP = Math.floor(Math.random() * 10000);

module.exports = {
  randomOTP,
  sendMessage: (number) => {
    const options = {
      authorization:
        "jGMpbHuHOq35AFV26oha2gX3IoLfW2WaS8urwhDQkr1ihpkhKOsMrwAYDzES",
      sender_id: "EXPOSTORE",
      message: `Your OTP for EXPOstore login is ${randomOTP}`,
      numbers: [number],
    };

    fast2sms
      .sendMessage(options)
      .then((response) => {
        console.log("OTP send successfully");
      })
      .catch((err) => {
        console.log("Some error happened");
      });
  },
};
