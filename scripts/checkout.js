import renderCheckOutHeader from "./checkout/checkOutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
import { Cart } from "../data/cart.js";

const cart = new Cart('cartItems');
loadProducts(() => {
  renderCheckOutHeader();
  renderOrderSummary(cart);
  renderPaymentSummary(cart);
});
