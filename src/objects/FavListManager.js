export default class FavListManager {
    constructor({ StorageManager, searchList, favLists }) {
        this.StorageManager = StorageManager;
        this.searchList = searchList;
        this.favLists = favLists;
    }
}