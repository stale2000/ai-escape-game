"use client";
/*import {
    GridEngineHeadless,
    ArrayTilemap,
    CollisionStrategy,
  } from "grid-engine";
  import { AsciiRenderer } from "./AsciiRenderer"
  
  const gridEngineHeadless = new GridEngineHeadless();
  
  // A simple example tilemap created from an array.
  // 0 = non-blocking
  // 1 = blocking
  const tilemap = new ArrayTilemap({
    someLayer: {
      data: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
  });
  
  gridEngineHeadless.create(tilemap, {
    characters: [{ id: "player" }],
    characterCollisionStrategy: CollisionStrategy.BLOCK_ONE_TILE_AHEAD,
  });
  
  const asciiRenderer = new AsciiRenderer("content", gridEngineHeadless, tilemap);
  asciiRenderer.render();
  
  const targetPos = { x: 4, y: 5 };
  gridEngineHeadless.moveTo("player", targetPos);
  
  gridEngineHeadless.positionChangeFinished().subscribe(({ enterTile }) => {
    if (enterTile.x == targetPos.x && enterTile.y == targetPos.y) {
      gridEngineHeadless.setPosition("player", { x: 0, y: 0 });
      gridEngineHeadless.moveTo("player", targetPos);
    }
  });
  
  setInterval(() => {
    gridEngineHeadless.update(0, 50);
    asciiRenderer.render();
  }, 50);
  */