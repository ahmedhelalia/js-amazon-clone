import renderCheckOutHeader from "./checkout/checkOutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { Cart } from "../data/cart.js";

const cart = new Cart('cartItems');

renderCheckOutHeader();
renderOrderSummary(cart);
renderPaymentSummary(cart);