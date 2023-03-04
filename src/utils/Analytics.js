
/**
 * top 10 most common songs
 * # of songs with valid names vs just numbers
 * # of bvids / total
 * use mui-confirm with a provided content 
 * @param {*} favList 
 */
export const favListAnalytics = (favList) => {
    let results = {
        bvid: new Set(),
        totalCount: 0,
        validShazamCount: 0,
        invalidShazamCount: 0,
        songOccurrence: {},
        songsSorted: [],
        songsUnique: new Set(),
    }
    for (const song of favList.songList) {
        results.bvid.add(song.bvid);
        results.totalCount += 1;
        if (isNaN(Number(song.parsedName))) {
            results.songsUnique.add(song.parsedName);
            results.validShazamCount += 1;
            if (results.songOccurrence[song.parsedName] === undefined) {
                results.songOccurrence[song.parsedName] = 0;
            }
            results.songOccurrence[song.parsedName] += 1;
        } else {
            results.invalidShazamCount += 1;
        }
    }
    results.songsSorted = Object.entries(results.songOccurrence).sort((a, b) => -(a[1] - b[1]));
    results.songTop10 = results.songsSorted.slice(0, 10);
    return results;
}