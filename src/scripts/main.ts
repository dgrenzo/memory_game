import * as PIXI from "pixi.js";
import { AssetManager } from "./game/assets/AssetManager";
import { GameController } from "./game/GameController";

let pixi_app : PIXI.Application = new PIXI.Application({
  forceCanvas : true,
  backgroundColor : 0xFFCCFF,
  antialias : true,
  view : <HTMLCanvasElement>document.getElementById('game_canvas')
});

pixi_app.ticker.add(() => {
 // TWEEN.update(Date.now())
});

AssetManager.LoadAssets().then(() => {
  let controller = new GameController(pixi_app, {
    dimensions : {
      width : 4,
      height : 4,
    }
  });
});