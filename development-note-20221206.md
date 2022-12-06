# 開発ノート

## 調査：12/05使ってみたところ、全く動かなくなった件について

確認したエラー：

@contentScript.ts
`ypeError: Cannot read properties of undefined (reading 'innerText') at isSubtitleEnglish (chrome-extension://debgmopjmphdbpddbpmjbncgamhdeoeo/contentScript.js:762:52) at chrome-extension://debgmopjmphdbpddbpmjbncgamhdeoeo/contentScript.js`

ということで`isSubtitleEnglish()`でエラー

次のセレクタがヒットしない模様

`menuList: '.udlite-block-list-item-content'`@utils/selectors.ts::controlBar{}

```JavaScript
// contentScript.ts
const isSubtitleEnglish = () => {
    const listParent = document.querySelector(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuListParent);
    const checkButtons = listParent.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuCheckButtons);
    // ここまではDOMが取得できて
    // menuListは取得できなかった
    const menuList = listParent.querySelectorAll(_utils_selectors__WEBPACK_IMPORTED_MODULE_0__.controlBar.cc.menuList);
    // あとこの条件分岐は正しくない
    // checkButtonsとmenuListはquerySelectorAll()で取得しているので、配列が空かどうかを調べるべきである
    // if (!listParent || !checkButtons || !menuList)
    //     throw new _Error_Error__WEBPACK_IMPORTED_MODULE_3__.DomManipulationError('Failed to manipulate DOM');
    if (!listParent || !checkButtons.length || !menuList.length)
        throw new _Error_Error__WEBPACK_IMPORTED_MODULE_3__.DomManipulationError('Failed to manipulate DOM');
    let counter = 0;
    let i = null;
    const els = Array.from(checkButtons);
    for (const btn of els) {
        if (btn.getAttribute('aria-checked') === 'true') {
            i = counter;
            break;
        }
        counter++;
    }
    if (!i) {
        throw new Error('Error: No language is selected or failed to retrieve DOM');
    }
    const currentLanguage = Array.from(menuList)[i].innerText;
    if (currentLanguage.includes('English') || currentLanguage.includes('英語'))
        return true;
    else
        return false;
};
```

controlBar.cc.menuListは何を指すのかというと...

CCトランスクリプションメニューの字幕言語をラップしている要素である

現在は`div.ud-block-list-item-content`であった。

