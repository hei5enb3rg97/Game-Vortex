import { useState } from "react"
import CategoryCard from './CategoryCard.jsx'
import rdr2image from '../assets/hero/rdr2.jpg'
import styles from './Categories.module.css'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import categoryList from './categoryList.js'

function Categories() {
    const [index, setIndex] = useState(0);

    const visibleCategories = categoryList.slice(index, index + 4);

    const prevSlide = () => {
        setIndex((prev) => (prev-4+categoryList.length)%categoryList.length);
    }
    
    const nextSlide = () => {
        setIndex((prev) => (prev+4)%categoryList.length);
    }

    return (<div className={styles.categoryContainer}>
    <h1 className={styles.title}>CATEGORIES</h1>
    <div className={styles.categorySlider}>
        
        <button className={styles.leftSlide} onClick={prevSlide}>
            <FaChevronLeft />
        </button>
        
        <div className={styles.cards}>
            {visibleCategories.map((category) => (
                <CategoryCard
                key={category.title}
                {...category}
                />
            ))}
        </div>
        
        <button className={styles.rightSlide} onClick={nextSlide}>
            <FaChevronRight />
        </button>
    
    </div>
    </div>
    );

}
export default Categories