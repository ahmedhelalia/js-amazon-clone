import { Cart } from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";

describe('test suite: render order summary', () => {
  let cart;
  const productIdOne = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productIdTwo = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  let mockCartData;
  // a hook that will run before each test
  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
    <div class='js-order-summary'> </div>
    <div class='js-return-home'> </div>
    <div class='js-payment-summary'> </div>
    `;
    mockCartData = [{
      productId: productIdOne,
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: productIdTwo,
      quantity: 1,
      deliveryOptionId: '2'
    }];

    let mockStorage = {
      'cartOrderTest': JSON.stringify(mockCartData)
    }

    spyOn(localStorage, 'getItem').and.callFake((key) => {
      return mockStorage[key];
    });

    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      mockStorage[key] = value;
    });

    cart = new Cart('cartOrderTest');
    renderOrderSummary(cart);
  });

  // test how the page looks
  it('displays the cart', () => {
    expect(document.querySelectorAll('.js-test-cart-item-container').length).toEqual(2);

    expect(document.querySelector(`.js-test-product-name-${productIdOne}`).innerText).toEqual('Black and Gray Athletic Cotton Socks - 6 Pairs');

    expect(document.querySelector(`.js-test-product-name-${productIdTwo}`).innerText).toEqual('Intermediate Size Basketball');

    expect(document.querySelector(`.js-test-product-price-${productIdOne}`).innerText).toEqual('$10.90')

    expect(document.querySelector(`.js-test-product-price-${productIdTwo}`).innerText).toEqual('$20.95')

    expect(document.querySelector(`.js-test-product-quantity-${productIdOne}`).innerText).toContain('Quantity: 2');

    expect(document.querySelector(`.js-test-product-quantity-${productIdTwo}`).innerText).toContain('Quantity: 1');
  })

  // test how the page behaves
  it('removes a product', () => {
    document.querySelector(`.js-test-delete-link-${productIdOne}`).click();
    cart = new Cart('cartOrderTest');
    expect(document.querySelector(`.js-test-product-quantity-${productIdOne}`)).toEqual(null);

    expect(document.querySelector(`.js-test-product-quantity-${productIdTwo}`)).not.toEqual(null);

    expect(document.querySelector(`.js-test-product-name-${productIdTwo}`).innerText).toEqual('Intermediate Size Basketball');

    expect(document.querySelector(`.js-test-product-price-${productIdTwo}`).innerText).toEqual('$20.95');

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual(productIdTwo);
  })

  it('updates delivery option', () => {
    document.querySelector(`.js-test-delivery-option-${productIdOne}-3`).click();
    cart = new Cart('cartOrderTest');
    expect(document.querySelector(`.js-test-delivery-option-input-${productIdOne}-3`).checked).toEqual(true);
    expect(cart.cartItems.length).toEqual(2);
    expect(cart.cartItems[0].productId).toEqual(productIdOne);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('3');
    expect(document.querySelector('.js-test-shipping-price').innerText).toEqual('$14.98');
    expect(document.querySelector('.js-test-total-price').innerText).toEqual('$63.50');
  });

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  })

})