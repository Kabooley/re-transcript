# Update Information

## 2022/07/03 ver0002

Fixed: Activateion process.

`background.ts::chrome.runtime.onInstalled`で`state`を初期化していたが、

当然インストール時以外に初期化できなくなるので、

-   popup を開いたときに未初期化だったら初期化する
-   onRemoved 時に state に modelState を渡すのではなくて state.clearAll()するようにする

と変更した。

これでいつクロームを開いても、閉じても拡張機能を起動できる。

## 2022/07/09 ver0003

-   拡張機能展開中の window またはタブを閉じたときに、background.ts で state.set(baseModel)じゃなくて state.clearAll()するようにした
-   ver0002 が承認拒否されたので違反項目を手探りで修正した(spam policy)
-   不要なファイルが含まれていたのでそれらを削除した

## 2022/12/07 ver0005

- セレクタの更新: controlBar.cc.menuListのCSSセレクタの変更に対応した