"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManager = exports.AssetNames = void 0;
var PIXI = require("pixi.js");
var _ = require("lodash");
var AssetNames = (function () {
    function AssetNames() {
    }
    AssetNames.BACK_BUTTON = "backNavButton@2x.png";
    AssetNames.CARD_BACK = "allCardBacks@2x.png";
    AssetNames.CARD_TYPES = {
        BAT: "memoryBatCardFront@2x.png",
        CAT: "memoryCatCardFront@2x.png",
        COW: "memoryCowFront@2x.png",
        DRAGON: "memoryDragonCardFront@2x.png",
        GARBAGE_MAN: "memoryGarbageManCardFront@2x.png",
        GHOST_DOG: "memoryGhostDogCardFront@2x.png",
        HEN: "memoryHenCardFront@2x.png",
        HORSE: "memoryHorseCardFront@2x.png",
        PIG: "memoryPigCardFront@2x.png",
        SPIDER: "memorySpiderCardFront@2x.png",
    };
    return AssetNames;
}());
exports.AssetNames = AssetNames;
var AssetManager = (function () {
    function AssetManager() {
    }
    AssetManager.LoadAssets = function () {
        var image_loader = AssetManager._image_loader = new PIXI.Loader(AssetManager.IMAGE_DIR);
        image_loader.add(AssetNames.BACK_BUTTON);
        image_loader.add(AssetNames.CARD_BACK);
        image_loader.add(_.values(AssetNames.CARD_TYPES));
        return new Promise(function (resolve) {
            image_loader.load(function () {
                resolve();
            });
        });
    };
    AssetManager.GetCard = function (card_name) {
        var asset = AssetNames.CARD_TYPES[card_name];
        var texture = this._image_loader.resources[asset].texture;
        return PIXI.Sprite.from(texture);
    };
    AssetManager.GetSprite = function (asset_name) {
        var texture = this._image_loader.resources[asset_name].texture;
        return PIXI.Sprite.from(texture);
    };
    AssetManager.IMAGE_DIR = "./assets/images/";
    return AssetManager;
}());
exports.AssetManager = AssetManager;
