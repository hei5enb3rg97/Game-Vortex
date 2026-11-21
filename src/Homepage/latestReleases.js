import Games from "../ExplorePage/Games";

const latestReleaseIds = [
    2767030,
    730,
    553850,
    1966720,
    1623730,

    2073850,
    1364780,
    1971870,
    1778820,

    1716740,
    1627720,
    1282100,

    1326470,
    739630,
    1693980,

    668580,
    1888160,
    2183900,

    1272080,
    578080
];

const newAndTrending = Games.filter(
    game => latestReleaseIds.includes(game.appid)
);

export default newAndTrending;