"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var PIXI = require("pixi.js");
var AssetManager_1 = require("../assets/AssetManager");
var FSM_1 = require("../../engine/FSM");
var CARD_STATE;
(function (CARD_STATE) {
    CARD_STATE[CARD_STATE["FACEDOWN"] = 1] = "FACEDOWN";
    CARD_STATE[CARD_STATE["MATCHING"] = 2] = "MATCHING";
    CARD_STATE[CARD_STATE["MATCHED"] = 3] = "MATCHED";
})(CARD_STATE || (CARD_STATE = {}));
var Card = (function () {
    function Card(type) {
        var _this = this;
        this.type = type;
        this.m_fsm = new FSM_1.FSM();
        this.addToStage = function (stage) {
            stage.addChild(_this.m_root);
        };
        this.setPosition = function (pos) {
            _this.m_root.position.set(pos.x, pos.y);
        };
        this.showCard = function () {
            _this.m_fsm.setState(CARD_STATE.MATCHING);
            return Promise.resolve();
        };
        this.hideCard = function () {
            _this.m_fsm.setState(CARD_STATE.FACEDOWN);
            return Promise.resolve();
        };
        this.isFaceDown = function () {
            return _this.m_fsm.state === CARD_STATE.FACEDOWN;
        };
        this.isMatched = function () {
            return _this.m_fsm.state === CARD_STATE.MATCHED;
        };
        this.clicked = function (evt) {
            if (_this.onClick) {
                _this.onClick(_this);
            }
        };
        this.m_root = new PIXI.Sprite();
        this.m_root.addChild(this.m_card_back = AssetManager_1.AssetManager.GetSprite(AssetManager_1.AssetNames.CARD_BACK));
        this.m_root.addChild(this.m_card_front = AssetManager_1.AssetManager.GetCard(type));
        this.m_root.on("click", this.clicked);
        this.m_fsm.registerState(CARD_STATE.FACEDOWN, {
            enter: function () {
                _this.m_root.interactive = _this.m_root.buttonMode = true;
                _this.m_card_front.visible = false;
            },
            exit: function () {
                _this.m_root.interactive = _this.m_root.buttonMode = false;
            }
        });
        this.m_fsm.registerState(CARD_STATE.MATCHING, {
            enter: function () {
                _this.m_card_front.visible = true;
            }
        });
        this.m_fsm.registerState(CARD_STATE.MATCHED, {
            enter: function () {
                _this.m_card_front.visible = true;
            }
        });
        this.hideCard();
    }
    return Card;
}());
exports.Card = Card;
