import GamePage from "../GamePage/Components/GamePage";
import styles from "./LibraryPage.module.css";
import { useState, useEffect } from "react";
import games from "../ExplorePage/Games";

function LibraryPage() {
    const [libraryGames, setLibraryGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(libraryGames.length?libraryGames[0]:null);
    const [query, setQuery] = useState("");

    const fetchLibrary = async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/library`,
            {
                method: "GET",
                headers: {
                    "Authorization":
                    `Bearer ${token}`
                }
            }
        );
        
        const data = await response.json();
        
        if(response.ok){
            const ids = data.map((game) => game.game_id);
            const filteredGames =
                games.filter(
                    (game) =>
                    ids.includes(
                        game.appid
                    )
                );
            setLibraryGames(filteredGames);
        }
        else{
            console.log(data.error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchLibrary();
    }, []);

    useEffect(() => {
        if(libraryGames.length) setSelectedGame(libraryGames[0]);
    }, [libraryGames])

    const filteredGames =
        libraryGames.filter((game) => {

            const matchesSearch =
                game.name
                .toLowerCase()
                .includes(
                    query.toLowerCase().trim()
                );

            return (
                matchesSearch
            );

        });

    
    if(loading){
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.libraryPage}>
            <div className={styles.sidebar}>
                <input
                type="text"
                placeholder="Search your library"
                className={styles.searchInput}
                value={query}
                onChange={(e) =>
                    setQuery(
                        e.target.value
                    )
                }
                />
                
                <div className={styles.gameList}>
                    {
                    filteredGames.map(
                        (game) => (
                            <div
                                key={game.appid}
                                className={
                                    selectedGame && selectedGame.appid===game.appid
                                    ?
                                    `${styles.gameRow} ${styles.active}`
                                    :
                                    styles.gameRow
                                }
                                onClick={() =>
                                    setSelectedGame(
                                        game
                                    )
                                }
                            >
                                
                                <img
                                    src={game.icon}
                                    alt=""
                                    className={styles.gameIcon}
                                />

                                <span> {game.name} </span>

                            </div>
                        )
                    )
                }
                </div>
            </div>

            <div className={styles.selectedSection}>
                {selectedGame && <GamePage selectedAppid={selectedGame.appid} className={styles.gamePreview}/>}
            </div>
        </div>

    );

}

export default LibraryPage;