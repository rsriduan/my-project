import { describe, it, expect } from 'vitest';
import {
  calculateTotalProductionCost,
  calculateResellerProfit,
  calculateWholesalePricing,
  ProductPricing,
  CostingBreakdown,
} from '../pricing-engine';

describe('DELIED Pricing Engine & ERP Costing Tests', () => {
  it('correctly calculates total production cost based on PRD formula', () => {
    const costing: CostingBreakdown = {
      fabricCost: 350,
      accessoriesCost: 50,
      printingCost: 40,
      labelCost: 15,
      packagingCost: 45,
      labourCost: 120,
      overheadCost: 35,
      otherCost: 10,
    };

    const totalCost = calculateTotalProductionCost(costing);
    expect(totalCost).toBe(665);
  });

  it('calculates reseller profit and prevents unauthorized low price below base reseller price', () => {
    const pricing: ProductPricing = {
      regularPrice: 2850,
      discountPrice: 2450,
      resellerPrice: 1950,
      suggestedRetailPrice: 2450,
      wholesalePrice: 1750,
      minWholesaleQty: 25,
      productionCost: 1300,
    };

    // Valid price
    const validCalc = calculateResellerProfit(pricing, 2450, 2);
    expect(validCalc.isValidPrice).toBe(true);
    expect(validCalc.resellerProfitPerUnit).toBe(500); // 2450 - 1950
    expect(validCalc.companyGrossProfit).toBe(1300); // (1950 - 1300) * 2

    // Invalid: price lower than base reseller price
    const invalidCalc = calculateResellerProfit(pricing, 1800, 1);
    expect(invalidCalc.isValidPrice).toBe(false);
    expect(invalidCalc.validationError).toBeDefined();

    // Invalid: price above maximum permitted ceiling (130% of 2450 = 3185)
    const tooHighCalc = calculateResellerProfit(pricing, 3500, 1);
    expect(tooHighCalc.isValidPrice).toBe(false);
  });

  it('enforces wholesale minimum order quantity (MOQ) and computes tier discounts', () => {
    const pricing: ProductPricing = {
      regularPrice: 2850,
      discountPrice: 2450,
      resellerPrice: 1950,
      suggestedRetailPrice: 2450,
      wholesalePrice: 1750,
      minWholesaleQty: 25,
      productionCost: 1300,
    };

    // Fails MOQ
    const underMoq = calculateWholesalePricing(pricing, 15, 'TIER_1');
    expect(underMoq.isMoqSatisfied).toBe(false);
    expect(underMoq.validationError).toContain('Minimum order quantity for wholesale is 25');

    // Satisfies MOQ
    const validBulk = calculateWholesalePricing(pricing, 50, 'TIER_2');
    expect(validBulk.isMoqSatisfied).toBe(true);
    expect(validBulk.tierDiscountPercent).toBe(3); // 3% extra for Tier 2
    expect(validBulk.effectiveUnitPrice).toBe(1698); // 1750 * 0.97 = 1697.5 rounded to 1698
    expect(validBulk.totalWholesaleAmount).toBe(1698 * 50);
    expect(validBulk.savingsComparedToRetail).toBeGreaterThan(0);
  });
});
