import fs from "fs";

import Games from "./Games.js";

async function updateGames(){

    const updatedGames = [];

    for(const game of Games){

        try{

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/Grid/${game.appid}`
            );

            const data = await response.json();

            updatedGames.push({
                ...game,
                icon: data.image
            });

            console.log(
                `done ${game.name}`
            );
        }
        catch(error){

            updatedGames.push({
                ...game,
                icon: null
            });

            console.log(
                `failed ${game.name}`
            );
        }
    }

    fs.writeFileSync(
        "./UpdatedGames.json",
        JSON.stringify(updatedGames, null, 2)
    );
}

updateGames();