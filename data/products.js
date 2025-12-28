import { formatCurrency } from '../scripts/utils/money.js';
export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}
export class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHtml() {
    return '';
  }
}

export class Clothing extends Product {
  sizeChartLink;
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHtml() {
    return `
    <a href="${this.sizeChartLink}" target="_blank">
    Size chart
    </a>
    `;
  }
}

export class Appliance extends Product {
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);

    this.instructionsLink = productDetails.instructionsLink;

    this.warrantyLink = productDetails.warrantyLink;
  }

  extraInfoHtml() {
    return `
    <a href="${this.instructionsLink}" target="_blank">
    Instructions Link
    </a>
    <br/>
    <a href="${this.warrantyLink}" target="_blank">
    Warranty Link
    </a>
    `;
  }

}

export let products = [];

export function fetchProducts() {
  const promise = fetch('https://supersimplebackend.dev/products').then((response) => {
    return response.json()
  }).then((productsData) => {
    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      } else if (productDetails.type === 'appliances') {
        return new Appliance(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('load products');
  });
  return promise;
}
fetchProducts().then(() => {
  console.log('next step')
});