"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialDesignConfig = exports.CustomFont = exports.PdfTable = void 0;
// Export the table class
var Table_1 = require("./classes/Table");
Object.defineProperty(exports, "PdfTable", { enumerable: true, get: function () { return Table_1.PdfTable; } });
__exportStar(require("./config/DesignConfig"), exports);
var CustomFont_1 = require("./models/CustomFont");
Object.defineProperty(exports, "CustomFont", { enumerable: true, get: function () { return CustomFont_1.CustomFont; } });
var DesignConfig_1 = require("./config/DesignConfig");
Object.defineProperty(exports, "materialDesignConfig", { enumerable: true, get: function () { return DesignConfig_1.materialDesignConfig; } });
