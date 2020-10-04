import * as PIXI from 'pixi.js';


export class GameSelectButton extends PIXI.Sprite {

  constructor (label_text : string) {
    super();

    let graphic = new PIXI.Graphics()
      .beginFill(0x008ec0)
      .lineStyle(6, 0x00efff)
      .drawRoundedRect( -100, -30, 200, 60, 25);

    this.addChild(graphic);


    let label = new PIXI.Text(label_text, {
      fill : 0xFFFFFF,
      fontSize : 38,
    } as PIXI.TextStyle)

    label.anchor.set(0.5);

    this.addChild(label);

    this.buttonMode = this.interactive = true

  }
  
}