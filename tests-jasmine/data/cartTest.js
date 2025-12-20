import { addToCart, cart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../data/cart.js";

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
      value: 0,
    }

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
  })

  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      }])
    });

    loadFromStorage();

    addToCart(productId);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity: 2,
      deliveryOptionId: '1'
    }]));
  })

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([])
    });

    loadFromStorage();

    addToCart(productId);

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity: 0,
      deliveryOptionId: '1'
    }]));
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity + 1).toEqual(1);
  })
});

describe('test suite: remove from cart', () => {
  let productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      }])
    });
  });

  it('remove a product that\'s in the cart', () => {
    loadFromStorage();
    removeFromCart(productId);

    expect(cart.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });

  it('it does nothing if the product is not in the cart', () => {
    loadFromStorage();
    removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c3');

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]));
  });
});

describe('test suite: update delivery option', () => {
  let productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      }]);
    });
    loadFromStorage();
  })
  it('update the delivery option of a product in the cart', () => {
    updateDeliveryOption(productId, '3');
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '3'
    }]));
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(cart.length).toEqual(1);
  });

  it('does nothing if the product is not in the cart', () => {
    updateDeliveryOption('a-product-not-in-the-cart', '3');
    expect(localStorage.setItem).not.toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]));

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity).toEqual(1);
    expect(cart[0].deliveryOptionId).toEqual('1');
    expect(cart.length).toEqual(1);
  });
});

