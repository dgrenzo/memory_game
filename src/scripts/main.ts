import * as PIXI from "pixi.js";
import * as TWEEN from '@tweenjs/tween.js'
import { AssetManager } from "./game/assets/AssetManager";
import { GameController } from "./game/GameController";

let pixi_app : PIXI.Application = new PIXI.Application({
  forceCanvas : true,
  preserveDrawingBuffer : true,
  backgroundColor : 0xCCCCFF,
  antialias : true,
  width : 800,
  height : 650,
  view : <HTMLCanvasElement>document.getElementById('game_canvas')
});

pixi_app.ticker.add(() => {
  TWEEN.update(Date.now())
});

AssetManager.LoadAssets().then(() => {
  let controller = new GameController(pixi_app, {
    dimensions : {
      width : 4,
      height : 4,
    }
  });
  
  pixi_app.ticker.add(controller.update);
});