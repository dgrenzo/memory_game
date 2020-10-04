import * as _ from 'lodash';
import { Container, Quad } from 'pixi.js';

import { FSM } from "../engine/FSM";
import { Vector2 } from '../engine/types';
import { Card } from "./card/Card";
import { CARD_NAME } from "./card/types";

export type GameConfig = {
  dimensions : {
    width : number,
    height : number,
  }
}

enum GAME_STATE {
  SETUP = 1,
  PLAY,
  MATCHING,
  COMPLETE,
}

export class GameController {

  private m_container : PIXI.Container;

  private m_fsm : FSM<GAME_STATE> = new FSM();
  private m_cards : Card[];

  private m_match_first : Card;
  private m_match_second : Card;

  constructor (private m_pixi_app : PIXI.Application, private m_config : GameConfig) {

    this.m_fsm.registerState(GAME_STATE.SETUP, {
      enter : () => {
        this.m_container = new Container();
        
        this.m_container.position.set(400, 325);

        this.m_container.interactive = this.m_container.interactiveChildren = false;
        this.m_container.scale.set(0.55);
        this.m_pixi_app.stage.addChild(this.m_container);

        this.initCards(this.m_config.dimensions);

        this.m_fsm.setState(GAME_STATE.PLAY);
      }
    });

    this.m_fsm.registerState(GAME_STATE.PLAY, {
      enter : () => {
        this.m_container.interactive = this.m_container.interactiveChildren = true;
        this.m_match_first = null;
        this.m_match_second = null;
      },

      exit : () => {
        this.m_container.interactive = this.m_container.interactiveChildren = false;
      }
    });

    this.m_fsm.registerState(GAME_STATE.MATCHING, {
    });

    this.m_fsm.registerState(GAME_STATE.COMPLETE, {
      enter : () => {
        this.m_pixi_app.renderer.clearBeforeRender = false;

        _.forEach(this.m_cards, (card, index)  => {
          setTimeout(card.doCelebration, 300 + index * 150); 
        })

      },
      update : () => {
        _.forEach(this.m_cards, card => {
          card.update();
        })
      }
    })

    this.m_fsm.setState(GAME_STATE.SETUP);
  }

  public update = (deltaTime : number = 0) => {
    this.m_fsm.update(deltaTime);
  }

  private onCardClicked = (card : Card) => {

    if (!this.m_match_first) {
      this.m_match_first = card;
      card.showCard();

    } else if (!this.m_match_second) {
      this.m_match_second = card;
      card.showCard().then( () => {
        this.matchCards(this.m_match_first, this.m_match_second);
      })
    }
  }

  private matchCards = (first : Card, second : Card) => {
    if (first && second) {
      this.m_fsm.setState(GAME_STATE.MATCHING);

      if (first.type === second.type) {
        first.setMatched();
        second.setMatched();
        
        if (this.checkComplete()) {
          this.m_fsm.setState(GAME_STATE.COMPLETE);
        } else { 
          
          this.m_fsm.setState(GAME_STATE.PLAY);
        }

      } else {
        setTimeout( () => {
          Promise.all([
            first.hideCard(),
            second.hideCard()
          ]).then(() =>{
            this.m_fsm.setState(GAME_STATE.PLAY);
          });
        }, 1000);
      }
    }
  }

  private checkComplete() : boolean {
    let complete = true;
    _.forEach(this.m_cards, (card) => {
      return complete = card.isMatched();
    });
    return complete;
  }

  private initCards(dimensions : {width : number, height : number}) {

    let total_card_count = dimensions.width * dimensions.height;
    let card_type_count = total_card_count / 2;

    //get the random card types to be used in the matching game
    let card_types : CARD_NAME[] = GetRandomCardTypes(card_type_count);

    //duplicate the entries in card_types and shuffle it
    card_types = _.shuffle(_.concat(card_types, card_types));


    this.m_cards = [];
    _.forEach(card_types, (type : CARD_NAME, index : number) => {
      let card = new Card(type);
      card.onClick = this.onCardClicked;
      this.m_cards.push(card);

      card.addToStage(this.m_container)
      let pos = this.getCardPosition(index);
      card.setPosition(pos);
      
    });
  }

  private getCardPosition = (index : number) : Vector2 => {
    let x = index % this.m_config.dimensions.width;
    let y = Math.floor(index / this.m_config.dimensions.width);


    return {
      x : (x + 0.5 - this.m_config.dimensions.width / 2) * 175,
      y : (y + 0.5 - this.m_config.dimensions.height / 2) * 235,
    }
  }
}

function GetRandomCardTypes(count : number) : CARD_NAME[]{
  //randomize the list of card types
  let card_types : CARD_NAME[] =  _.shuffle(Object.values(CARD_NAME)); 
  //return the specified count
  return card_types.slice(0, count); 
}