export const cart = [];

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
      quantity: Number(selectedQuantity)
    })
  }
}