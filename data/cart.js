import { deliveryOptions } from './delivery-options.js';
export class Cart {
  cartItems = [];
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId) {
    let matchingItem;
    let addedMessageTimeout;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    })

    const addedSelector = document.querySelector(`.js-added-to-cart-${productId}`);
    addedSelector.classList.add('added-to-cart-visible')
    if (addedMessageTimeout) {
      clearTimeout(addedMessageTimeout);
    }
    addedMessageTimeout = setTimeout(() => {
      addedSelector.classList.remove('added-to-cart-visible')
    }, 2000);

    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    let selectedQuantity = quantitySelector.value;

    if (matchingItem) {
      matchingItem.quantity++;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: Number(selectedQuantity),
        deliveryOptionId: '1'
      })
    }
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    })
    this.cartItems = newCart;
    this.saveToStorage();
  }

  calculateCartQuantity() {
    let cartQuantity = 0;
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    })

    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.quantity = newQuantity;
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    let matchingDeliveryOptionId;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    if (!matchingItem) {
      return;
    }

    deliveryOptions.forEach((deliveryOption) => {
      if (deliveryOptionId === deliveryOption.id) {
        matchingDeliveryOptionId = deliveryOptionId;
      }
    });

    if (!matchingDeliveryOptionId) {
      return;
    }

    matchingItem.deliveryOptionId = matchingDeliveryOptionId;
    this.saveToStorage();
  }
}
