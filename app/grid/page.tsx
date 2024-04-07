"use client";
import React, { useRef } from 'react';
import {
    GridEngineHeadless,
    ArrayTilemap,
    CollisionStrategy,
  } from "grid-engine";
  import { AsciiRenderer } from "./AsciiRenderer"
  const gridEngineHeadless = new GridEngineHeadless();
  
  // A simple example tilemap created from an array.
  // 0 = non-blocking
  // 1 = blocking


function GridPage() {
    //const asciiRendererRef = useRef();

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
      // This section has been rewritten to pass the required props to AsciiRenderer
    
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
        //asciiRenderer.render();
        console.log("rendering");
      const randomX = Math.floor(Math.random() * 5) + 1;
      const randomY = Math.floor(Math.random() * 5) + 1;
      gridEngineHeadless.setPosition("player", { x: randomX, y: randomY });
      gridEngineHeadless.moveTo("player", targetPos);
      }, 50);
  return (
    <div>
        <h1>Grid Page</h1>
        <AsciiRenderer gridEngine={gridEngineHeadless} tilemap={tilemap} />
        <p>This is the grid page.</p>
    </div>
  );
}
// <script src="main.js" defer></script>
export default GridPage;
