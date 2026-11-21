import styles from './CategoryCard.module.css'
import {
  useNavigate
} from "react-router-dom";

function CategoryCard({image, title}) {
    
    const navigate = useNavigate();
    
    const openCategory = () => {
        navigate(
            `/explore?genre=${encodeURIComponent(title)}`
        );
    };

    return(
    <div className={styles.categoryCard} onClick={openCategory}>

        <img src={image} alt={title} className={styles.categoryImage}/>
        
        <h2 className={styles.overlayText}> {title} </h2>
        
    </div>
    );

}

export default CategoryCard