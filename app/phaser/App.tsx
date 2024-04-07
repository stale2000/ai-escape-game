import { useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '../../game/PhaserGame';
import { MainMenu } from '../../game/scenes/MainMenu';

function App()
{
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const [currentGrid, setCurrentGrid] = useState<number[][]>([]);
    const [explanation, setExplanation] = useState<string>("");
    const [inputText, setInputText] = useState('');
    const prevActions = useRef<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value);
    };

    const changeScene = () => {

        if(phaserRef.current)
        {     
            const scene = phaserRef.current.scene as MainMenu;
            
            if (scene)
            {
                scene.changeScene();
            }
        }
    }

    const moveSprite = () => {

        if(phaserRef.current)
        {

            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === 'MainMenu')
            {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {

                    setSpritePosition({ x, y });

                });
            }
        }

    }
/*
    const addSprite = () => {

        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene;

            console.log("scene", scene);

            if (scene)
            {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);
    
                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, 'star');
    
                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }
    */

    async function callGameAPI() {
        const template = `
        {
            graph: ${JSON.stringify(currentGrid)},
            action: ${JSON.stringify(inputText)}
            restrictions: If the user has previously done the following actions already, come up with a clever reason why it fails. If it has not been used before it should suceed. Prev Actions: ${JSON.stringify(prevActions.current)}
            
        }
        `;

        const response = await fetch('/api/game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [
              { role: "user", content: template },
            ],
          }),
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        const data = await response.json();
        console.log("TEST ZZZZZZ");
        console.log("data", data);
        console.log("jsonMsg explain", data.explanation);
        console.log("success", data.success);
        setExplanation(data.explanation);

        const outputArray = data.output as number[][];
        console.log("outputArray", outputArray);
        //console.log("position 0 0 ", outputArray[0][0]);

        prevActions.current.push(inputText);
        console.log("prevActions", prevActions.current);
        if (!data.success) {
            console.log("Failed to move sprite");
            return;
        }
        //resetGrid(outputArray);
        const scene = phaserRef.current!.scene as MainMenu;
        setCurrentGrid(outputArray)
        scene.setNewGrid(outputArray);

      }

    const resetGrid = async () => {
        if (phaserRef.current)
        {
            const scene = phaserRef.current.scene as MainMenu;
        console.log("scene", scene);
        const newGrid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
        ]
        setCurrentGrid(newGrid)
        scene.setNewGrid(newGrid);
        }
    }
      
    

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        console.log("currentScene", scene.scene.key);

        setCanMoveSprite(scene.scene.key !== 'MainMenu');
        
    }

    const moveToNextLevel = async () => {
        // Assuming there's a predefined method to fetch the next level's grid
        try {
            
            const menuScene = phaserRef.current!.scene as MainMenu;

                const template = `
                graph: ${currentGrid}
                action: Create a new level, similar to the old level.  But make the level such that it takes into account where the user moved previously. 
                It should reset the player's location to the bottom of the screen. 
                the grid should not be larger than 20 by 10.
                It should add more barriers in the way of where the player moved, or create a maze, or similar.  It should look similar to the previous map though, but updated. 
                The explanation should explain what the user's moves were, and how the map was updated related to those moves.  
                Players moves:  ${menuScene.moveArray.map(move => `x ${move.x} y ${move.y}`).join(", ")}
                `;
            const response = await fetch('/api/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                // You might need to adjust the body based on how your API expects it
                /*
                body: JSON.stringify({
                    currentGrid: currentGrid,
                    moveArray: menuScene.moveArray,
                }),  */
                body: JSON.stringify({
                    messages: [
                      { role: "user", content: template },
                    ],
                  }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch the next level');
            }

            const data = await response.json();
            console.log("Next level data", data);
            const nextLevelGrid = data.output as number[][];
            setCurrentGrid(nextLevelGrid);
            const scene = phaserRef.current!.scene as MainMenu;
            scene.setNewGrid(nextLevelGrid);

        setExplanation(data.explanation);
        } catch (error) {
            console.error("Error moving to next level:", error);
        }
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div>
                <div>
                    <button className="button" onClick={resetGrid}>Reset Grid</button>
                </div>
                <div>
                    <button className="button" onClick={moveToNextLevel}>Move to Next Level</button>
                </div>
                <div>
                    <button className="button" onClick={callGameAPI}>Do Action</button>
                </div>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter text here" 
                        value={inputText} 
                        onChange={handleInputChange} 
                    />
                </div>
            </div>
            <div>
                <h2>Explanation</h2>
                <p>{explanation}</p>
            </div>

        </div>
    )
}

export default App
