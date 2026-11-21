import { useState, useEffect} from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import styles from './GameRow.module.css'
import GameCard from "./GameCard";

function GameRow({ title, games }) {
    const [slide, setSlide] = useState(0);

    const shuffleArray = (arr) => {
        const copy = [...arr];
        
        for(let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const nextSlide = () => {
        if(slide + 6 >= games.length) setSlide((prev) => 0);
        else setSlide((prev) => (prev + 6)%games.length);
    };
    
    const prevSlide = () => {
        if(slide - 6 < 0) setSlide((prev) => games.length - games.length%6 );
        else setSlide((prev) => (prev - 6 + games.length)%games.length);
    };

    const [shuffled, setShuffled] = useState([]);
    
    
    useEffect(() => {
        setShuffled(shuffleArray(games));
    }, []);

    return (
    <div className={styles.gameRowContainer}>
        <h1>{title.toUpperCase()}</h1>
        <div className={styles.carouselWrapper}>
            <button className={styles.leftSlide} onClick={prevSlide}>
                <FaChevronLeft />
            </button>
            <div className={styles.viewport}>
                <div className={styles.track}
                style={{
                    transform:
                    `translateX(
                    -${slide * 250}px
                    )`
                }}
                >
                    {
                    shuffled.map((game) => (
                    <GameCard key={game.appid} title={game.name} appId={game.appid} price={game.price} image={game.image}/>
                    ))
                    }
                </div>
            </div>      
            <button className={styles.rightSlide} onClick={nextSlide}>
                <FaChevronRight />
            </button>
        </div>
    </div>
  );
}

export default GameRow;