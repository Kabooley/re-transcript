# Note: Publish my Extension to Chrome Web Store

開発した拡張機能を CWS で頒布するために必要な準備とかを

ここにまとめる

NOTE: まずはアカウント登録!!

## 目次

[タスク](#タスク)
[ポリシー](#Policies)
[準備するもの](#準備するもの)
[CWS 登録](#CWS登録)
[manifest.json](#manifest.json)
[Internationalization](#Internationalization)
[コピー](#コピー)
[参考](#参考)
[スクリーンショット作成](#スクリーンショット作成)
[アップロードしてみた](#アップロードしてみた)

## タスク

-   TODO: 公開用メールアドレス
-   TODO: 公開用氏名
-   TODO: コード中の迂闊なコメントの削除
-   TODO: プライバシー・ポリシーの不要な部分をカットすべきか
-   TODO: Material-UI を使っていることを明言すべきか？
-   TODO: 公開前にコードの見直し（デバグの都合で変更した部分・英語表記の部分など）
-   TODO: 公開目にコードの見直し（webpack で出力しているファイルを現実のものに近づける）
-   プロモーションタイルとは？を調べる

## Policies

[開発者プログラムポリシー](#開発者プログラムポリシー)
[プライバシーポリシー](#プライバシーポリシー)
[プライバシーポリシーページを作成する](#プライバシーポリシーページを作成する)

#### 開発者プログラムポリシー

https://developer.chrome.com/docs/webstore/program_policies/

https://developer.chrome.com/docs/webstore/terms/

NOTE: 結論から言うとすべてクリアである。

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

#### プライバシーポリシー

https://developer.chrome.com/docs/webstore/user_data/

NOTE: 結論から言うと、個人情報も取得しないし機密情報も取得しない。

しかし次は明記すべき。

-   個人情報・機密情報は取得・使用・送信・共有はしないこと
-   ユーザのブラウザのローカルストレージを使用して、Udemy の字幕を一時的に保存すること
-   ページを離れたらそのデータはローカルストレージから削除されることは明記すべき。

Q: ユーザデータを処理する(Handle)とはどういう意味か？
A: ユーザデータを収集、送信、使用、共有を意味する。

次のような処理を含む場合。

-   ログイン処理がある
-   個人情報を入力するフォームがある
-   ユーザが訪れたウェブサイトの内容を読み取る行為
-   web リクエストからデータを読み取る行為

私の開発した拡張機能はいずれも抵触しない。

Q: 個人情報や機密データとはどいう言ったたぐいのものですか？
A: 次のようなもの

-   個人を特定しうる情報
-   金融・支払い情報
-   健康情報
-   NOTE:ウェブサイトのコンテンツとリソース
-   フォームデータ
-   ブラウジング履歴
-   個人的なコミュニケーションとユーザが作り出したコンテンツ

ユーザの Udemy 講座の字幕データは取得するけど、それは利用者のローカルストレージに一時的に保存されるだけで、開発者が収集するわけではないし、第 3 者に提供するわけでもない

と書いた方がいいね

Q: 私の製品は個人情報も機密情報にも手を出さないのだけれど？
A: 次の通り。

> **ユーザーデータポリシーに基づく特別な義務や新たな義務はありません。プライバシーポリシーに、ユーザーデータを扱っていないことを明記してください。**

Q: 個人情報や機密情報にアクセスする場合は？
A: 次の通り。

> -   Chrome ウェブストアデベロッパーダッシュボードにプライバシーポリシーを投稿し、 最新の暗号化を介した送信を含め、ユーザーデータを安全に処理します。
>     個人データまたは機密ユーザーデータの特定の使用は追加の要件の対象となるか、禁止されているため、ポリシーと他の FAQ への回答をお読みください。

Q: 私の製品のプライバシーポリシーには何を書けばいいの？
A: 次の通り。

> 少なくとも、プライバシーポリシーは通常、開発者がデータを収集、使用、および開示する方法を示します。プライバシーポリシーは、情報セキュリティ慣行などの追加のトピックに頻繁に対処します。ユーザーがデータにアクセス、変更、または削除する方法。ユーザーのデータが保持される期間。プライバシーポリシーの草案を作成する方法について法的なアドバイスを提供することはできませんが、以下のいくつかのポイントを提案して、あなたの考えを導きます。

> -   どんな情報を収集するのか
> -   情報をどんなことに使うのか
> -   何の情報を共有するのか

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

## プライバシーポリシーページを作成する

参考：

https://qiita.com/eneko0513/items/3f953405e0cb54ba2903

個人情報も機密情報も収集しないのでとっても簡単なものでいいけれど
あれば安心。

参考のページを参考にして github pages が無料で使えるならそれでよし。

使えないなら CWS の説明文章で済ませる。

Githubpages はパブリックリポジトリが必要だから...

...やっぱり CWS の説明文章で済ませればよくない？

ひとまずひな形：

```markdown
# Privacy policy for Chrome extensions developed by test

## Chrome 拡張のプライバシーポリシー

本プライバシーポリシーは、test（以下、「当開発者」）が開発した GoogleChrome の拡張機能(Extension)(以下、「拡張機能」とします。)の利用において、利用者の個人情報もしくはそれに準ずる情報を取り扱う際に、当開発者が遵守する方針を示したものです。

### 基本方針

当開発者は、個人情報の重要性を認識し、個人情報を保護することが社会的責務であると考え、個人情報に関する法令を遵守し、拡張機能で取扱う個人情報の取得、利用、管理を適正に行います。

### 適用範囲

本プライバシーポリシーは、当開発者が開発した拡張機能においてのみ適用されます。

### 個人情報の取得と利用目的

当開発者は、個人情報を収集する機能を要した拡張機能を公開しません。
**ただし、一部個人情報を利用者のブラウザの LocalStorage に保存します。**

#### 取得方法

拡張機能内に、個人情報の入力フォームを表示します。
フォームに入力された内容は、ブラウザ内の LocalStorage に保存されます。

#### 利用目的

##### 利便性の向上

拡張機能では、機能の内容により、下記の情報を**「ブラウザの LocalStorage」へ保存します**

-   拡張機能で用いるログイン ID
-   拡張機能で用いるログインパスワード
-   その他拡張機能上に入力されたテキスト内容

これにより、拡張機能の次回利用時などにログイン情報が自動的に入力されるため手間を省くことが可能になり、利便性が向上します。
**個人情報は当開発者に送信されず拡張機能利用者のブラウザの LocalStorage に保存されます**

##### 保存期間について

拡張機能内でデータの扱いとして、LocalStorage を使用します。
LocalStorage には保存期間が存在しないためデータの保存期間は拡張機能のアンインストール時までとします。

#### 個人情報の取り扱いの同意について

当開発者が開発を行った拡張機能では、拡張機能のインストールを行う前に、当プライバシーポリシーをご一読頂くようにお願いします。
インストールをされた時点で、当プライバシーポリシーに同意されたとみなします。

#### Cookie による個人情報の取得

拡張機能では、Cookie を利用することがあります。
Cookie（クッキー）とは、ウェブサイトを利用したときに、ブラウザとサーバーとの間で送受信した利用履歴や入力内容などを、訪問者のコンピュータにファイルとして保存しておく仕組みです。

##### 利用目的について

拡張機能の利用者の利便性を向上するために活用します。
ログイン処理や画面遷移を拡張機能から行う際に、Cookie を活用することでユーザーの手間を省いてデータの処理が可能となります。
なお、拡張機能ではプライバシー保護のため、拡張機能の目的とする情報以外の Cookie を送信しません。

##### 保存期間について

Cookie の保存期間は利用者のブラウザーにて設定されているデフォルトの期間保存されます。

### 個人情報の管理

当開発者は、拡張機能内における個人情報の管理について、以下を徹底します。

#### 情報の正確性の確保

利用者が入力したデータにおいて、常に正しい情報を保持します。

#### 安全管理措置

拡張機能において、情報の漏洩、滅失を防止するために拡張機能内において利用目的外のサーバーへの情報送信を行いません。

#### 個人情報の第三者への提供について

当開発者の開発する拡張機能は、利用者から提供いただいた個人情報を、訪問者本人の同意を得ることなく第三者に提供することはありません。
また、今後第三者提供を行うことになった場合には、提供する情報と提供目的などを提示し、訪問者から同意を得た場合のみ第三者提供を行います。

#### 問い合わせ先

拡張機能、又は個人情報の取扱いに関しては、下記のメールアドレスにてお問い合わせください。

メールアドレス：test@test.com

## 策定日

令和 x 年 y 月 zz 日　策定
```

## 準備するもの

https://tech.manafukurou.com/article/chrome-develop-2/

上記のサイトに依れば以下を用意する必要がある

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
    済: 今後アップデートする必要があるとは思うけど、十分かと

    [拡張機能説明文章](#拡張機能説明文章)の文章をそのまま
    アイテムの紹介。ストア画面では上の概要の下に表示されます。

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
    済
    ./pulish-items に用意した

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

        条件は満たしているはず。

    > 拡張機能の用途は、単一で範囲の限られたわかりやすいものである必要があります

-   リモートコードを利用していますか？

    NOTE: 使用している。Material UI。利用しているのは単純に秀逸なデザインを手っ取り早く取得したかったからである。それだけ。

> 外部の JS や CSS のファイルを読み込んでいるか確認します。もし利用している場合には利用している理由も記述する必要があります。

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

内容は以下の通りで十分かと...

-   [概要](#概要)
-   [ご利用方法](#ご利用方法)
-   [提供機能](#提供機能)
-   [仕様と制限](#仕様と制限)
-   [プライバシー・ポリシーとセキュリティ](#プライバシー・ポリシーとセキュリティ)

#### 概要

Udemy のトランスクリプトの英語字幕を、文章の始まりからピリオドまたは？まで一塊の文章になるように再構成された新たなトランスクリプトを提供します。

この拡張機能は、Udemy の英語動画で学習中の方へ向けて開発されました。

もしも貴方が英語が苦手な場合、

貴方は Chrome 拡張機能の Google 翻訳を利用して、英語字幕を翻訳させながら学習している場合があると思います。

Google 翻訳などの翻訳拡張機能は英語が苦手な人にも、Udemy の英語動画で学習をするチャンスをもたらしてくれました。

しかし、翻訳内容が、ときどき講師がしゃべっている内容となんだか違うと感じたことがありませんか。

その理由は明確で、翻訳アプリは文章の頭からピリオドまでを一つの文章として翻訳しているわけではなくて、

web ページの HTML の都合で分割された文章の一部を一塊として認識し、それぞれ別個に翻訳しているからなのです。

たとえば、

元の文章：

> All right, can move the decorator back to pilot method, so when we ran this file, we had the decorator on

> pilot method and that's why we saw it inside of our output's.

訳：

> 了解しました。デコレータをパイロットメソッドに戻すことができるので、このファイルを実行すると、デコレータがオンになりました。

> パイロットメソッドであり、それが私たちが出力の中にそれを見た理由です。

一方、字幕の分割箇所をなくすと先の翻訳と異なります

分割をなくした文章：

> All right, can move the decorator back to pilot method, so when we ran this file, we had the decorator on pilot method and that's why we saw it inside of our output's.

訳：

> 了解しました。デコレータをパイロットに戻すことができるので、このファイルを実行すると、デコレータがパイロットメソッドになり、出力内にデコレータが表示されました

意味が異なりますね。

例えば Google 翻訳拡張機能も、分割された文章を別個の文章として捉え翻訳します。

しかし文章の分割場所によっては翻訳内容が全く異なります。

Udemy の英語字幕をそのまま翻訳拡張機能を使って翻訳するだけだと、

このままではよくわからない字幕をみることになったり、

最悪全く反対の意味の字幕になる可能性があります。

これではかえって学習の妨げになりかねませんね。

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

数クリックで快適に Udemy の英語動画を学習することができるようになります。

#### ご利用方法

☆ ご利用方法

本拡張機能の機能を提供するためのルールがございます。

1. 字幕機能を ON にして、字幕言語は英語を選択します
2. トランスクリプト機能を ON にします
3. １、２を終えたら、ツールバー上のアイコンをクリックし、実行ボタンをクリックする

OK、これだけです！

トランスクリプトが「ExTranscript」となれば実行完了

あとはお好みの翻訳拡張機能を使ってそのページを翻訳して、すぐさま学習に戻りましょう！

ページの切り替わりなどで次の動画へ移っても、特に操作は必要ありません。

自動で字幕を再取得するので、拡張機能を意識せず学習に専念できます。

#### 提供機能

☆ 提供機能

次の機能を提供します。

-   Udemy のトランスクリプトの英語字幕を、文章の始まりからピリオドまたは？まで一塊の文章になるように再構成された新たなトランスクリプトを提供します。

Udemy のトランスクリプトの本来の機能は**一部を除いて**ほぼそのままご利用いただけます。

本拡張機能は、翻訳機能を提供するものではありません。Udemy のトランスクリプトの字幕を再構成する機能だけです。

詳しくは仕様をご覧ください。

#### 仕様と制限

☆ 仕様と制限

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

-   実行順序として、本拡張機能を実行してから翻訳機能をご利用になるようお願いいたします。

常に英語文章を取得することを前提としておりますので、すでに他拡張機能などで翻訳済の文章を取得することは想定しておりません。

-   翻訳アプリが英語を翻訳するスピードによっては、ページの切り替わり時などで本拡張機能が提供する字幕文章の一番初めの塊が、稀に長くなる場合があります。

- 2つ以上のタブで本拡張機能を実行することができません。必ず一つだけのタブで実行してください。

他、

-   本拡張機能は翻訳精度を上げるなど翻訳機能を提供するものではありません

あくまで、文章の始まりからピリオドまでの文章を一塊として再構成する機能を提供するのみです。
翻訳機能は Google 翻訳など他の拡張機能サービスをご利用ください。

#### プライバシー・ポリシーとセキュリティ

TODO: 他、公式のプライバシーポリシーのページを見て必要なものを追加。

```markdown
# Privacy policy for Chrome extensions developed by test

## Chrome 拡張のプライバシーポリシー

#プライバシーポリシー

本プライバシーポリシーは、
TODO: 氏名（以下、「当開発者」）が開発した GoogleChrome の拡張機能(Extension)(以下、「拡張機能」とします。)の利用において、利用者の個人情報もしくはそれに準ずる情報を取り扱う際に、当開発者が遵守する方針を示したものです。

### 基本方針

当開発者は、個人情報の重要性を認識し、個人情報を保護することが社会的責務であると考え、個人情報に関する法令を遵守し、拡張機能で取扱う個人情報の取得、利用、管理を適正に行います。

### 適用範囲

本プライバシーポリシーは、当開発者が開発した拡張機能においてのみ適用されます。

### 個人情報の取得と利用目的

当開発者は、個人情報を収集する機能を要した拡張機能を公開しません。
そのため本拡張機能は個人情報・機密情報の収集・送信・使用・共有をいたしません。
ただし、本拡張機能はユーザがアクセスした Udemy の講義ページにて、
ユーザが本拡張機能のポップアップ上のボタン「REBUILD」ボタンをクリックすることで、
**その講義ページのトランスクリプト機能上の字幕情報を、chrome extension API が提供する方法にて利用者のブラウザの LocalStorage に保存します。**
この保存情報は、ユーザが Udemy の講義ページを離れたときに自動的に削除されます。

#### 取得方法

拡張機能のポップアップ上のボタン「REBUILD」ボタンをクリックすることで、その講義ページのトランスクリプト機能上の字幕情報を利用者のブラウザの LocalStorage に保存します。

#### 利用目的

##### 利便性の向上

拡張機能では、機能の内容により、下記の情報を**「ブラウザの LocalStorage」へ保存します**

-   利用者がアクセスし、本拡張機能を実行させた Udemy 講義ページ上のトランスクリプトの字幕データ

上記データの利用目的は、本拡張機能が提供する再構成された字幕データを提供するために利用されます。

##### 保存期間について

拡張機能内でデータの扱いとして、LocalStorage を使用します。
ユーザが講義ページから離れたときに、本拡張機能が有効であった場合に自動的に取得したデータは削除されます。
ただし LocalStorage には保存期間が存在しないためデータの保存期間は拡張機能のアンインストール時までとなる場合もあります。

#### 個人情報の取り扱いの同意について

当開発者が開発を行った拡張機能では、拡張機能のインストールを行う前に、当プライバシーポリシーをご一読頂くようにお願いします。
インストールをされた時点で、当プライバシーポリシーに同意されたとみなします。

#### Cookie による個人情報の取得

拡張機能では、Cookie は利用いたしません。
Cookie（クッキー）とは、ウェブサイトを利用したときに、ブラウザとサーバーとの間で送受信した利用履歴や入力内容などを、訪問者のコンピュータにファイルとして保存しておく仕組みです。

TODO: ここ必要？ ----

### 個人情報の管理

当開発者は、拡張機能内における個人情報の管理について、以下を徹底します。
本拡張機能は個人情報・機密情報を

#### 情報の正確性の確保

利用者が入力したデータにおいて、常に正しい情報を保持します。

#### 安全管理措置

拡張機能において、情報の漏洩、滅失を防止するために拡張機能内において利用目的外のサーバーへの情報送信を行いません。

#### 個人情報の第三者への提供について

当開発者の開発する拡張機能は、利用者から提供いただいた個人情報を、訪問者本人の同意を得ることなく第三者に提供することはありません。
また、今後第三者提供を行うことになった場合には、提供する情報と提供目的などを提示し、訪問者から同意を得た場合のみ第三者提供を行います。

---

#### 問い合わせ先

拡張機能、又は個人情報の取扱いに関しては、下記のメールアドレスにてお問い合わせください。

メールアドレス：
TODO: (公開用のメールアドレス) test@test.com

## 策定日

yyyy 年 mm 月 dd 日　策定
```

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

#### 推敲

[参考](#参考)

推敲しようと思ったけどいいや。公開してから何度も見直すからその時に更新すればよし。

構成だけ次の通りに。

-   gaiyo
-   feature
-   sale point
-   privacy policy and security
-   guide to SNS

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

NOTE: 守ること

-   著作権違反回避のため Figma で Udemy を模した画像を作成して、これをスクリーンショットとする
-   提出できるスクリーンショットのサイズは 1280\*800
-   載せられる画像は最大 5 枚まで

スクリーンショットに載せる情報

1. トランスクリプトの英語字幕の変化比較画像
2. トランスクリプトの Google 翻訳後の字幕変化比較画像
3. 使い方（REBUILD をクリックするだけ！)
4. 使い方（COMPLETE!と出れば完了）

全体的に説明文章を上部に、スクリーンショットを下部に置いた画像を作成する

参考：

https://chrome.google.com/webstore/detail/honey-automatic-coupons-c/bmnlcjabgnpnenekpadlanbbkooimhnj?hl=ja

https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca?hl=ja

TODO: figma の仕上げを...

## メモ

以下、開発中の走り書き。

#### POPUP 改善

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

#### 字幕文章生成

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

Figma の方であらかた素材は出来上がった

#### アップロードしてみた

TODO: 公開用のメールアドレスを用意する
TODO: manifest.json permission の tts が必要な理由を究明する

そしたら審査してもらう！
