# Note chrome.storage

> この API は、エクステンション特有のストレージのニーズに応えるために最適化されています。localStorage API と同じストレージ機能を提供しています

ストレージには 3 つの種類がある

- sync

  chrome によって同期される。google アカウントに対して保存される感じ。なので異なるデバイス間で共有できる。

- local

  ブラウザに保存する。

- managed

読み取り専用
ドメイン管理者によって設定される。
使うことはないだろう

**Warning**

ストレージは別に暗号化していないので
重要な情報は保存してはならない

#### chrome.storage property: local

デバイスに対して保存される

QUOTA_BYTES:

5242880

> ローカル・ストレージに保存できるデータの最大量（バイト単位）で、すべての値の JSON 文字列化とすべてのキーの長さで測定します。
> この値は、拡張機能に unlimitedStorage パーミッションが設定されている場合は無視されます。
> この制限を超えるような更新は直ちに失敗し、runtime.lastError が設定されます。

#### Usage

```JavaScript
chrome.storage.local.set({key: value}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.local.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});
```

#### set

複数のアイテムを保存する

```TypeScript
(items: object, callback?: function) => {...}
```

非同期関数で Promise を返す。

- items:

> ストレージを更新するための各キー／バリューペアを与えるオブジェクトです。ストレージ内の他のキーと値のペアは影響を受けません。
> 数字などのプリミティブな値は、期待通りにシリアル化されます。typeof が "object "と "function "の値は、通常{}にシリアライズされます。ただし、Array（期待通りにシリアライズされます）、Date、Regex（文字列表現を使用してシリアライズされます）は例外です。

- callback:

Promise を受け取るコールバック関数

#### get

storage から一つ以上のアイテムを取得する

```TypeScript
(keys?: string | string[] | object, callback?: function) => {...}
```

非同期関数でPromiseを返す

- keys:
  
  > 取得する単一のキー、取得するキーのリスト、またはデフォルト値を指定するディクショナリー（オブジェクトの説明を参照）。空のリストまたはオブジェクトは、空の結果オブジェクトを返します。nullを渡すと、ストレージの内容全体を取得します。


#### onchanged

一つ以上のアイテムが変更になったら発火する

#### clear

storageからすべてのアイテムを除去する

#### getbytesInUse

アイテムによって占有されている量(byte)を取得する

#### remove

一つ以上のアイテムを除去する

