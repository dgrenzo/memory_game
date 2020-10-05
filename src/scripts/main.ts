import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js'
import { AssetManager, AssetNames } from "./game/assets/AssetManager";
import { GameConfig, GameController } from "./game/GameController";
import { MainMenu } from "./game/menu/MainMenu";

let pixi_app : PIXI.Application = new PIXI.Application({
  forceCanvas : true,
  preserveDrawingBuffer : true,
  backgroundColor : 0x97e4ff,
  antialias : true,
  width : 800,
  height : 650,
  view : <HTMLCanvasElement>document.getElementById('game_canvas')
});

pixi_app.ticker.add(() => {
  TWEEN.update(Date.now())
});


let controller : GameController;
let menu : MainMenu;
let back_button : PIXI.Sprite;


let onSelectOption = (config : GameConfig) => {
  pixi_app.stage.removeChildren();
  
  controller = new GameController(pixi_app, config);
  pixi_app.ticker.add(controller.update);
  
  pixi_app.stage.addChild(back_button);
}

let onBack = () => {
  pixi_app.renderer.clearBeforeRender = true;
  pixi_app.stage.removeChildren();
  pixi_app.ticker.remove(controller.update);

  pixi_app.stage.addChild(menu);
}



AssetManager.LoadAssets().then(() => {
  menu = new MainMenu(onSelectOption);
  pixi_app.stage.addChild(menu);

  back_button = AssetManager.GetSprite(AssetNames.BACK_BUTTON);
  back_button.interactive = back_button.buttonMode = true;
  back_button.on('pointertap', onBack);
});