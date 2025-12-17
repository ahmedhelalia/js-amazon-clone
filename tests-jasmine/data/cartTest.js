import { addToCart, cart, loadFromStorage } from "../../data/cart.js";

describe('test suite: add to cart', () => {
  let mockAddedElement;
  let mockQuantityElement;
  let productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

  beforeEach(() => {
    mockAddedElement = {
      classList: {
        add: jasmine.createSpy('classList.add'),
        remove: jasmine.createSpy('classList.remove')
      }
    }
    mockQuantityElement = {
      value: '0',
    }
  })

  it('adds an existing product to the cart', () => {
    spyOn(document, 'querySelector').and.callFake((selector) => {
      if (selector === `.js-added-to-cart-${productId}`) {
        return mockAddedElement;
      }
      if (selector === `.js-quantity-selector-${productId}`) {
        return mockQuantityElement;
      }
      return null;
    });

    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId,
        quantity: 1,
        deliverOptionId: '1'
      }])
    });

    loadFromStorage();

    addToCart(productId);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity).toEqual(2);
  })

  it('adds a new product to the cart', () => {
    spyOn(document, 'querySelector').and.callFake((selector) => {
      if (selector === `.js-added-to-cart-${productId}`) {
        return mockAddedElement;
      }
      if (selector === `.js-quantity-selector-${productId}`) {
        return mockQuantityElement;
      }
      return null;
    });

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([])
    });

    loadFromStorage();

    addToCart(productId);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity + 1).toEqual(1);
  })
})