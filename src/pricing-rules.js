import { roundOffTwoDecimalPlaces } from "./utilities.js";
import products from "./products.js";

const getFilteredProducts = (productCode, items) => {
    return items.filter(item => item.productCode === productCode);
};

/**
 * A 3 for 2 deal on Unlimited 1GB Sims. So for example, if you buy 3 Unlimited 1GB
 * Sims, you will pay the price of 2 only for the first month
 */
const threeForTwoUnlimited1GBSims = (items) => {
    let total = 0;

    const filteredProducts = getFilteredProducts('ult_small', items);

    filteredProducts.forEach((item, key) => {
        if ((key + 1) % 3 !== 0) {
            total += item.price;
        }
    });

    return roundOffTwoDecimalPlaces(total);
};

/**
 * The Unlimited 5GB Sim will have a bulk discount applied; whereby the price will
 * drop to $39.90 each for the first month, if the customer buys more than 3.
 */
const unlimited5GBSimBulkDiscount = (items) => {
    let total = 0;

    const filteredProducts = getFilteredProducts('ult_large', items);

    if (filteredProducts.length > 3) {
        for (const item of filteredProducts) {
            item.price = 39.90;
            total += item.price;
        }
    } else {
        for (const item of filteredProducts) {
            total += item.price;
        }
    }
    
    return roundOffTwoDecimalPlaces(total);
};

/**
 * We will bundle in a free 1 GB Data-pack free-of-charge with every Unlimited 2GB sold.
*/
const free1GBDataPackForEvery2GB = (items) => {
    let total = 0;

    const filteredProducts = getFilteredProducts('ult_medium', items);

    const oneGB = products.find(item => item.productCode === '1gb');

    for (const item of filteredProducts) {
        total += item.price;

        items.push({
            ...oneGB,
            price: 0,
        });
    }

    return total;
};

// No rules
const oneGBDataPackRule = (items) => {
    let total = 0;

    const filteredProducts = getFilteredProducts('1gb', items);

    for (const item of filteredProducts) {
        total += item.price;
    }

    return total;
};

export default (items) => {
    let total = 0;

    total += threeForTwoUnlimited1GBSims(items);
    total += unlimited5GBSimBulkDiscount(items);
    total += free1GBDataPackForEvery2GB(items);
    total += oneGBDataPackRule(items);

    return roundOffTwoDecimalPlaces(total);
};
