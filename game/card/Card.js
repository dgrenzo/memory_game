"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var PIXI = require("pixi.js");
var TWEEN = require("@tweenjs/tween.js");
var AssetManager_1 = require("../assets/AssetManager");
var FSM_1 = require("../../engine/FSM");
var tween_js_1 = require("@tweenjs/tween.js");
var CARD_STATE;
(function (CARD_STATE) {
    CARD_STATE[CARD_STATE["FACEDOWN"] = 1] = "FACEDOWN";
    CARD_STATE[CARD_STATE["MATCHING"] = 2] = "MATCHING";
    CARD_STATE[CARD_STATE["MATCHED"] = 3] = "MATCHED";
    CARD_STATE[CARD_STATE["CELEBRATE"] = 4] = "CELEBRATE";
})(CARD_STATE || (CARD_STATE = {}));
var Card = (function () {
    function Card(type) {
        var _this = this;
        this.type = type;
        this.m_fsm = new FSM_1.FSM();
        this.update = function (deltaTime) {
            if (deltaTime === void 0) { deltaTime = 0; }
            _this.m_fsm.update(deltaTime);
        };
        this.addToStage = function (stage) {
            stage.addChild(_this.m_root);
        };
        this.setPosition = function (pos) {
            _this.m_root.position.set(pos.x, pos.y);
        };
        this.doCelebration = function () {
            _this.m_fsm.setState(CARD_STATE.CELEBRATE);
        };
        this.showCard = function () {
            if (_this.m_fsm.state === CARD_STATE.FACEDOWN) {
                _this.m_fsm.setState(CARD_STATE.MATCHING);
                return _this.animateFlip(true);
            }
            return Promise.resolve();
        };
        this.hideCard = function (skip_animation) {
            if (skip_animation === void 0) { skip_animation = false; }
            if (_this.m_fsm.state !== CARD_STATE.FACEDOWN) {
                _this.m_fsm.setState(CARD_STATE.FACEDOWN);
                if (!skip_animation) {
                    return _this.animateFlip(false);
                }
            }
            _this.m_card_front.visible = false;
            return Promise.resolve();
        };
        this.animateFlip = function (show_face) {
            new tween_js_1.Tween(_this.m_card_container.position)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .to({ y: -35, x: Math.random() * 200 - 100 }, 175)
                .onComplete(function () {
                new tween_js_1.Tween(_this.m_card_container.position)
                    .easing(TWEEN.Easing.Sinusoidal.Out)
                    .to({ y: 0, x: 0 }, 125)
                    .start(Date.now());
            })
                .start(Date.now());
            return new Promise(function (resolve) {
                new tween_js_1.Tween(_this.m_root.scale)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .to({ x: 0 }, 175)
                    .onComplete(function () {
                    _this.m_card_front.visible = show_face;
                    new tween_js_1.Tween(_this.m_root.scale)
                        .easing(TWEEN.Easing.Sinusoidal.Out)
                        .to({ x: 1 }, 125)
                        .onComplete(resolve)
                        .start(Date.now());
                })
                    .start(Date.now());
            });
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
        this.m_card_container = new PIXI.Container();
        this.m_root.addChild(this.m_card_container);
        this.m_card_container.addChild(this.m_card_back = AssetManager_1.AssetManager.GetSprite(AssetManager_1.AssetNames.CARD_BACK));
        this.m_card_container.addChild(this.m_card_front = AssetManager_1.AssetManager.GetCard(type));
        this.m_card_back.anchor.set(0.5);
        this.m_card_front.anchor.set(0.5);
        this.m_root.on("click", this.clicked);
        this.m_fsm.registerState(CARD_STATE.FACEDOWN, {
            enter: function () {
                _this.m_root.interactive = _this.m_root.buttonMode = true;
            },
            exit: function () {
                _this.m_root.interactive = _this.m_root.buttonMode = false;
            }
        });
        this.m_fsm.registerState(CARD_STATE.MATCHING, {});
        this.m_fsm.registerState(CARD_STATE.MATCHED, {});
        this.m_fsm.registerState(CARD_STATE.CELEBRATE, {
            enter: function () {
                _this._velocity = {
                    y: Math.random() * -10 - 15,
                    x: Math.random() * 30 - 10,
                };
            },
            update: function () {
                _this._velocity.y += 0.8;
                _this.m_root.position.x += _this._velocity.x;
                _this.m_root.position.y += _this._velocity.y;
                if (_this.m_root.position.y >= 500) {
                    _this.m_root.y = 500;
                    _this._velocity.x *= 0.98;
                    _this._velocity.y *= -0.95;
                }
                if (_this.m_root.position.x < -650) {
                    _this.m_root.position.x = -650;
                    _this._velocity.x *= -1;
                }
                if (_this.m_root.position.x > 650) {
                    _this.m_root.position.x = 650;
                    _this._velocity.x *= -1;
                }
            }
        });
        this.hideCard(true);
    }
    Card.prototype.setMatched = function () {
        this.m_fsm.setState(CARD_STATE.MATCHED);
    };
    return Card;
}());
exports.Card = Card;
