const fast2sms = require("fast-two-sms");

module.exports = {
  obj: {
    OTP: 1,
  },
  sendMessage: (number) => {
    let randomOTP = Math.floor(Math.random() * 10000);
    const options = {
      authorization: process.env.authorisation,
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
    // this.obj = 2;
    // console.log(this.obj + "this is top");
    // console.log(this.obj.OTP);
    // this.obj.OTP = randomOTP;
    return randomOTP;
  },
};
