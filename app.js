if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//imports
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const logger = require("morgan");

//set templating engine
app.set("view engine", "ejs");
app.set("layout", "./layouts/layouts");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(express.static("public"));

//routers
const usersRouter = require("./routes/users");

const call = () => {
  console.log(process.env.dbURI);
};

call();

app.use("/", usersRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening to port 3000");
});
