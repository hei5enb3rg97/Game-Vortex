import styles from "./ExplorePage.module.css"
import Games from "./Games.js"
import genres from "./genre.js"
import GameCard from "../Homepage/GameCard.jsx"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";



function ExplorePage() {
    const [searchParams] = useSearchParams();
    const initialGenre = decodeURIComponent(searchParams.get("genre")||"");
    const query = decodeURIComponent(searchParams.get("query")||"");
    const [filteredGames, setFilteredGames] = useState([...Games]);
    const [selectedGenres, setSelectedGenres] = useState(initialGenre?[initialGenre]:[...genres]);
    const [priceRange, setPriceRange] = useState({min: "", max: ""});
    const [sortBy, setSortBy] = useState("Sort By");

    console.log(Games[0].genres);
    console.log(Games[0].genres.includes("Action"));
    console.log(selectedGenres);

    function toggleGenre(genre) {
        setSelectedGenres((prev) =>
            prev.includes(genre)? prev.filter((g) => g !== genre): [...prev, genre]
        );
    }

    useEffect(() => {
        applyFilters();
    },[query, initialGenre])

    const applyFilters = () => {
        const result = Games.filter((game) => {
            const min = (priceRange.min === "" ? 0 : Number(priceRange.min));
            const max = (priceRange.max === "" ? Infinity : Number(priceRange.max));
            return selectedGenres.some((genre) => game.genres.includes(genre)) &&
                   (game.numPrice>= min && game.numPrice<= max) &&
                   (game.name.toLowerCase().includes(query.trim().toLowerCase()));
        })

        switch(sortBy){
            case "Sort By": break;
            case "Newest first": result.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));break;
            case "Oldest first": result.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));break;
            case "pricel": result.sort((a, b) => a.numPrice - b.numPrice);break;
            case "priceh": result.sort((a, b) => b.numPrice - a.numPrice);break;
        }

        setFilteredGames(result);
    }

    return(
        <div className={styles.explorePage}>
            <aside className={styles.filterSidebar}>
                <h2>FILTERS</h2>
                <div className={styles.filterSection}>
                    <h3>GENRES</h3>
                    {genres.map((genre) => (
                        <label key={genre} className={styles.checkboxRow}>
                            <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre)}
                            onChange={() => toggleGenre(genre)}
                            />
                            {genre}
                        </label>
                    ))}
                </div>
                
                <div className={styles.filterSection}>
                    <h3>PRICE</h3>
                    <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                        setPriceRange({
                            ...priceRange,
                            min: e.target.value
                        })
                    }
                    />
                    
                    <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                        setPriceRange({
                            ...priceRange,
                            max: e.target.value
                        })
                    }
                    />
                </div>
                
                <div className={styles.filterSection}>
                    <h3>SORT BY</h3>
                    <div className={styles.selectWrapper}>
                    <select
                    value={sortBy}
                    placeholder="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="Sort By">
                            None
                        </option>

                        <option value="Newest first">
                            Newest Release
                        </option>

                        <option value="Oldest first">
                            Oldest Release
                        </option>
                        
                        <option value="pricel">
                            Lowest price
                        </option>
                        
                        <option value="priceh">
                            Highest price
                        </option>
                    </select>
                    </div>
                </div>
                <div className={styles.filterSection}>
                    <button className={styles.filterButton} onClick={applyFilters}>Filter</button>
                </div>
            </aside>

            <main className={styles.resultsSection}>
                <main className={styles.resultsSection}>
                    <h2>RESULTS</h2>
                    <div className={styles.gamesGrid}>
                        {filteredGames.map((game) => (
                            <GameCard
                            key={game.appid}
                            appId={game.appid}
                            title={game.name}
                            price={game.price}
                            image={game.image}
                            />
                        ))}
                    </div>
                </main>
            </main>
        </div>
    );
}

export default ExplorePage