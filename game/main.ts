import { Boot } from './scenes/Boot';
//import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
//import { temp } from './scenes/temp';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { GridEngine, GridEngineHeadless } from "grid-engine";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        //GameOver,
        //temp
    ],
    scale: {
        width: 800,
        height: 600,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ],
      },
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
