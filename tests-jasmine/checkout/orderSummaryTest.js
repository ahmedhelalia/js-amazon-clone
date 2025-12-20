import { loadFromStorage, cart } from "../../data/cart.js";
import { renderOrderSummary } from "../../scripts/checkout/orderSummary.js";

describe('test suite: render order summary', () => {

  const productIdOne = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productIdTwo = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  // a hook that will run before each test
  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
    <div class='js-order-summary'> </div>
    <div class='js-return-home'> </div>
    <div class='js-payment-summary'> </div>
    `;

    spyOn(localStorage, 'setItem')
    spyOn(localStorage, 'getItem').and.callFake(($item) => {
      if ($item === 'cart') {
        return JSON.stringify([{
          productId: productIdOne,
          quantity: 2,
          deliveryOptionId: '1'
        }, {
          productId: productIdTwo,
          quantity: 1,
          deliveryOptionId: '2'
        }]);
      } else if ($item === 'cartQuantity') {
        return " ";
      } else {
        return null;
      }
    });

    loadFromStorage();

    renderOrderSummary();
  })
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

    expect(document.querySelector(`.js-test-product-quantity-${productIdOne}`)).toEqual(null);

    expect(document.querySelector(`.js-test-product-quantity-${productIdTwo}`)).not.toEqual(null);

    expect(document.querySelector(`.js-test-product-name-${productIdTwo}`).innerText).toEqual('Intermediate Size Basketball');

    expect(document.querySelector(`.js-test-product-price-${productIdTwo}`).innerText).toEqual('$20.95');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productIdTwo);
  })

  afterEach(() => {
    document.querySelector('.js-test-container').innerHTML = '';
  })

})