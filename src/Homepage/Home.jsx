import Navbar from './Navbar.jsx'
import Slider from './Slider.jsx'
import Categories from './Categories.jsx'
import GameRow from './GameRow.jsx';
import styles from "./Home.module.css";
import latestReleases from './latestReleases.js';
import popularGames from './popular.js';
import frequentlyPurchased from './topSellers.js';
import recentlyAdded from './recentlyAdded.js';

function Home(){
    return(
        <div className={styles.home}>
        <Slider> </Slider>
        <Categories> </Categories>
        <GameRow title="Recently Added" games={recentlyAdded}> </GameRow>
        <GameRow title="Trending" games={latestReleases}> </GameRow>
        <GameRow title="Popular" games={popularGames}> </GameRow>
        <GameRow title="Top Sellers" games={frequentlyPurchased}> </GameRow>
        </div>
    );
}

export default Home