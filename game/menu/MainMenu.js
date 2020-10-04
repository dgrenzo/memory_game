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
exports.MainMenu = void 0;
var PIXI = require("pixi.js");
var _ = require("lodash");
var GameSelectButton_1 = require("./GameSelectButton");
var MENU_OPTIONS = [
    {
        dimensions: {
            width: 3,
            height: 4,
        }
    },
    {
        dimensions: {
            width: 5,
            height: 2,
        }
    },
    {
        dimensions: {
            width: 4,
            height: 4,
        }
    },
    {
        dimensions: {
            width: 4,
            height: 5,
        }
    }
];
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(onSelectOption) {
        var _this = _super.call(this) || this;
        var header = new PIXI.Text("Memory Game", {
            fontSize: 84,
            fill: 0xFFFFFF,
        });
        header.anchor.set(0.5);
        header.position.set(400, 150);
        _this.addChild(header);
        _.forEach(MENU_OPTIONS, function (option, index) {
            var label = option.dimensions.width + 'x' + option.dimensions.height;
            var btn = new GameSelectButton_1.GameSelectButton(label);
            btn.position.set(400, 300 + index * 90);
            _this.addChild(btn);
            btn.on('click', function () {
                onSelectOption(option);
            });
        });
        return _this;
    }
    return MainMenu;
}(PIXI.Sprite));
exports.MainMenu = MainMenu;
