const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const AdminProductsRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartRouter = require("./routes/carts");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Session For authontication
app.use(
  cookieSession({
    keys: ["hkskdfgh564jhg"],
  })
);

app.use(authRouter);
app.use(productsRouter);
app.use(AdminProductsRouter);
app.use(cartRouter);

app.listen(3000, () => {
  console.log("listening");
});
