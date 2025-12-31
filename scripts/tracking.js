import { fetchProducts, getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { getOrder } from "../data/orders.js";



async function generateTrackingInfo() {
  await fetchProducts();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');


  const product = getProduct(productId);
  const order = getOrder(orderId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  })

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliverTime);
  const progress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const trackingInfoHtml =
    `
    <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${dayjs(productDetails.estimatedDeliverTime).format('MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image}">

    <div class="progress-labels-container">
      <div class="progress-label ${progress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${(progress >= 50 && progress < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${progress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progress}%"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingInfoHtml;
  document.querySelector('.js-cart-quantity').innerHTML = localStorage.getItem('cartQuantity');
}

generateTrackingInfo();