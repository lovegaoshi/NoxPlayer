/**
 * get a cookie using chrome.cookies.get.
 * @param {string} domain url of the cookie, eg bilibili.com
 * @param {string} name name of the cookie, eg SESSIONDATA
 * @returns 
 */
const getCookie = async (domain, name) => {
    return chrome.cookies.get({ "url": domain, "name": name });
}

/**
 * use api.bilibili.com/x/web-interface/archive/has/like?bvid=
 * to check if a bvid is liked by the current logged in bilibili user.
 * @param {string} bvid bvid of the bilibili video.
 * @param {function} onChecked callback  function with the input parameter of the 
 * looked up json API return.
 */
export const checkBVLiked = (bvid, onChecked = () => {}) => {
    fetch('https://api.bilibili.com/x/web-interface/archive/has/like?bvid=' + bvid, {
            credentials: 'include',
            referer: 'https://www.bilibili.com/video/' + bvid + '/',
        })
        .then(res => res.json())
        .then(json => onChecked(json.data))
        .catch(error => onChecked(undefined))
}

/**
 * use https://api.bilibili.com/x/web-interface/archive/like to like a video.
 * @param {string} bvid bvid of the bilibili video.
 * @param {function} onLiked callback function with the input parameter of the 
 * looked up json API return.
 */
export const sendBVLike = (bvid, onLiked = () => {}) => {
    getCookie('https://www.bilibili.com', 'bili_jct')
    .then(promised => {
        fetch('https://api.bilibili.com/x/web-interface/archive/like', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // i dont think this is necessary anymore?
            referrerPolicy: 'unsafe-url',
            origin: "https://www.bilibili.com",
            referer: 'https://www.bilibili.com/video/' + bvid + '/',
            body: new URLSearchParams({
                'bvid': bvid,
                'like': '1',
                'csrf': promised.value,
            })
        })
        .then(res => res.json())
        .then(json => onLiked(json))
        .catch(error => console.error('BVID like POST failed;', error))
    })
}