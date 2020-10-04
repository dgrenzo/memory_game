"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
var _ = require("lodash");
var pixi_js_1 = require("pixi.js");
var FSM_1 = require("../engine/FSM");
var Card_1 = require("./card/Card");
var types_1 = require("./card/types");
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["SETUP"] = 1] = "SETUP";
    GAME_STATE[GAME_STATE["PLAY"] = 2] = "PLAY";
    GAME_STATE[GAME_STATE["MATCHING"] = 3] = "MATCHING";
    GAME_STATE[GAME_STATE["COMPLETE"] = 4] = "COMPLETE";
})(GAME_STATE || (GAME_STATE = {}));
var GameController = (function () {
    function GameController(m_pixi_app, m_config) {
        var _this = this;
        this.m_pixi_app = m_pixi_app;
        this.m_config = m_config;
        this.m_fsm = new FSM_1.FSM();
        this.onCardClicked = function (card) {
            if (!_this.m_match_first) {
                _this.m_match_first = card;
            }
            else {
                _this.m_match_second = card;
            }
            card.showCard().then(function () {
                if (_this.m_match_first && _this.m_match_second) {
                    _this.matchCards(_this.m_match_first, _this.m_match_second);
                }
            });
        };
        this.matchCards = function (first, second) {
            if (first && second) {
                _this.m_fsm.setState(GAME_STATE.MATCHING);
                if (first.type === second.type) {
                    _this.m_fsm.setState(GAME_STATE.PLAY);
                }
                else {
                    setTimeout(function () {
                        first.hideCard();
                        second.hideCard();
                        _this.m_fsm.setState(GAME_STATE.PLAY);
                    }, 600);
                }
            }
        };
        this.getCardPosition = function (index) {
            var x = index % _this.m_config.dimensions.width;
            var y = Math.floor(index / _this.m_config.dimensions.width);
            return {
                x: x * 175,
                y: y * 225,
            };
        };
        this.m_fsm.registerState(GAME_STATE.SETUP, {
            enter: function () {
                _this.m_container = new pixi_js_1.Container();
                _this.m_container.interactive = _this.m_container.interactiveChildren = false;
                _this.m_container.scale.set(0.75);
                _this.m_pixi_app.stage.addChild(_this.m_container);
                _this.initCards(_this.m_config.dimensions);
                _this.m_fsm.setState(GAME_STATE.PLAY);
            }
        });
        this.m_fsm.registerState(GAME_STATE.PLAY, {
            enter: function () {
                _this.m_container.interactive = _this.m_container.interactiveChildren = true;
                _this.m_match_first = null;
                _this.m_match_second = null;
            },
            exit: function () {
                _this.m_container.interactive = _this.m_container.interactiveChildren = false;
            }
        });
        this.m_fsm.registerState(GAME_STATE.MATCHING, {
            enter: function () {
            }
        });
        this.m_fsm.setState(GAME_STATE.SETUP);
    }
    GameController.prototype.initCards = function (dimensions) {
        var _this = this;
        var total_card_count = dimensions.width * dimensions.height;
        var card_type_count = total_card_count / 2;
        var card_types = GetRandomCardTypes(card_type_count);
        card_types = _.shuffle(_.concat(card_types, card_types));
        this.m_cards = [];
        _.forEach(card_types, function (type, index) {
            var card = new Card_1.Card(type);
            card.onClick = _this.onCardClicked;
            _this.m_cards.push(card);
            card.addToStage(_this.m_container);
            var pos = _this.getCardPosition(index);
            card.setPosition(pos);
        });
    };
    return GameController;
}());
exports.GameController = GameController;
function GetRandomCardTypes(count) {
    var card_types = _.shuffle(Object.values(types_1.CARD_NAME));
    return card_types.slice(0, count);
}
