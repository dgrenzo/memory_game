"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = void 0;
var AssetManager = (function () {
    function AssetManager() {
    }
    AssetManager.LoadAssets = function () {
        return Promise.resolve();
    };
    AssetManager._loaded = false;
    return AssetManager;
}());
exports.AssetManager = AssetManager;
