import { Direction, GridEngine } from "grid-engine";
import * as Phaser from "phaser";
import { EventBus } from '../EventBus';

import {
    GridEngineHeadless,
    ArrayTilemap,
    CollisionStrategy,
  } from "grid-engine";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};



export class MainMenu extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private gridEngineConfig: any;
  private cloudCityTilemap?: Phaser.Tilemaps.Tilemap;
  moveArray: { x: number; y: number }[] = [];
    /*
  constructor() {
    super(sceneConfig);
  } */
      constructor ()
    {
        super('MainMenu');
    }
/*
  create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0);
      layer!.scale = 3;
    }
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 1.5;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 3, y: 3 },
        },
      ],
    };

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
  }
  */


  async create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("cloud_tileset", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
        console.log("layer", i);
      const layer = cloudCityTilemap.createLayer(i, "cloud_tileset", 0, 0);
      layer!.scale = 3;
    }
    this.cloudCityTilemap = cloudCityTilemap;
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.scale = 1.5;
    this.cameras.main.startFollow(playerSprite, true);
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);
  
    const gridEngineConfig = {
      characters: [
        
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 22, y: 40 },
          collides: true,
        }, 
      ],
    };
    this.gridEngineConfig = gridEngineConfig;
  
    for (let x = 10; x <= 20; x++) {
      for (let y = 31; y <= 40; y++) {
        continue;
      }
    }
    


  
    this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
    for (let x = 10; x <= 20; x++) {
      for (let y = 31; y <= 40; y++) {
        //this.gridEngine.moveRandomly(`npc${x}#${y}`, this.getRandomInt(0, 1500));
      }
    }
    this.gridEngine.positionChangeFinished().subscribe(({ enterTile }) => {
        console.log("Player position:", enterTile);
      this.moveArray.push({ x: enterTile.x - 10, y: enterTile.y - 30 });
      console.log("moveArray", this.moveArray);
      });
    EventBus.emit('current-scene-ready', this);
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public update() {
    const cursors = this.input.keyboard!.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move("player", Direction.LEFT);

    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", Direction.DOWN);
    }
  }

  public setNewGrid(grid: number[][]) {
    console.log("grid", grid);
    // Assuming grid is a 2D array of numbers where
    // 0 represents an empty tile,
    // 1 represents an obstacle,
    // 2 represents the player,
    // and any other number represents different types of NPCs or items.
    //this.gridEngine.removeAllCharacters();

    const characters: { id: string; type: number; position: { x: number; y: number } }[] = [];
    const allCharacters = this.gridEngine.getAllCharacters();
    allCharacters.forEach(character => {
        this.gridEngine.setPosition(character, { x: 30, y: 10 });
        if (character !== "player") {
            this.gridEngine.getSprite(character)!.destroy();
            this.gridEngine.removeCharacter(character);

        }
        //this.gridEngine.removeCharacter(character);

    });

    grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        switch(tile) {
          case 0: // Empty tile, do nothing
            break;
          case 1: // ending
          const endSpr = this.add.sprite(x, y, 'star2');
          endSpr.scale = 1;
          this.gridEngine.addCharacter({
            id: `npc${x}#${y}`,
            sprite: endSpr,
            walkingAnimationMapping: this.getRandomInt(0, 6),
            startPosition: { x: x + 10, y: y + 30 },
            collides: true,
          });
            //this.add.sprite(x * 32, y * 32, "obstacle");
            break;
          case 2: // Player

          /*
          const playerSprite = this.add.sprite(0, 0, "player");
          playerSprite.scale = 1.5;
          this.cameras.main.startFollow(playerSprite, true);
          this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height);

          this.gridEngine.addCharacter({
            id: "player",
            sprite: playerSprite,
            walkingAnimationMapping: this.getRandomInt(0, 6),
            startPosition: { x: x + 10, y: y + 30 },
            collides: true,
          });
          */
          this.gridEngine.setPosition("player", { x: x + 10, y: y + 30 });
        
            //this.add.sprite(x * 32, y * 32, "player");
            break;
          default: // NPCs or items

          //const spr = this.add.sprite(0, 0, "player");
          const spr = this.add.sprite(x, y, 'star');
          spr.scale = 1;
          this.gridEngine.addCharacter({
            id: `npc${x}#${y}`,
            sprite: spr,
            walkingAnimationMapping: this.getRandomInt(0, 6),
            startPosition: { x: x + 10, y: y + 30 },
            collides: true,
          });
            //this.add.sprite(x * 32, y * 32, `npc${tile}`);
            /*
            this.gridEngineConfig.characters.push({
                id: `npc${x}#${y}`,
                sprite: spr,
                walkingAnimationMapping: this.getRandomInt(0, 6),
                startPosition: { x: x + 10, y: y + 30 },
              })
              */
            break;
        }
      });

    });
    this.moveArray = [];
    //this.gridEngine.create(this.cloudCityTilemap!, this.gridEngineConfig);
  }

  changeScene ()
  {
      this.scene.start('Game');
  }

  moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {

    }

    public nextLevel() {
        // send in move array
        // send in previous grid

    }



  preload() {
    this.load.image("tiles", "assets/cloud_tileset.png");
    this.load.tilemapTiledJSON("cloud-city-map", "assets/cloud_city_large.json");


    this.load.spritesheet("player", "assets/characters.png", {
      frameWidth: 52,
      frameHeight: 72,
    });
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "Sample",
  render: {
    antialias: false,
  },
  type: Phaser.AUTO,
  scene: MainMenu,
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
  parent: "game",
};

//export const game = new Phaser.Game(gameConfig);






/*import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background?: GameObjects.Image;
    logo?: GameObjects.Image;
    title?: GameObjects.Text;
    logoTween?: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        this.title = this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo!.x),
                            y: Math.floor(this.logo!.y)
                        });
                    }
                }
            });
        }
    }
}
*/