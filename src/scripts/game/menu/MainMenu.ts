import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { FSM } from '../../engine/FSM';
import { GameConfig } from '../GameController';
import { GameSelectButton } from './GameSelectButton';


const MENU_OPTIONS : GameConfig[] = [
  {
    dimensions : {
      width : 3,
      height : 4,
    }
  },
  {
    dimensions : {
      width : 5,
      height : 2,
    }
  },
  {
    dimensions : {
      width : 4,
      height : 4,
    }
  },
  {
    dimensions : {
      width : 4,
      height : 5,
    }
  }
]


export class MainMenu extends PIXI.Sprite {

  constructor (onSelectOption : (config : GameConfig) => void) {
    super();

    let header = new PIXI.Text("Memory Game", {
      fontSize : 84,
      fill : 0xFFFFFF,
    } as PIXI.TextStyle);

    header.anchor.set(0.5);
    header.position.set(400, 150);
    this.addChild(header);

    _.forEach(MENU_OPTIONS, (option, index) => {

      let label = option.dimensions.width + 'x' + option.dimensions.height;
      let btn = new GameSelectButton(label);
      btn.position.set (400, 300 + index * 90);
      this.addChild(btn);

      btn.on('click', () => {
        onSelectOption(option)
      });

    });

  }
}