import { roundOffTwoDecimalPlaces } from "./utilities.js";
import promoCodes from "./promo-codes.js";

let promoCodeApplied = null;

export default class ShoppingCart {

    constructor(pricingRules = null) {
        this.pricingRules = pricingRules;
    };

    items = [];

    get total () {
        let output = 0;

        for (const item of this.items) {
            output += item.price;
        }

        if (this.isPricingRulesApplicable()) {
            output = this.applyPricingRules();
        }

        if (promoCodeApplied) {
            return this.applyPromo(promoCodeApplied, output);
        }

        return output;
    };

    add(item, promoCode = null) {
        this.items.push(item);

        if (promoCode) {
            this.setPromoCode(promoCode);
        }
    };

    setPromoCode(promoCode) {
        promoCodeApplied = this.validatePromoCode(promoCode);
    };

    validatePromoCode(promoCode) {
        const foundPromoCode = promoCodes.find(item => item.name === promoCode);

        if (!foundPromoCode) {
            return false;
        }

        return foundPromoCode;
    };

    applyPromo(promoCode, total) {
        return roundOffTwoDecimalPlaces(total - (total * promoCode.discount));
    };

    isPricingRulesApplicable() {
        return this.pricingRules !== null && typeof this.pricingRules === 'function';
    };

    applyPricingRules() {
        return this.pricingRules(this.items);
    };
}
