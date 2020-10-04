import * as PIXI from "pixi.js";
import { AssetManager } from "./game/assets/AssetManager";

let pixi_app : PIXI.Application = new PIXI.Application({
  forceCanvas : true,
  backgroundColor : 0x291f2e,
  view : <HTMLCanvasElement>document.getElementById('game_canvas')
});

AssetManager.LoadAssets().then(() =>{

});