import { cart } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/delivery-options.js'
import { renderPaymentSummary } from './paymentSummary.js'
export function renderOrderSummary() {
  let cartSummaryHTML = '';
  cart.cartItems.forEach((cartItem) => {

    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML +=
      `<div class="cart-item-container 
        js-test-cart-item-container
        js-cart-item-container-${matchingProduct.id}
        ">
              <div class="delivery-date">
                Delivery date: ${dateString}
              </div>

              <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                  <div class="product-name js-test-product-name-${matchingProduct.id}">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price js-test-product-price-${matchingProduct.id}">
                    $${formatCurrency(matchingProduct.priceCents)}
                  </div>
                  <div class="product-quantity 
                  js-test-product-quantity-${matchingProduct.id}">
                    <span>
                      Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                    </span>
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                      Update
                    </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}"> Save </span>
                    <span class="delete-quantity-link link-primary js-delete-link
                    js-test-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                  ${deliveryOptionsHtml(matchingProduct, cartItem)}
                </div>
              </div>
            </div>`;
  });

  function deliveryOptionsHtml(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {

      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}  `;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option js-test-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id=${deliveryOption.id}
        >
          <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input js-test-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}" name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
        </div>
        `
    })
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        cart.removeFromCart(productId);
        renderOrderSummary();
        updateCartQuantity();
        renderPaymentSummary();
      })

    })

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        cartItemContainer.classList.add('is-editing-quantity');
      })
    })

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
        cartItemContainer.classList.remove('is-editing-quantity');
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        let newQuantity = Number(quantityInput.value);

        if (newQuantity > 1000 || newQuantity <= 0) {
          alert(`quantity must be bigger than 0 and less than 100`);
          return;
        }

        cart.updateQuantity(productId, newQuantity);
        updateCartQuantity();
        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabel.innerHTML = newQuantity;

      })
    })

  function updateCartQuantity() {
    const cartQuantity = cart.calculateCartQuantity();
    document.querySelector('.js-return-home').innerHTML = cartQuantity;
    localStorage.setItem('cartQuantity', cartQuantity);
    renderPaymentSummary();
  }

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
    })

  document.querySelector('.js-return-home').innerHTML = localStorage.getItem('cartQuantity');
}
cart.loadFromStorage();