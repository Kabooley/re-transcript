/*
    chrome.storage.localのclass化
    ___________________________________________

    NOTE:
        1. インスタンスにつき一つだけlocalStorageへ保存するためのkeyを登録できる
            なので一つのkeyに対するデータだけ保存できる

        2. ~loadが返すのは{_key: 保存したデータ}であることに注意~
            ~なので保存したデータだけに用がある場合がほとんどだと思うので~
            ~利用する側はそのまま使ってしまわないように注意~
        load()のreturn する値を変更した

    
*/

export class LocalStorage<T> {
    constructor(private _key: string) {}

    private _getLocalStorage(_key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            // chrome.storage.local.get()はPromiseチェーンみたいなもの
            chrome.storage.local.get(_key, (s: T): void => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve(s);
            });
        });
    }

    async save(data: T): Promise<void> {
        try {
            const obj = { [this._key]: data };
            await chrome.storage.local.set(obj);
        } catch (err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {
                console.log(err);
            }
        }
    }

    async load(): Promise<T> {
        try {
            const data: T = await this._getLocalStorage(this._key);
            // return data;
            // 保存されたデータだけを返すようにした
            return data[this._key];
        } catch (err) {
            if (err === chrome.runtime.lastError) {
                console.error(err.message);
            } else {
                console.log(err);
            }
        }
    }
    async clearAll(): Promise<void> {
        await chrome.storage.local.remove(this._key);
    }
}

// -- USAGE --------------
//
// const ls_sectionTitle = new LocalStorage<string>("key_section_title");
// await ls_sectionTitle.save(someStringdata);
// const data = await ls_sectionTitle.load();
