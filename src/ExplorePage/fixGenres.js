import fs from 'fs';
import path from 'path';
import gamesList from './Games.js';

// Helper function to query Steam's official storefront API
async function fetchSteamGenres(appid) {
  try {
    const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data[appid] && data[appid].success && data[appid].data) {
      const storeData = data[appid].data;
      // Extract official store genres
      if (storeData.genres && Array.isArray(storeData.genres)) {
        return storeData.genres.map(g => g.description);
      }
    }
  } catch (error) {
    console.error(`❌ Failed fetching appid ${appid}:`, error.message);
  }
  return null;
}

async function fixAllGenres() {
  console.log(`Starting cross-check for ${gamesList.length} games against steampowered.com...\n`);
  
  // Create a deep copy of the original list to modify safely
  const updatedGamesList = JSON.parse(JSON.stringify(gamesList));

  for (let i = 0; i < updatedGamesList.length; i++) {
    const game = updatedGamesList[i];
    console.log(`[${i + 1}/${updatedGamesList.length}] Checking "${game.name}" (ID: ${game.appid})...`);
    
    const officialGenres = await fetchSteamGenres(game.appid);
    
    if (officialGenres) {
      const oldGenresSorted = [...game.genres].sort().join(', ');
      const newGenresSorted = [...officialGenres].sort().join(', ');
      
      if (oldGenresSorted !== newGenresSorted) {
        console.log(`   👉 Fix applied! Changed [${game.genres.join(', ')}] to [${officialGenres.join(', ')}]`);
        game.genres = officialGenres;
      } else {
        console.log(`   ✅ Up to date.`);
      }
    } else {
      console.log(`   ⚠️ Could not retrieve store details. Keeping current entries.`);
    }
    
    // 1-second delay per game to respect Steam's storefront API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Re-serialize the corrected array back to Games.js with identical formatting
  const fileContent = `const Games = \n\n${JSON.stringify(updatedGamesList, null, 2)}\n\nexport default Games\n`;
  
  fs.writeFileSync('./Games.js', fileContent, 'utf8');
  console.log('\n🎉 Cross-checking complete! Your Games.js file has been fixed and updated.');
}

fixAllGenres();