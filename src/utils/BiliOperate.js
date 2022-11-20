const getCookie = async (domain, name) => {
    return chrome.cookies.get({ "url": domain, "name": name });
}

export const checkBVLiked = (bvid, onChecked) => {
    fetch('https://api.bilibili.com/x/web-interface/archive/has/like?bvid=' + bvid, {
            credentials: 'include',
            referer: 'https://www.bilibili.com/video/' + bvid + '/',
        })
        .then(res => res.json())
        .then(json => onChecked(json.data))
        .catch(error => onChecked(undefined))
}

export const sendBVLike = (bvid, onLiked) => {
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