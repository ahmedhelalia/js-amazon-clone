import renderCheckOutHeader from "./checkout/checkOutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { fetchProducts } from "../data/products.js";
import { Cart } from "../data/cart.js";
import { loadCart } from "../data/cart.js";

const cart = new Cart('cartItems');

async function loadPage() {
  try {
    // throw 'error1';
    await fetchProducts();

    await new Promise((resolve, reject) => {
      loadCart(() => {
        //reject()
        resolve();
      })
    });
  } catch (error) {
    console.log('Unexpected error! Please try again later')
  }
  

  renderCheckOutHeader();
  renderOrderSummary(cart);
  renderPaymentSummary(cart);
}

loadPage();

/*
Promise.all([
  fetchProducts(),
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
*/
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

