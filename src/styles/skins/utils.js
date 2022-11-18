export const getRandomNumberExclude = (randRange, exclude = -1) => {
    if (exclude > 0) {
        let val = Math.floor(Math.random() * (randRange - 1))>>0;
        if (val === exclude) {
            return randRange - 1;
        }
        return val;
    }
    return Math.floor(Math.random() * randRange)>>0;
}