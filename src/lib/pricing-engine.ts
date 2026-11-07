export interface ProductPricing {
  regularPrice: number;
  discountPrice?: number | null;
  resellerPrice: number;
  suggestedRetailPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  productionCost: number;
}

export interface ResellerProfitCalc {
  baseResellerPrice: number;
  customSellingPrice: number;
  suggestedRetailPrice: number;
  resellerProfitPerUnit: number;
  resellerMarginPercentage: number;
  companyGrossProfit: number;
  isValidPrice: boolean;
  validationError?: string;
}

export interface WholesaleBulkPricing {
  baseWholesalePrice: number;
  quantity: number;
  minOrderQty: number;
  tier: string;
  tierDiscountPercent: number;
  effectiveUnitPrice: number;
  totalWholesaleAmount: number;
  savingsComparedToRetail: number;
  isMoqSatisfied: boolean;
  validationError?: string;
}

export interface CostingBreakdown {
  fabricCost: number;
  accessoriesCost: number;
  printingCost: number;
  labelCost: number;
  packagingCost: number;
  labourCost: number;
  overheadCost: number;
  otherCost: number;
}

/**
 * Calculates total production cost according to PRD Formula:
 * Raw Materials (Fabric + Accessories) + Printing + Label + Packaging + Labour + Production Overhead + Other Costs
 */
export function calculateTotalProductionCost(costing: CostingBreakdown): number {
  const total =
    (costing.fabricCost || 0) +
    (costing.accessoriesCost || 0) +
    (costing.printingCost || 0) +
    (costing.labelCost || 0) +
    (costing.packagingCost || 0) +
    (costing.labourCost || 0) +
    (costing.overheadCost || 0) +
    (costing.otherCost || 0);
  return Number(total.toFixed(2));
}

/**
 * Reseller Pricing Validator & Profit Calculator
 * Resellers cannot sell below base reseller price, nor exceed maximum ceiling (150% of suggested price)
 */
export function calculateResellerProfit(
  pricing: ProductPricing,
  customSellingPrice: number,
  quantity = 1
): ResellerProfitCalc {
  const minAllowed = pricing.resellerPrice;
  // Permitted maximum: 130% of suggested retail price to prevent price gouging
  const maxAllowed = Math.round(pricing.suggestedRetailPrice * 1.3);

  if (customSellingPrice < minAllowed) {
    return {
      baseResellerPrice: pricing.resellerPrice,
      customSellingPrice,
      suggestedRetailPrice: pricing.suggestedRetailPrice,
      resellerProfitPerUnit: 0,
      resellerMarginPercentage: 0,
      companyGrossProfit: (pricing.resellerPrice - pricing.productionCost) * quantity,
      isValidPrice: false,
      validationError: `Selling price cannot be lower than base reseller price (৳${minAllowed.toLocaleString()})`
    };
  }

  if (customSellingPrice > maxAllowed) {
    return {
      baseResellerPrice: pricing.resellerPrice,
      customSellingPrice,
      suggestedRetailPrice: pricing.suggestedRetailPrice,
      resellerProfitPerUnit: 0,
      resellerMarginPercentage: 0,
      companyGrossProfit: 0,
      isValidPrice: false,
      validationError: `Selling price cannot exceed permitted maximum (৳${maxAllowed.toLocaleString()})`
    };
  }

  const profitPerUnit = customSellingPrice - pricing.resellerPrice;
  const marginPercentage = (profitPerUnit / customSellingPrice) * 100;
  const companyGrossProfit = (pricing.resellerPrice - pricing.productionCost) * quantity;

  return {
    baseResellerPrice: pricing.resellerPrice,
    customSellingPrice,
    suggestedRetailPrice: pricing.suggestedRetailPrice,
    resellerProfitPerUnit: Number(profitPerUnit.toFixed(2)),
    resellerMarginPercentage: Number(marginPercentage.toFixed(2)),
    companyGrossProfit: Number(companyGrossProfit.toFixed(2)),
    isValidPrice: true
  };
}

/**
 * Wholesale Tier & MOQ Pricing Engine
 */
export function calculateWholesalePricing(
  pricing: ProductPricing,
  quantity: number,
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' = 'TIER_1'
): WholesaleBulkPricing {
  const minOrderQty = pricing.minWholesaleQty || 20;

  // Additional volume discounts based on order volume:
  // Tier 1: standard wholesale price
  // Tier 2: +3% extra discount for orders >= 2x MOQ
  // Tier 3: +7% extra discount for orders >= 5x MOQ
  let tierDiscountPercent = 0;
  if (tier === 'TIER_2') tierDiscountPercent = 3.0;
  if (tier === 'TIER_3') tierDiscountPercent = 7.0;

  // Volume bonus if quantity is very large
  if (quantity >= minOrderQty * 4) {
    tierDiscountPercent += 3.0;
  }

  const discountMultiplier = (100 - tierDiscountPercent) / 100;
  const effectiveUnitPrice = Math.round(pricing.wholesalePrice * discountMultiplier);
  const totalWholesaleAmount = effectiveUnitPrice * quantity;
  const retailEquivalent = (pricing.discountPrice || pricing.regularPrice) * quantity;
  const savings = retailEquivalent - totalWholesaleAmount;

  const isMoqSatisfied = quantity >= minOrderQty;

  return {
    baseWholesalePrice: pricing.wholesalePrice,
    quantity,
    minOrderQty,
    tier,
    tierDiscountPercent,
    effectiveUnitPrice,
    totalWholesaleAmount,
    savingsComparedToRetail: Math.max(0, savings),
    isMoqSatisfied,
    validationError: isMoqSatisfied
      ? undefined
      : `Minimum order quantity for wholesale is ${minOrderQty} pieces (current: ${quantity})`
  };
}
