import * as PIXI from 'pixi.js'
import { AssetManager, AssetNames } from '../assets/AssetManager';
import { CARD_NAME } from './types'
import { FSM } from '../../engine/FSM'
import { Vector2 } from '../../engine/types';
import { entries } from 'lodash';

enum CARD_STATE {
  FACEDOWN = 1,
  MATCHING,
  MATCHED,
}


export class Card {

  private m_fsm : FSM<CARD_STATE> = new FSM();

  private m_root : PIXI.Sprite;
  private m_card_back : PIXI.Sprite;
  private m_card_front : PIXI.Sprite;

  public onClick : (card : Card) => void;

  constructor (public readonly type : CARD_NAME) {

    this.m_root = new PIXI.Sprite();
    this.m_root.addChild(this.m_card_back = AssetManager.GetSprite(AssetNames.CARD_BACK));
    this.m_root.addChild(this.m_card_front = AssetManager.GetCard(type));

    this.m_root.on("click", this.clicked);

    this.m_fsm.registerState(CARD_STATE.FACEDOWN, {
      enter : () => {
        this.m_root.interactive = this.m_root.buttonMode = true;
        this.m_card_front.visible = false;
      },
      exit : () => {
        this.m_root.interactive = this.m_root.buttonMode = false;
      }
    });

    this.m_fsm.registerState(CARD_STATE.MATCHING, {
      enter : () => {
        this.m_card_front.visible = true;
      }
    })

    this.m_fsm.registerState(CARD_STATE.MATCHED, {
      enter : () => {
        this.m_card_front.visible = true;
      }
    });

    this.hideCard();
  }


  public addToStage = (stage : PIXI.Container) => {
    stage.addChild(this.m_root);
  }

  public setPosition = (pos : Vector2) => {
    this.m_root.position.set(pos.x, pos.y);
  }

  public showCard = () : Promise<void> => {
   // if (this.m_fsm.state === CARD_STATE.FACEDOWN) {
      this.m_fsm.setState(CARD_STATE.MATCHING);
 //   }
    return Promise.resolve();
  }

  public hideCard = () : Promise<void> => {
    this.m_fsm.setState(CARD_STATE.FACEDOWN);
    return Promise.resolve();
  }



  public isFaceDown = () : boolean => {
    return this.m_fsm.state === CARD_STATE.FACEDOWN;
  }
  
  public isMatched = () : boolean => {
    return this.m_fsm.state === CARD_STATE.MATCHED;
  }

  private clicked = (evt : PIXI.interaction.InteractionEvent) => {
    if (this.onClick) {
      this.onClick(this);
    }
  }
    
}