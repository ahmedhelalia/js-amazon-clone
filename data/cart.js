export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {

  let matchingItem;
  let addedMessageTimeout;

  cart.forEach((cartItem) => {
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
    cart.push({
      productId: productId,
      quantity: Number(selectedQuantity),
      deliveryOptionId: '1'
    })
  }
  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  })
  cart = newCart;
  let cartQuantity = calculateCartQuantity();
  localStorage.setItem('cartQuantity', cartQuantity);
  //console.log(localStorage.getItem('cartQuantity'));
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  })

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if (!matchingItem) {
    return;
  }
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}