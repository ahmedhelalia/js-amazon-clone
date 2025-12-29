import { Cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/delivery-options.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary(cart) {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
      <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div class="js-items-count-ps">Items (3):</div>
          <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money js-test-shipping-price">
          $${formatCurrency(shippingPriceCents)}
          </div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">
          $${formatCurrency(totalBeforeTaxCents)}
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">
          $${formatCurrency(taxCents)}
          </div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money js-test-total-price">
          $${formatCurrency(totalCents)}
          </div>
        </div>

        <button class="place-order-button button-primary js-place-your-order">
          Place your order
        </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;
  document.querySelector('.js-items-count-ps').innerHTML = `items (${localStorage.getItem('cartQuantity')})`;

  document.querySelector('.js-place-your-order').addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orderes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart
        })
      });

      const order = await response.json();
      addOrder(order);
      window.location.href = 'orders.html';

    } catch (error) {
      console.log('Unexpected error. try again later')
    }
  })
}

