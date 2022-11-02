if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//imports
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");
const fileUpload = require("express-fileupload");

const db = require("./config/connection");

//set templating engine
app.set("view engine", "ejs");
app.set("layout", "./layouts/expoStoreLayout");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.static("public"));
app.use(fileUpload());
//db connection
db.connect((err) => {
  if (err) {
    console.log("Connection Error" + err);
  } else {
    console.log("Database Connected Successfully");
  }
});

//routers
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

app.use("/", usersRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening to port 3000");
});
