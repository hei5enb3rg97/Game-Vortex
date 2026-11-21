import { useState, useEffect} from "react"

import HeroCard from './HeroCard.jsx'
import styles from "./Slider.module.css"
import featuredGames from "./featuredGames.js"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

function Slider(){
    const [index,setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = () => {
        setIndex((index+1)%featuredGames.length);
    }

    const prevSlide = () => {
        setIndex((index-1+featuredGames.length)%featuredGames.length);
    }

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % featuredGames.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [index, isHovered]);

    return(
    <div className={styles.sliderContainer}>

    <h1>FEATURED</h1>

    <div className={styles.Slider}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}>
        <button className={styles.leftSlide} onClick={prevSlide}>
            <FaChevronLeft />
        </button>
        <HeroCard {...featuredGames[index]}/>
        <button className={styles.rightSlide} onClick={nextSlide}>
            <FaChevronRight />
        </button>
    </div>
    </div>);
}

export default Slider