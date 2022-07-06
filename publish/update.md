# Update Information

## 2022/07/03

Fixed: Activateion process.

`background.ts::chrome.runtime.onInstalled`で`state`を初期化していたが、

当然インストール時以外に初期化できなくなるので、

-   popup を開いたときに未初期化だったら初期化する
-   onRemoved 時に state に modelState を渡すのではなくて state.clearAll()するようにする

と変更した。

これでいつクロームを開いても、閉じても拡張機能を起動できる。
