import { extractSongName } from './Data';

const extractParenthesis = (filename) => {
    let extracted = /(.+)（.+）/.exec(filename); 
    if (extracted) {
        return extracted[1];
    } else {
        return filename;
    }
}

export const reExtract = (filename, uploader) => {
    let extracted = null;
    switch (String(uploader)) {
        case "胡桃小王":
            // always {number}_{songname} by {artist}  
            // 27_星の在り処 Full Ver. (Less Vocal) [BONUS TRACK] by Falcom Sound Team jdk
            // occasionally theres a parenthesis; always take whats before left parenthesis
            // im sure theres a one statement way to do this re....
            extracted = /\d*_(.+) \(.+/.exec(filename);
            if (extracted == null) {
                extracted = /\d*_(.+) \(?.*by .+/.exec(filename);
            }
            break;
        case "冥侦探柯鎮悪":
            // seesm to be always 【vtuber】《song （his comments）》
            // eg 【ninnikuu泥泥裤】《alice（现场LIVE纯享版~古川本辅，日）》
            extracted = /【.+】《(.+)（.+）》/.exec(filename);
            break;
        case "钢铁慈父晚大林":
            // always 【HeraKris】【stream title】{songname}
            //【赫拉Kris】【随便唱唱】三国恋
            filename = extractParenthesis(filename);
            extracted = /【赫拉Kris】【.+】(.+)/.exec(filename);
            break;
        case "叹氣喵":
            break;
            // 不安喵wrng变得太多
        case "起名字什么的真困难啊":
            // always number.{songname}
            //11.一番の宝物
            extracted = /\d+\.(.+)/.exec(filename);
            break;
        case "蝉时雨☆":
            // always 【vtuber】{songname}
            //【clessS×汐尔Sier】玫瑰少年
            extracted = /【.+】(.+)/.exec(filename);
            break;
        case "HonmaMeiko":
            // always number {songname}
            // 11 一番の宝物
            filename = extractParenthesis(filename);
            extracted = /\d+ (.+)/.exec(filename);
            break;
        case "海鲜DD":
            // sometimes date_in_numbers{songname}; others in brackets
            // 11一番の宝物
            filename = extractParenthesis(filename);
            extracted = /\d+(.+)/.exec(filename);
            break;
        case "夜の_":
            // sometimes date_in_numbers {songname}; someimtes index.{somename}
            // else song name is always in brackets.
            // 9.普通朋友
            filename = extractParenthesis(filename);
            extracted = /\d+\.\d+ (.+)/.exec(filename);
            if (extracted == null) {
                extracted = /\d+\.(.+)/.exec(filename);
            }
            break;
        case "随心":
            // in specialized brackets.
            // 『露米Lumi_Official』『月牙湾』
            filename = extractParenthesis(filename);
            extracted = /.*『(.+)』.*/.exec(filename);
            break;
        case "焱缪-猫猫兔":
            // in specialized brackets.
            // 【折原露露 · 翻唱】乌兰巴托的夜（10.18-歌切）
            filename = extractParenthesis(filename);
            extracted = /【.+】(.+)/.exec(filename);
            break;
            
    }
    if (extracted !== null) return extracted[1];
    console.debug('resorting to default songname extract', filename, uploader);
    // if fails, first try to extract in brackets; else return as is.
    return extractSongName(filename);
}