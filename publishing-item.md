# Note: Publish my Extension to Chrome Web Store

開発した拡張機能を CWS で頒布するために必要な準備とかを

ここにまとめる

NOTE: まずはアカウント登録!!

## 目次

[ポリシー](#Policies)
[準備するもの](#準備するもの)
[CWS 登録](#CWS登録)
[manifest.json](#manifest.json)
[Internationalization](#Internationalization)
[コピー](#コピー)
[参考](#参考)
[スクリーンショット作成](#スクリーンショット作成)

## Policies

#### google 開発者プログラムポリシー

https://developer.chrome.com/docs/webstore/program_policies/

https://developer.chrome.com/docs/webstore/terms/

-   content policy

コンテンツポリシーは本製品以外にも製品がもたらす広告やホストまたはリンクするユーザ生成コンテンツにも適用される

公開者のアカウントから chrome web store に公開されるすべてのコンテンツにも適用される

セクシャルコンテンツか？

No

暴力またはいじめ行為か？

No

ヘイトスピーチを含むか？

No

暴力的な過激主義か？

No

なりすましまたは欺瞞的な行動をするか？
ユーザを欺いたり誤解を与えるような情報を提供していないか？

No

> 製品の機能を誤って伝えたり、製品の主な目的を果たさない非自明な機能を含めたりしないでください。ユーザーが追加する製品を明確に理解できるように、製品の説明には機能を直接記載する必要があります。

> 商品の説明フィールドが空白であるか、アイコンやスクリーンショットがない場合、商品は拒否されます。製品のコンテンツ、タイトル、アイコン、説明、またはスクリーンショットのいずれかに虚偽または誤解を招く情報が含まれている場合、当社はそれを削除する場合があります。

google chrome の価値基準に違反するような製品でないか？

たとえば動画ダウンローダとか Bot とか

No

特許、商標、企業秘密、著作権、その他の所有権など、他者の知的財産権を侵害しているか？

No

違法行為でないか?

No

賭博性はあるか？

No

規制されているものを販売しようとしていないか？

No

ウィルスなど含む悪意のある製品でないか？

No

コード可読性の要求

> 開発者は、コードを難読化したり、拡張機能の機能を隠したりしてはなりません
> これは、拡張パッケージによってフェッチされたすべての外部コードまたはリソースにも当てはまります。
> 次のフォームを含める限りは、縮小が許可されます。

ホワイトスペース、改行、コードコメント、ブロック区切りの削除
変数名や関数名の短縮
ファイルの折りたたみ

とにかく「隠れて」いなければいいので

自分のものは問題ない

二段階認証の要求

すべての CWS アカウントは 2 段階認証が要求される

Google アカウント標準の 2 段階認証保護を利用することになる

Manifest V3 における追加の要求

> Manifest V3 を使用する拡張機能は、拡張機能のコードに関連する追加要件を満たす必要があります。
> 特に、拡張機能の全機能は、提出されたコードから容易に識別できる必要があります。
> これは、各拡張機能がどのように動作するかのロジックが自己完結している必要があることを意味します。
> 拡張機能は、拡張機能の外部のデータおよびその他の情報ソースを参照およびロードすることができますが、これらの外部リソースはいかなるロジックも含んでいてはいけません。

たとえば

-   `<script>`で拡張機能パッケージ外のリソースを参照する場合
-   `eval()`を使ったリモートリソースをフェッチする行為
-   リモートソースから複雑なコマンドを実行させるようなインタプリタを生成する行為

つかっている外部のリソースといえば Material Ui くらいで

これは完全にただの CSS である

ロジックは関係ない

禁止商品

-   ペイウォールの回避やログイン制限など、Web サイト上のコンテンツへの不正アクセスを促進する 著作権で保護されたコンテンツまたはメディアの不正アクセス
-   ダウンロード、またはストリーミングを奨励、促進、または有効化する
-   暗号通貨

そもそもユーザがログインして購入したコンテンツじゃないと表示さえされないので

これは大丈夫なのでは？

#### ユーザ・プライバシーの扱い

> 拡張機能がアクセスできる API は、マニフェストのパーミッション・フィールドで指定されます。
> 許可されたパーミッションが多ければ多いほど、攻撃者が情報を傍受する手段は増えます。
> 拡張機能が依存する API のみをリストアップし、より侵襲性の低いオプションを考慮する必要があります。拡張機能が要求するパーミッションが少なければ少ないほど、ユーザーに表示されるパーミッションの警告は少なくなります。
> ユーザは警告が少ない拡張機能をインストールする可能性が高くなります。

つまり、

Manifest.json の`permission`に含める API には使うかどうかわからなような

あいまいな API を含めることを良しとせず、

必要十分な API だけにとどめることが望ましいと言っている

そのためのコツ：

-   オプショナル・パーミッションを利用する

https://developer.chrome.com/docs/extensions/mv3/user_privacy/#optional_permissions

機能の実行許可をユーザにゆだねたい場合は、`optional_permissions`を利用しよう

-   最小限のユーザ・データを要求すること

ユーザデータは慎重に扱わなければならない

> ドメインが登録されている安全なサーバーにデータを保存および取得します。
> 拡張機能のストレージは暗号化されていないため、常に HTTPS を使用して接続し、拡張機能のクライアント側に機密性の高いユーザーデータを保持しないようにします。

開発中の拡張機能はこれらのポリシーに抵触しない

そもそもユーザデータは求めない。

ただし、Udemy の字幕を取得し、ローカルストレージに保存するので

ユーザがページから離れたらこれらのデータを間違いなく削除するようにしないと

Udemy からなんか言われるかも....

TODO: ユーザがページから離れたら字幕データを間違いなく削除するようにする

## 準備するもの

https://tech.manafukurou.com/article/chrome-develop-2/

上記のサイトに依れば以下を用意する必要がある

TODO: いまんところすること

-   説明文章の推敲：参考ページを参考にまとめなおす
-   スクリーンショットの準備：Udemy の講義ページを勝手に使うのはご法度なので自作するほかない

-   Google 開発者登録の初回登録料 5$
    済

-   パッケージのタイトル
    `Re Transcript`でおｋ
    ストアに表示されるパッケージのタイトル manifest.json の[name]データがそのまま反映されます

-   パッケージの概要
    済
    [Description\_文章](#Description_文章)の内容を manifest.json に書き込んだ
    ストアに表示されるパッケージのタイトル manifest.json の[description]データがそのまま反映されます

-   説明
    [拡張機能説明文章](#拡張機能説明文章)の文章をそのまま
    アイテムの紹介。ストア画面では上の概要の下に表示されます。

    [参考](#参考)の Google 拡張機能のページを参考に説明文章を推敲のこと

-   カテゴリ
    chrome ウェブストアのどのカテゴリに並ぶかを指定出来ます。

-   言語
    NOTE: 日本語で
    言語です。複数の言語に対応している場合は、アイテムを国際化する必要があります

-   ショップ アイコン
    済：
    128×128 ピクセル

-   全言語向けアセット
    ない
    プロモーション用の動画を設定出来ます。 Youtube の url を設定出来ます。

-   スクリーンショット
    NOTE: 要準備
    指定できるのは 5 枚までです  1280×800  または  640×400 JPEG または 24 ビット PNG（アルファなし） 少なくとも 1 枚指定してください

-   プロモーション タイル（小)
    440×280  キャンバス JPEG または 24 ビット PNG（アルファなし）

-   プロモーション タイル（大）
    920×680  キャンバス JPEG または 24 ビット PNG（アルファなし）

-   マーキー プロモーション タイル
    1400×560  キャンバス JPEG または 24 ビット PNG（アルファなし）

-   公式 URL
    Google Search Console  から関連している url を選択できる形です。

-   ホームページ URL
    無い
    NOTE: Github ページでも公開するかい？
    アイテムに関する Web サイトのリンク

-   サポート URL
    無い
    サポート用の URL です

-   成人向けコンテンツ
    NO
    成人向けかどうか設定します

-   Google Analytics ID
    NO
    Google Analytics の管理ツールを利用している場合は、 アカウントの ID を設定する事で連携が出来ます

プライバシー

-   単一用途
    拡張機能の用途は、単一で範囲の限られたわかりやすいものである必要があります
-   リモートコードを利用していますか？
    外部の JS や CSS のファイルを読み込んでいるか確認します。もし利用している場合には利用している理由も記述する必要があります。

価格と提供内容

-   公開設定： 公開・限定公開・非公開を設定出来ます
-   販売地域： どの国でアイテムを販売するかを指定出来ます。

## CWS 登録

https://developer.chrome.com/docs/webstore/register/

拡張機能を登録する前に、CWS 開発者アカウントを登録する必要があるよ。

必要なもの：

-   $5 の初回登録料
-   専用の Email アドレス

Email の性格：

-   重要な案内を送信する場合があるし、専用のメールアドレスにしないと都合によってはそのメールアドレスを削除したい場合もあるだろうし、新しいメールアドレスを登録するのをおすすめするよ

-   定期的にこのメールボックスを確認してください。重要な案内を受信している可能性があります

-

## manifest.json

```JSON
{
    "manifest_version": 3,
    // Udemyという単語は商標登録されている可能性があるので用いない
    "name": "Re Transcript",
    // versionは細かく刻む必要があるとのことで0.0.0.1
    "version": "0.0.0.1",

    "action": {
        "default_title": "re-transcript",
        "default_popup": "popup.html",
        "default_icon": "re-transcript-128.png"
    },
    // descriptionは132文字以下の、chrome://extensions上とCWSでの表示に用いられる
    // 日本語を表示させるには

    "description": "Chrome extension for Udemy user who need correct translation of sentences",
    "icons": {
        "16": "re-transcript-16.png",
        "48": "re-transcript-48.png",
        "128": "re-transcript-48.png"
    },
    "background": {
        "service_worker": "background.js",
        "type": "module"
    },
    "permissions": [
        "search",
        "tabs",
        "storage",
        "tts",
        "activeTab",
        "scripting"
    ],
    "content_security_policy": {},
    "content_scripts": []
}

```

## Internationalization

ん～とりあえず後回しでいいです

日本語で提出して、もしも文字化けとかしたりしたら対応するということで

https://developer.chrome.com/docs/extensions/reference/i18n/

https://developer.chrome.com/docs/webstore/i18n/#:~:text=You%20can%20follow%20these%20steps,your%20extension's%20name%20and%20description.

`chrome.i18n`を使って英語以外の言語を利用可能にする

拡張機能内での UI 言語を、あらかじめ用意した言語設定を導入することによって

一括で変更することができるらしい...

その方法

WATCH: ぶっちゃけいまのところ、CWS での表示言語を日本語にできればそれでいい

利用可能な言語

https://developer.chrome.com/docs/webstore/i18n/#choosing-locales-to-support

`ja`で日本語

## コピー

TODO: Description 用に拡張機能説明文章を 132 文字以内に要約すること

#### 拡張機能説明文章

一旦、ストアで表示する文章を作ってみる

そのあとで要約分を Description に登録する

---

Udemy の英語動画で学習中の皆さん。

英語が苦手な場合、

貴方は Chrome 拡張機能の Google 翻訳を利用して、英語字幕を翻訳させながら学習している場合があると思います。

Google 翻訳アプリなどの翻訳拡張機能は英語が苦手な人にも、Udemy の英語動画で学習をするチャンスをもたらしてくれました。

しかし、翻訳内容が、ときどき講師がしゃべっている内容となんだか違うと感じたことがありませんか。

その理由は明確で、翻訳アプリは文章の頭からピリオドまでを一つの文章として翻訳しているわけではなくて、

web ページの HTML の都合で分割された文章の一部を一塊として認識し、それぞれ別個に翻訳しているからなのです。

たとえば、

元の文章：

> All right, can move the decorator back to pilot, so when we ran this file, we had the decorator on

> pilot and that's why we saw it inside of our output's.

訳：

> 了解しました。デコレータをパイロットに戻すことができるので、このファイルを実行すると、デコレータがオンになりました。

> パイロットであり、それが私たちが出力の中にそれを見た理由です。

一方、字幕の分割箇所をなくすと先の翻訳と異なります

分割をなくした文章：

> All right, can move the decorator back to pilot, so when we ran this file, we had the decorator on pilot and that's why we saw it inside of our output's.

訳：

> 了解しました。デコレータをパイロットに戻すことができるので、このファイルを実行すると、デコレータがパイロットになり、出力内にデコレータが表示されました

意味が異なりますね。

例えば Google 翻訳拡張機能も、分割された文章を別個の文章として捉え翻訳します。

しかし文章の分割場所によっては翻訳内容が全く異なります。

Udemy の英語字幕をそのまま翻訳拡張機能を使って翻訳するだけだと、

このままではよくわからない字幕をみることになったり、

最悪全く反対の意味の字幕になる可能性があります。

これでは何のための翻訳かわかりませんね。

貴方はこのことを知っているから、いままで字幕文章をコピー＆ペースとして

文章を調整してくれるサービスを使ってから翻訳サービスを使って翻訳するといった

大変な遠回りをしてきたかもしれません。

しかし安心してください。もうその必要はありません。

この拡張機能「Re Transcript」は、そんな問題を解決します。

Udemy の字幕を再構成して、

字幕を文章の開始からピリオドまでの一つの文章になるように作り直します。

先の例ならば、次のように字幕を再構成します。

再構成後：

> All right, can move the decorator back to pilot, so when we ran this file, we had the decorator on pilot and that's why we saw it inside of our output's.

文章が途中で分割されずに一塊になってくれるので、

Google 翻訳などの翻訳機能ですぐさま本来の一塊の文章を翻訳してくれます。

この Re Transcript を使えば、

コピー＆ペーストなど煩わしい遠回り作業から解放され、

よくわからない翻訳文章に惑わされることなく、

## 数クリックで快適に Udemy の英語動画を学習することができるようになります。

#### ご利用方法

本拡張機能の機能を提供するためのルールがございます。

1. 字幕を ON にして、字幕言語は英語を選択する
2. トランスクリプト機能を ON にする
3. １、２を終えたら、ツールバー上のアイコンをクリックし、実行ボタンをクリックする

OK、これだけです！

トランスクリプトが「ExTranscript」となれば実行完了！

あとはお好みの翻訳拡張機能を使ってそのページを翻訳して、すぐさま学習に戻りましょう！

ページの切り替わりなどで次の動画へ移っても、特に操作は必要ありません。

自動で再取得するので、拡張機能を意識せず学習に専念できます。

#### 提供機能

次の機能を提供します。

-   Udemy のトランスクリプトの英語字幕を、文章の始まりからピリオドまたは？までの文章になるように再構成します。

Udemy のトランスクリプトの本来の機能は一部を除いてほぼそのままご利用いただけます。

本拡張機能は、翻訳機能を提供するものではありません。Udemy のトランスクリプトの字幕を再構成する機能だけです。

詳しくは仕様をご覧ください。

#### 仕様

Re Transcript は、Udemy の英語字幕のトランスクリプトを再構成します。

そのため、次のような制約があります。

-   字幕言語は英語を選択しないとご利用できません。
-   トランスクリプト機能が ON でないと利用できません。

なので例えば、シアターモードなどを利用する、またはウィンドウサイズを最小にするなどして、トランスクリプトが表示されない状態になると、拡張機能も提供されません。

-   トランスクリプト機能を拡張するので、トランスクリプト上の字幕だけを再構成します。動画上に表示される字幕は本来のままです。

また次のような制約もあります

-   英語字幕以外を選択している場合、ご利用いただけません。

-   Udemy が本来提供している、「トランスクリプト上の字幕リンクをクリックすると、動画のシークバーがその字幕が表示される時間までジャンプする機能」はご利用いただけません。

Google 翻訳などの翻訳アプリと連動してご利用になる場合の注意です。

-   本拡張機能を実行してから、翻訳機能をご利用になるようお願いいたします。

常に英語文章を取得することを前提としておりますので、すでに他拡張機能などで翻訳済の文章を取得することは想定しておりません。

-   翻訳アプリが英語を翻訳するスピードによっては、ページの切り替わり時などで本拡張機能が提供する字幕文章の一番初めの塊が、稀に長くなる場合があります。

他、

-   本拡張機能は翻訳精度を上げるなど翻訳機能を提供するものではありません

あくまで、文章の始まりからピリオドまでの文章を一塊として再構成する機能を提供するのみです。
翻訳機能は Google 翻訳など他の拡張機能サービスをご利用ください。

#### Description\_文章

NOTE: 132 文字以内

`Udemyのトランスクリプト上の英語字幕を再構成して、字幕文章を文章の始まりからピリオドまでの一塊に作り直します。お好みの翻訳拡張機能とともに使用して、快適にUdemyの英語動画を学習しましょう！`

長い！

`Udemyのトランスクリプト上の英語字幕を再構成して、正確な翻訳出力を助けます。好みの翻訳拡張機能とともに使用してください`

念のため、変更前の情報をここに残す

```JSON
{
    "description": "Chrome extension for Udemy user who need correct translation of sentences",
}
```

#### 例抽出

元の文章：

All right, can move the decorator back to pilot, so when we ran this file, we had the decorator on

pilot and that's why we saw it inside of our output's.

誤訳：

了解しました。デコレータをパイロットに戻すことができるので、このファイルを実行すると、デコレータがオンになりました。

パイロットであり、それが私たちが出力の中にそれを見た理由です。

正しい訳：

了解しました。デコレータをパイロットに戻すことができるので、このファイルを実行すると、デコレータがパイロットになり、出力内にデコレータが表示されました

意味が異なりますね。

例えば Google 翻訳は、分割された文章を一塊として翻訳します。

しかし文章の分割場所によっては翻訳内容がまったくことなります。

## 参考

CWS の参考

1. Google 翻訳拡張機能：

https://chrome.google.com/webstore/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb?hl=ja

2. Momentum

https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=ja

説明文章が参考になるかも

概要説明
機能（チェックマーク）
売り込みポイント（☆ マーク）
プライバシーとセキュリティに関しての説明
SNS への案内

```
Replace new tab page with a personal dashboard featuring to-do, weather, and inspiration.
What if every new tab could calm your mind and increase your focus?

Achieve your goals faster and more consistently with your own personal dashboard. Featuring to-do lists, weather, daily photos, and encouraging quotes.

Join over 3 million energized users who have levelled-up their workspace and day-to-day productivity with Momentum.

☆☆☆ Featured in Tim Ferriss’ Tools of Titans, WWDC21, The Wall Street Journal, Product Hunt, Lifehacker, BuzzFeed, and TheDailyMuse! ☆☆☆

☆☆  Key Features ☆☆

✓ New inspiring photo, quote, and mantra each day
✓ Friendly reminders of your most important task
✓ Easy to use to-do list manager
✓ Shortcuts to your favorite websites and apps
✓ Local weather info
✓ Google/Bing/DuckDuckGo search options
✓ Customizable — show/hide features as you like
✓ Private and secure — we don’t share or sell your data

Transform your screen to the gorgeous dashboard that keeps you on track.

Note: For the best experience, after installing Momentum click the ‘Keep it’ button on the ‘Change back to Google’ notification. This will show Momentum on each new tab as intended. 🙂

☆☆ Do More With Plus: 11 Fresh Features to Maximize Your Workspace ☆☆
Momentum Plus offers additional productivity tools to support positive workflows and increase focus.

★ NEW: Soundscapes
Get in the flow with our focus-driving audio, including: a crackling campfire, peaceful rain, café ambience, and seven other scenes!

★ Pomodoro Timer
Organize your day into timed intervals of focused work sessions and short breaks.

★ Todo integrations
Connect your favorite task provider to quickly update your tasks on each new tab. Asana, Trello, Todoist, Microsoft To Do, Google Tasks, GitHub, Bitbucket, & Basecamp 3.

★ Autofocus mode
Always see your top task front and center. Completing your focus replaces it with the next task on your to-do list.

★ Metrics
Track the progress your making towards personal and professional milestones.

★ Countdowns
Count down the days left until upcoming events and due dates.

★ World Clocks
Leave the time zone conversion to us! Add other time zones right on your dashboard.

★ Custom Photos, Quotes, & Mantras
Personalize your dashboard with the content that inspires you most. Skip and change the content whenever you want.

★ Notes
Jot down important reminders or start that novel with our fullscreen note editor.

★ Multi-Todo list
Create more lists to organize your tasks however you like.

★ Extra weather info
Get more detailed weather info with an hourly forecast, air quality, chance of rain, and more.


☆☆ Privacy & Security ☆☆
We at Momentum are committed to protecting your privacy. The information we gather or process is used solely for core functionality of Momentum and to improve the quality and security of our service. Your information isn’t and has never been sold to third parties.

For more information on privacy and the security of your data visit https://momentumdash.com/privacy.

☆☆ Help & Contact ☆☆
Help Center: https://momentumdash.help
Suggestions: https://momentum.nolt.io/
Contact us: https://momentumdash.com/contact

☆☆ Social Pages ☆☆
Blog: https://momentumdash.com/blog
Instagram: https://instagram.com/momentumdash
Twitter: https://twitter.com/momentumdash
Facebook: https://facebook.com/momentumdash
```

## スクリーンショット作成

TODO:

-   何を載せれば伝わるのか検討
-   Udemy のページを模した画像の作成
-   権利・価格フリーの画像を手に入れる方法

Figma で作ることにした...

## POPUP 改善

-   文章を日本語に: 済
-   アイコン表示：解決

微調整：

-   実行中のときと実行前だと POPUP の高さが異なるのでこれを統一させる

    body height: 200px になるようにする

    42
    34

    44.5
    36.5
    fs 0.875rem
    lh 1.75
    つまり 2.5px 差あるはず

-   ICON に影をつけたいけど、アイコンの枠が丸見えになってしまう

    これは断念して影をつけないことにした

## 字幕文章生成

Stephan コースのトランスクリプトを少し拝借...

以下、画面サイズから見える範囲のトランスクリプト文章

(リビルド前)

```
We could then in theory, somehow provide that source code off to us build and it could use it during

the bundling process.

But as I mentioned twice now, unfortunately, we're not going to build a reach out directly to NPM

to download those archives, all for a very simple reason.

I'm back inside my browser at localhost three thousand.

I'm going to open up my console while on the network tab.

Remember, you can press escape to open up that console and I'm going to try to directly download that

same archive that we downloaded in the last video by using some JavaScript code inside of here.

So to do so, I'm going to put in fetch paste in that link like so and run it.

So in theory, that should download that archive.

We are going to have an archive.

```

```
その後、理論的には、そのソースコードをビルドに提供し、その間に使用することができます。

バンドルプロセス。

しかし、今2回述べたように、残念ながら、NPMに直接連絡することはありません。

これらのアーカイブをダウンロードするには、すべて非常に単純な理由があります。

私はローカルホスト3000で私のブラウザの中に戻ってきました。

[ネットワーク]タブでコンソールを開きます。

覚えておいてください、あなたはそのコンソールを開くためにエスケープを押すことができます、そして私はそれを直接ダウンロードしようとします

ここでJavaScriptコードを使用して前回のビデオでダウンロードしたものと同じアーカイブ。

そのために、そのリンクにフェッチペーストを挿入して実行します。

したがって、理論的には、そのアーカイブをダウンロードする必要があります。

アーカイブを作成します。

```

リビルド後

```
We've now seen that if we could somehow download that source code or that raw archive into the browser when we were doing this bundling, we could then get all the source code required for react.

We could then in theory, somehow provide that source code off to us build and it could use it during the bundling process.

But as I mentioned twice now, unfortunately, we're not going to build a reach out directly to NPM to download those archives, all for a very simple reason.

I'm back inside my browser at localhost three thousand.

I'm going to open up my console while on the network tab.

Remember, you can press escape to open up that console and I'm going to try to directly download that same archive that we downloaded in the last video by using some JavaScript code inside of here.

So to do so, I'm going to put in fetch paste in that link like so and run it.

So in theory, that should download that archive.
```

```
バンドルする際にソースコードや生のアーカイブをブラウザにダウンロードできれば、reactに必要なすべてのソースコードを入手できることがわかりました。

そして理論的には、そのソースコードをビルドに提供し、バンドルプロセスでそれを使用することができるのです。

しかしこれまで2回お話ししたように、残念ながら、私たちはアーカイブをダウンロードするためにNPMに直接アクセスするようなビルドをするつもりはないんです。

私はlocalhost 3000のブラウザの中に戻っています。

ネットワークタブでコンソールを開いてみます。

前回のビデオでダウンロードしたのと同じアーカイブを、この中のJavaScriptのコードを使って直接ダウンロードしようと思います。

そうするために、このリンクに fetch paste を入れて実行します。

理論的には、これでアーカイブがダウンロードされるはずです。
```

翻訳文章を翻訳させてみた

```
NOTE: この文章をリビルドされた文章として扱う

We have found that if we could download that source code or that raw archive into the browser when we were bundling, we could then get all the source code we need for react.

We could then, in theory, provide that source code to us build and it could use it during the bundling process.

But as I've told you twice before, unfortunately we're not going to build where we have to go directly to NPM to download the archive.

I am back inside the browser on localhost 3000.

I am going to open the console in the network tab.

I'm going to download the same archive that I directly downloaded in the last video by using these JavaScript code inside of here.

To do so, we will type fetch and paste this link into it like this and run it.

In theory, this should download that archive.

```

これをさらに翻訳させてみる

```
NOTE: この文章はリビルド後の翻訳済の文章として使用する

バンドルする際に、ソースコードや生のアーカイブをブラウザにダウンロードすれば、reactに必要なすべてのソースコードを入手できることがわかりました。

理論的には、そのソースコードを私たちビルドに提供すれば、バンドルプロセスでそれを使用することができます。

しかし、これまで2回お話ししたように、残念ながら、アーカイブをダウンロードするために直接NPMに行かなければならないようなビルドをするつもりはないんです。

localhost 3000のブラウザの中に戻ってきました。

ネットワークタブのコンソールを開いてみます。

前回のビデオで直接ダウンロードしたのと同じアーカイブを、この中のJavaScriptコードを使ってダウンロードしようと思います。

そのためには、fetchとタイプして、このリンクをこのように貼り付けて、実行します。

理論的には、これでそのアーカイブをダウンロードできるはずです。

```

うんうん意味は通っている

なおかつ丸パクリの字幕にはならないね

```
NOTE: この文章をリビルドする前の文章として扱う


We have found that if we could download that source code or that raw archive into the browser when we were bundling, we could then get all the source code we need for react.

We could then, in theory, provide that source code to us build and it could use it during

the bundling process.

But as I've told you twice before, unfortunately we're not going to build where we have to go directly to NPM

to download the archive.

I am back inside the browser on localhost 3000.

I am going to open the console in the network tab.

I'm going to download the same archive that I directly downloaded in the last video

by using these JavaScript code inside of here.

To do so, we will type fetch and paste this link into it

like this and run it.

In theory, this should download that archive.
```

```
NOTE: この文章は、リビルドする前の文章を翻訳したときのものとして使用する

バンドルする際に、ソースコードや生のアーカイブをブラウザにダウンロードすれば、reactに必要なすべてのソースコードを入手できることがわかりました。

次に、理論的には、そのソースコードをビルドに提供し、

バンドルプロセス。

しかし、前に2回お話ししたように、残念ながら、NPMに直接アクセスする必要がある場所を構築することはありません。

アーカイブをダウンロードするために。

ローカルホスト3000のブラウザに戻ってきました。

ネットワークタブでコンソールを開きます。

前回のビデオで直接ダウンロードしたものと同じアーカイブをダウンロードします

ここでこれらのJavaScriptコードを使用します。

そのためには、fetchと入力し、このリンクを貼り付けます

このようにそして実行します。

理論的には、これでそのアーカイブがダウンロードされます。
```

    color: #1c1d1f;
