import { Cart } from "../../data/cart.js";
let cart;

describe('test suite: add to cart', () => {

  let productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';


  it('adds an existing product to the cart', () => {
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId,
        quantity: 1,
        deliveryOptionId: '1'
      }])
    });
    spyOn(localStorage, 'setItem')
    cart = new Cart('cartTest');
    cart.addToCart(productId);

    expect(cart.cartItems.length).toEqual(1);

    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartTest', JSON.stringify([{
      productId: productId,
      quantity: 2,
      deliveryOptionId: '1'
    }]));
  })

  it('adds a new product to the cart', () => {
    spyOn(localStorage, 'setItem')
    cart = new Cart('cartTest2');

    cart.addToCart(productId);

    expect(cart.cartItems.length).toEqual(1);

    expect(localStorage.setItem).toHaveBeenCalledWith('cartTest2', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]));
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
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
    cart = new Cart('cartTest');
  });

  it('remove a product that\'s in the cart', () => {
    cart.removeFromCart(productId);

    expect(cart.cartItems.length).toEqual(0);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartTest', JSON.stringify([]));
  });

  it('it does nothing if the product is not in the cart', () => {
    cart.removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c3');

    expect(cart.cartItems.length).toEqual(1);
    expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cartTest', JSON.stringify([{
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
    cart = new Cart('cartTest');
  })
  it('update the delivery option of a product in the cart', () => {
    cart.updateDeliveryOption(productId, '3');
    expect(localStorage.setItem).toHaveBeenCalledWith('cartTest', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '3'
    }]));
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('3');
    expect(cart.cartItems.length).toEqual(1);
  });

  it('does nothing if the product is not in the cart', () => {
    cart.updateDeliveryOption('a-product-not-in-the-cart', '3');
    expect(localStorage.setItem).not.toHaveBeenCalledWith('cartTest', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]));

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(cart.cartItems.length).toEqual(1);
  });

  it('does nothing if the delivery option is not in the delivery options', () => {
    cart.updateDeliveryOption(productId, '4');

    expect(localStorage.setItem).not.toHaveBeenCalledWith('cartTest', JSON.stringify([{
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    }]));

    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    expect(cart.cartItems[0].productId).toEqual(productId);
    expect(cart.cartItems[0].quantity).toEqual(1);
    expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
    expect(cart.cartItems.length).toEqual(1);
  });
});

