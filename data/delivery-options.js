import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliveryOptions[0];
}

function isWeekEnd(date) {
  return date.format('dddd') === 'Saturday' || date.format('dddd') === 'Sunday';
}

export function calculateDeliveryDate(deliveryOption) {
  let deliveryDate = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;
  while (daysToAdd > 0) {
    deliveryDate = deliveryDate.add(1, 'day');
    if (!isWeekEnd(deliveryDate)) {
      daysToAdd--;
    }
  }
  
  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}