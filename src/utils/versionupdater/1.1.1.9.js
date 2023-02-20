import { setLocalStorage, FAV_FAV_LIST_KEY, dummyFavList } from '../../objects/Storage';

export default async function () {
    console.debug('1.1.1.9 update: initialize fav-favlist');
    let list = dummyFavList('我的最爱');
    list.info.id = "FavList-Special-Favorite";
    setLocalStorage(FAV_FAV_LIST_KEY, list);
}
