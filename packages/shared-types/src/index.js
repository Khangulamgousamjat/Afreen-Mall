"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.StaffRole = void 0;
var StaffRole;
(function (StaffRole) {
    StaffRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    StaffRole["REGIONAL_MANAGER"] = "REGIONAL_MANAGER";
    StaffRole["STORE_MANAGER"] = "STORE_MANAGER";
    StaffRole["CASHIER"] = "CASHIER";
    StaffRole["CASH_OFFICER"] = "CASH_OFFICER";
    StaffRole["INVENTORY_STAFF"] = "INVENTORY_STAFF";
    StaffRole["WAREHOUSE_STAFF"] = "WAREHOUSE_STAFF";
    StaffRole["PURCHASE_TEAM"] = "PURCHASE_TEAM";
    StaffRole["AUDITOR"] = "AUDITOR";
})(StaffRole || (exports.StaffRole = StaffRole = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["UPI"] = "UPI";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=index.js.map