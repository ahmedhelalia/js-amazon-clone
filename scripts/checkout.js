import renderCheckOutHeader from "./checkout/checkOutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
import { Cart } from "../data/cart.js";
import { loadCart } from "../data/cart.js";

const cart = new Cart('cartItems');

Promise.all([
  new Promise((resolve) => {
    loadProducts(() => {
      resolve('value1');
    })
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve('value2');
    });
  })
]).then((values) => {
  console.log(values)
  renderCheckOutHeader();
  renderOrderSummary(cart);
  renderPaymentSummary(cart);
})

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve();
//   })
// }).then(() => {
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   })
// }).then(() => {
//   renderCheckOutHeader();
//   renderOrderSummary(cart);
//   renderPaymentSummary(cart);
// });

// loadProducts(() => {
//   loadCart(() => {
//     renderCheckOutHeader();
//     renderOrderSummary(cart);
//     renderPaymentSummary(cart);
//   });
// });

