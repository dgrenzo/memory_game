import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js';
import { AssetManager, AssetNames } from '../assets/AssetManager';
import { CARD_NAME } from './types'
import { FSM } from '../../engine/FSM'
import { Vector2 } from '../../engine/types';
import { Tween } from '@tweenjs/tween.js';

enum CARD_STATE {
  FACEDOWN = 1,
  MATCHING,
  MATCHED,
  CELEBRATE,
}


export class Card {

  private m_fsm : FSM<CARD_STATE> = new FSM();

  private m_root : PIXI.Sprite;
  
  private m_card_container : PIXI.Container;
  private m_card_back : PIXI.Sprite;
  private m_card_front : PIXI.Sprite;

  private _velocity : Vector2;

  public onClick : (card : Card) => void;

  constructor (public readonly type : CARD_NAME) {

    this.m_root = new PIXI.Sprite();

    this.m_card_container = new PIXI.Container();
    this.m_root.addChild(this.m_card_container);

    this.m_card_container.addChild(this.m_card_back = AssetManager.GetSprite(AssetNames.CARD_BACK));
    this.m_card_container.addChild(this.m_card_front = AssetManager.GetCard(type));

    this.m_card_back.anchor.set(0.5);
    this.m_card_front.anchor.set(0.5);

    this.m_root.on("pointertap", this.clicked);

    this.m_fsm.registerState(CARD_STATE.FACEDOWN, {
      enter : () => {
        this.m_root.interactive = this.m_root.buttonMode = true;
      },
      exit : () => {
        this.m_root.interactive = this.m_root.buttonMode = false;
      }
    });

    this.m_fsm.registerState(CARD_STATE.MATCHING, {
    })

    this.m_fsm.registerState(CARD_STATE.MATCHED, {
    });

    
    this.m_fsm.registerState(CARD_STATE.CELEBRATE, {
      enter : () => {
        this._velocity = {
          y : Math.random() * -10 - 15,
          x : Math.random() * 30 - 10,
        }
      },
      update : () => {

        this._velocity.y += 0.8;

        this.m_root.position.x += this._velocity.x;
        this.m_root.position.y += this._velocity.y;

        if ( this.m_root.position.y >= 500 ) {
          this.m_root.y = 500;
          this._velocity.x *= 0.98;
          this._velocity.y *= -0.95;
        }
        if (this.m_root.position.x < -650) {
          this.m_root.position.x = -650;
          this._velocity.x *= -1;
        }
        if (this.m_root.position.x > 650) {
          this.m_root.position.x = 650;
          this._velocity.x *= -1;
        }

      }
    })

    this.hideCard(true);
  }

  public update = (deltaTime : number = 0) => {
    this.m_fsm.update(deltaTime);
  }

  public addToStage = (stage : PIXI.Container) => {
    stage.addChild(this.m_root);
  }

  public setPosition = (pos : Vector2) => {
    this.m_root.position.set(pos.x, pos.y);
  }

  public setMatched() {
    this.m_fsm.setState(CARD_STATE.MATCHED);
  }

  public doCelebration = () => {
    this.m_fsm.setState(CARD_STATE.CELEBRATE);
  }

  public showCard = () : Promise<void> => {
    if (this.m_fsm.state === CARD_STATE.FACEDOWN) {
        this.m_fsm.setState(CARD_STATE.MATCHING);
        return this.animateFlip(true);
    }
    return Promise.resolve();
  }

  public hideCard = (skip_animation : boolean = false) : Promise<void> => {
    if (this.m_fsm.state !== CARD_STATE.FACEDOWN) {
      this.m_fsm.setState(CARD_STATE.FACEDOWN);
      if (!skip_animation) {
        return this.animateFlip(false);
      }
    }
    this.m_card_front.visible = false;
    return Promise.resolve();
  }

  private animateFlip = (show_face : boolean) : Promise<void> => {

    new Tween( this.m_card_container.position as any )
        .easing(TWEEN.Easing.Sinusoidal.In)
        .to( { y : -35, x : Math.random() * 200 - 100}, 175 )
        .onComplete( () => {
          new Tween( this.m_card_container.position as any )
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .to({ y : 0 , x : 0 }, 125)
          .start(Date.now());
        })
        .start(Date.now());

    return new Promise( resolve => {
      new Tween( this.m_root.scale as any )
        .easing(TWEEN.Easing.Sinusoidal.In)
        .to( { x : 0 }, 175 )
        .onComplete( () => {
          this.m_card_front.visible = show_face;
          new Tween( this.m_root.scale as any )
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .to({ x : 1}, 125)
          .onComplete(resolve)
          .start(Date.now());
        })
        .start(Date.now());
    });
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