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

        const clonedUltSmall = { ...ultSmall };
        const clonedUltLarge = { ...ultLarge };
        
        cart.add(clonedUltSmall);
        cart.add(clonedUltSmall);
        cart.add(clonedUltSmall);

        cart.add(clonedUltLarge);

        assert.equal(cart.total, 94.70);

        assert.deepEqual(cart.items, [clonedUltSmall, clonedUltSmall, clonedUltSmall, clonedUltLarge]);
    });

    it('Should run Scenario 2 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        const clonedUltSmall = { ...ultSmall };
        const clonedUltLarge = { ...ultLarge };

        cart.add(clonedUltSmall);
        cart.add(clonedUltSmall);
    
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);

        assert.equal(cart.total, 209.40);

        assert.deepEqual(cart.items,
            [
                clonedUltSmall, clonedUltSmall,

                { ...clonedUltLarge, price: 39.90 }, { ...clonedUltLarge, price: 39.90 },
                
                { ...clonedUltLarge, price: 39.90 }, { ...clonedUltLarge, price: 39.90 },
            ]
        );
    });

    it('Should run Scenario 3 Successfully', () => {
        const cart = new ShoppingCart(pricingRules);

        const clonedUltSmall = { ...ultSmall };
        const clonedUltMedium = { ...ultMedium };

        cart.add(clonedUltSmall);

        cart.add(clonedUltMedium);
        cart.add(clonedUltMedium);

        assert.equal(cart.total, 84.70);

        assert.deepEqual(cart.items,
            [
                clonedUltSmall, clonedUltMedium, clonedUltMedium,

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

        const clonedUltSmall = { ...ultSmall };
        const clonedOneGBDataPack = { ...oneGBDataPack };

        cart.add(clonedUltSmall, PROMO_CODE);
        cart.add(clonedOneGBDataPack);

        assert.equal(cart.total, 31.32);

        assert.deepEqual(cart.items, [clonedUltSmall, clonedOneGBDataPack]);
    });

    it('Should expect total to be zero and items empty if no items added', () => {
        const cart = new ShoppingCart();

        assert.equal(cart.total, 0);

        assert.deepEqual(cart.items, []);
    });

    it('Should not apply discount if promo code is invalid on Scenario 4', () => {
        const cart = new ShoppingCart(pricingRules);

        const clonedUltSmall = { ...ultSmall };
        const clonedOneGBDataPack = { ...oneGBDataPack };

        cart.add(clonedUltSmall, 'I AM VENGEANCE');
        cart.add(clonedOneGBDataPack);

        assert.equal(cart.total, 34.80);

        assert.deepEqual(cart.items, [clonedUltSmall, clonedOneGBDataPack]);
    });

    it('Should run Scenario 2 Successfully without Pricing Rules', () => {
        const cart = new ShoppingCart();

        const clonedUltSmall = { ...ultSmall };
        const clonedUltLarge = { ...ultLarge };

        cart.add(clonedUltSmall);
        cart.add(clonedUltSmall);
    
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);
        cart.add(clonedUltLarge);

        assert.equal(cart.total, 229.40);

        assert.deepEqual(cart.items,
            [
                clonedUltSmall, clonedUltSmall,
                
                clonedUltLarge, clonedUltLarge, clonedUltLarge, clonedUltLarge
            ]
        );
    });

    it('Should only apply promo code once without pricing rules', () => {
        const cart = new ShoppingCart();

        const clonedUltLarge = { ...ultLarge };

        // X5
        cart.add(clonedUltLarge, PROMO_CODE);
        cart.add(clonedUltLarge, PROMO_CODE);
        cart.add(clonedUltLarge, PROMO_CODE);
        cart.add(clonedUltLarge, PROMO_CODE);
        cart.add(clonedUltLarge, PROMO_CODE);

        assert.equal(cart.total, 202.05);

        assert.deepEqual(cart.items, [
            clonedUltLarge,
            clonedUltLarge,
            clonedUltLarge,
            clonedUltLarge,
            clonedUltLarge,
        ])
    });
});
