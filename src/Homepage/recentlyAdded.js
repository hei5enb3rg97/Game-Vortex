import Games from "../ExplorePage/Games";

const recentlyAddedIds = [
    3764200,
    3768760,
    1962700,
    3357650,
    3321460,
    1172710,
    2947440,
    1808500,
    3280350,
    1941540,
    1285190,
    3681010,
    2129530
];

const recentlyAdded = Games.filter(
    game => recentlyAddedIds.includes(game.appid)
);

export default recentlyAdded;