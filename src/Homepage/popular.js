import Games from "../ExplorePage/Games";

const popularIds = [
    730,
    570,
    1172470,
    578080,
    2767030,
    230410,
    1085660,
    252490,
    1623730,
    1966720,
    553850,
    359550,
    739630,
    105600,
    413150,
    275850,
    2399830,
    1172620,
    381210,
    271590
];

const popularGames = Games.filter(
    game => popularIds.includes(game.appid)
);

export default popularGames;