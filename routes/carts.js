const express = require("express");
const carts = require("../repositories/carts");
const CartsRepo = require("../repositories/carts");
const productRepo = require("../repositories/products");
const cartShowTemp = require("../views/carts/show");
const router = express.Router();

// Receive a post request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  // Figure  out the cart
  let cart;
  if (!req.session.cartId) {
    cart = await CartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    cart = await CartsRepo.getOne(req.session.cartId);
  }

  const existItem = cart.items.find((item) => item.id === req.body.productId);
  if (existItem) {
    // increament quantity and save cart
    existItem.quantity++;
  } else {
    // add new id to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }

  await CartsRepo.update(cart.id, { items: cart.items });
  res.redirect("/cart");
});
// Receive a get request to show all items in cart
router.get("/cart", async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await CartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    const product = await productRepo.getOne(item.id);

    item.product = product;
  }
  res.send(cartShowTemp({ items: cart.items }));
});
// Receive a post request to delete an item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const { itemId } = req.body;
  const cart = await CartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter((item) => item.id !== itemId);

  await CartsRepo.update(req.session.cartId, { items });
  res.redirect("/cart");
});
module.exports = router;
