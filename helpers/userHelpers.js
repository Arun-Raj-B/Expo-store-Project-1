const db = require("../config/connection");
const collection = require("../config/collections");
const bcrypt = require("bcrypt");
module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      const checkMail = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      const checkMobile = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ mobilenumber: userData.mobilenumber });
      if (!checkMail && !checkMobile) {
        userData.password = await bcrypt.hash(userData.password, 10);
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne({
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            mobilenumber: userData.mobilenumber,
            role: "user",
            access: true,
            isVerified: false,
          })
          .then((data) => {
            console.log(data);
            resolve(data.insertedId);
          });
      } else {
        if (checkMail) {
          let mailExistsErr = "Email already exists";
          reject(mailExistsErr);
        } else {
          let mobileExistsErr = "This mobile number is already in use";
          reject(mobileExistsErr);
        }
      }
    });
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("Login Succeess");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login failed");
        resolve({ status: false });
      }
    });
  },

  doVerify: (mobile) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { mobilenumber: mobile },
          {
            $set: {
              isVerified: true,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },

  checkNoExist: (mobile) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          mobilenumber: mobile,
        })
        .then((user) => {
          resolve(user);
        });
    });
  },
};
