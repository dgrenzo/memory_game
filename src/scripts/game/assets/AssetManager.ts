import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { CARD_NAME } from '../card/types';


export class AssetNames {
  public static BACK_BUTTON = "backNavButton@2x.png";
  
  public static  CARD_BACK = "allCardBacks@2x.png";
  
  public static CARD_TYPES = {
    BAT : "memoryBatCardFront@2x.png",
    CAT : "memoryCatCardFront@2x.png",
    COW : "memoryCowFront@2x.png",
    DRAGON : "memoryDragonCardFront@2x.png",
    GARBAGE_MAN : "memoryGarbageManCardFront@2x.png",
    GHOST_DOG : "memoryGhostDogCardFront@2x.png",
    HEN : "memoryHenCardFront@2x.png",
    HORSE : "memoryHorseCardFront@2x.png",
    PIG : "memoryPigCardFront@2x.png",
    SPIDER : "memorySpiderCardFront@2x.png",
  }
}

export class AssetManager {
  private static IMAGE_DIR = "./assets/images/";

  private static _image_loader : PIXI.Loader;

  public static LoadAssets() : Promise<void> {

    let image_loader = AssetManager._image_loader = new PIXI.Loader(AssetManager.IMAGE_DIR);

    image_loader.add(AssetNames.BACK_BUTTON);
    image_loader.add(AssetNames.CARD_BACK);
    image_loader.add(_.values(AssetNames.CARD_TYPES));
    
    return  new Promise<void>((resolve) => {
      image_loader.load(() => {
        resolve();
      });
    });
  }

  public static GetCard (card_name : CARD_NAME) : PIXI.Sprite {
    let asset = AssetNames.CARD_TYPES[card_name];
    let texture = this._image_loader.resources[asset].texture;
    return PIXI.Sprite.from(texture);
  }

  public static GetSprite (asset_name : string) : PIXI.Sprite {
    let texture = this._image_loader.resources[asset_name].texture;
    return PIXI.Sprite.from(texture);
  }


}