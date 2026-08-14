export declare enum StaffRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    REGIONAL_MANAGER = "REGIONAL_MANAGER",
    STORE_MANAGER = "STORE_MANAGER",
    CASHIER = "CASHIER",
    CASH_OFFICER = "CASH_OFFICER",
    INVENTORY_STAFF = "INVENTORY_STAFF",
    WAREHOUSE_STAFF = "WAREHOUSE_STAFF",
    PURCHASE_TEAM = "PURCHASE_TEAM",
    AUDITOR = "AUDITOR"
}
export declare enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    UPI = "UPI"
}
export interface DenominationBreakdown {
    r2000: number;
    r500: number;
    r200: number;
    r100: number;
    r50: number;
    r20: number;
    r10: number;
    r5: number;
    r2: number;
    r1: number;
}
export interface UserSessionDto {
    staffId: string;
    name: string;
    role: StaffRole;
    mustChangePassword: boolean;
    storeId: string;
}
export interface CartItemDto {
    productId: string;
    barcode: string;
    name: string;
    quantity: number;
    pricePaise: number;
    discountPaise: number;
    taxRatePercent: number;
    taxPaise: number;
    totalPaise: number;
}
export interface POSSalePayload {
    cashierSessionId: string;
    paymentMethod: PaymentMethod;
    items: CartItemDto[];
    amountPaidPaise: number;
    totalDiscountPaise: number;
    totalTaxPaise: number;
    totalPricePaise: number;
}
export interface POSReturnPayload {
    originalSaleId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
    refundMethod: PaymentMethod;
    refundAmountPaise: number;
}
export interface DayClosePayload {
    cashierSessionId: string;
    actualDenominations: DenominationBreakdown;
    actualUpiPaise: number;
    actualCardPaise: number;
    remarks?: string;
}
export interface CashOfficerHandoverPayload {
    registerCloseId: string;
    verifiedDenominations: DenominationBreakdown;
    status: 'MATCHED' | 'SHORT' | 'EXCESS';
    remarks?: string;
}
export interface ManagerCashReportPayload {
    date: string;
    posRegisterId: string;
    cashOfficerId: string;
    enteredDenominations: DenominationBreakdown;
    enteredUpiPaise: number;
    enteredCardPaise: number;
    bnaReportedPaise: number;
    remarks?: string;
}
