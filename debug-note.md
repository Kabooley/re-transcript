# Debug Note

リリース後の問題の対応を記録する

## 目次

[拡張機能が起動しない問題](#拡張機能が起動しない問題)

#### 拡張機能が起動しない問題

原因はいままで`chrome.runtime.onInstalled`で state を起動させていたこと

てっきり chrome web store から配布されるようになったら

毎度 chrome 立ち上げるたびに拡張機能が oninstalled を実行するもんだと思っていた...

そんなことなかった...

なので別で拡張機能をトリガーする方法を模索しなくてはならなくなった。

アイディア：

-   background script で即時関数を実行してそのなかで state を初期化する

-   popup が開かれたときに background script の state を initialize させる

-   それ以外（情報収集）


##### Activate by popup

branch: activatge-by-popup

ブラウザが起動して初めて拡張機能のPOPUPが開かれたときに、拡張機能が起動するようにする

- 毎回POPUPを開くたびに初回起動をされると困る（初回だけ実行するようにする）
- 以降はbackground scriptのstateが起動しているのか確認するようにする
