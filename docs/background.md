# background

background.ts の機能説明

ひとまずは思い出すよう

## TODOs

- TODO: 別件だけど。[webpack設定を変更してproductionモードで出力して](#productionモード設定)

## chrome background api

- `chrome.runitme.onInstalled`: 初めてインストールされた又は新バージョンにアップデートされた、またはChromeが新バージョンになった時に発火する
- `chrome.runitme.onMessage`: `runtime.sendMessage`のような拡張機能プロセスか、content scriptからメッセージが送信されたときに発火する
- `chrome.tabs.onUpdated`: タブがアップデートされたら発火する
- `chrome.tabs.onRemoved`: タブが閉じられたときに発火する

他、使うかもなやつら

- `chrome.tabs.onSelectionChanged`: 選択中のタブが同一のwindowの中で切り替わった時発火
- `chrome.tabs.`
- `chrome.tabs.`
- `chrome.tabs.`
- `chrome.tabs.`
- `chrome.tabs.`
- `chrome.tabs.`

## マウント時

## productionモード設定

多分設定区別してない。製品版はminifyとかしたいとなのでproductionモード設定を。

#### [webpack] production

https://webpack.js.org/guides/production/

minification:

`production`モードを指定すればデフォルトでminificationを実行してくれる。

css-minification:



tree-shakingを実行するために：

- ES2015 モジュール構文を使用します (つまり、インポートとエクスポート)。 
- ES2015 モジュール構文を CommonJS モジュールに変換するコンパイラーがないことを確認してください (これは、人気のある Babel プリセット @babel/preset-env のデフォルトの動作です - 詳細についてはドキュメントを参照してください)。 
- プロジェクトの package.json ファイルに「sideEffects」プロパティを追加します。 
- `mode: 'production'`オプションを使用して、縮小やツリーシェイクなどのさまざまな最適化を有効にします (副作用の最適化は、フラグ値を使用して開発モードで有効になります)。
- devtool の一部は運用モードでは使用できないため、devtool に正しい値を設定していることを確認してください。

tree-shakingは不要なコードをあぶりだすための手段で、自動的にあぶりだしたファイルをバンドルに含めないようにしてくれるわけではないので、自分で不要なファイルを確認し、手動でそれらを削除するなりする。

上記を守ったうえで`production`モードでバンドルすると、デッドコード抜きになったminifyされたバンドルコードが生成される。

`side-effect`と`pureness`は対比されたキーワードである。

