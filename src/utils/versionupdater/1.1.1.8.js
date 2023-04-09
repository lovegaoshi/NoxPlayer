import { setLocalStorage, readLocalStorage, MY_FAV_LIST_KEY, dummyFavListFromList } from '../../objects/Storage';

export default async function () {
    console.debug('1.1.1.8 update: new keys are added to playlist/favlist objects.')
    for (const favKey of await readLocalStorage(MY_FAV_LIST_KEY)) {
        setLocalStorage(favKey, dummyFavListFromList(await readLocalStorage(favKey)));
    }

}
