"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSelectButton = void 0;
var PIXI = require("pixi.js");
var GameSelectButton = (function (_super) {
    __extends(GameSelectButton, _super);
    function GameSelectButton(label_text) {
        var _this = _super.call(this) || this;
        var graphic = new PIXI.Graphics()
            .beginFill(0x008ec0)
            .lineStyle(6, 0x00efff)
            .drawRoundedRect(-100, -30, 200, 60, 25);
        _this.addChild(graphic);
        var label = new PIXI.Text(label_text, {
            fill: 0xFFFFFF,
            fontSize: 38,
        });
        label.anchor.set(0.5);
        _this.addChild(label);
        _this.buttonMode = _this.interactive = true;
        return _this;
    }
    return GameSelectButton;
}(PIXI.Sprite));
exports.GameSelectButton = GameSelectButton;
