import { setLocalStorage, FAV_FAV_LIST_KEY, dummyFavList } from '../../objects/Storage';

export default async function () {
    console.debug('1.1.1.9 update: initialize fav-favlist')
    setLocalStorage(FAV_FAV_LIST_KEY, dummyFavList('我的最爱'));
}
