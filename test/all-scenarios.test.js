import pricingRules from '../src/pricing-rules.js';
import ShoppingCart from '../src/shopping-cart.js';
import products from '../src/products.js';

import { assert } from 'chai';

const PROMO_CODE = 'I<3AMAYSIM';

const ultSmall = products.find(item => item.productCode === 'ult_small');
const ultMedium = products.find(item => item.productCode === 'ult_medium');
const ultLarge = products.find(item => item.productCode === 'ult_large');
const oneGBDataPack = products.find(item => item.productCode === '1gb');

describe('Test all scenarios', () => {

    it('Should run Scenario 1 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        cart.add(ultSmall);
        cart.add(ultSmall);
        cart.add(ultSmall);

        cart.add(ultLarge);

        assert.equal(cart.total, 94.70);

        assert.deepEqual(cart.items, [ultSmall, ultSmall, ultSmall, ultLarge]);
    });

    it('Should run Scenario 2 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        cart.add(ultSmall);
        cart.add(ultSmall);
    
        cart.add(ultLarge);
        cart.add(ultLarge);
        cart.add(ultLarge);
        cart.add(ultLarge);

        assert.equal(cart.total, 209.40);

        assert.deepEqual(cart.items,
            [
                ultSmall, ultSmall,

                { ...ultLarge, price: 39.90 }, { ...ultLarge, price: 39.90 },
                
                { ...ultLarge, price: 39.90 }, { ...ultLarge, price: 39.90 },
            ]
        );
    });

    it('Should run Scenario 3 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        cart.add(ultSmall);

        cart.add(ultMedium);
        cart.add(ultMedium);

        assert.equal(cart.total, 84.70);

        assert.deepEqual(cart.items,
            [
                ultSmall, ultMedium, ultMedium,

                {
                    ...oneGBDataPack,
                    price: 0,
                },

                {
                    ...oneGBDataPack,
                    price: 0,
                }
            ]
        );
    });

    it('Should run Scenario 4 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        cart.add(ultSmall, PROMO_CODE);
        cart.add(oneGBDataPack);

        assert.equal(cart.total, 31.32);

        assert.deepEqual(cart.items, [ultSmall, oneGBDataPack]);
    });
});
