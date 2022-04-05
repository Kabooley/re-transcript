# TypeScript Knowledge

## 引数に制限を持たせつつ汎用性を持たせる方法

たとえば

```TypeScript
export class CustomMap {
  private googleMap: google.maps.Map;

  constructor(divId: string) {
    this.googleMap = new google.maps.Map(document.getElementById(divId), {
      zoom: 1,
      center: {
        lat: 0,
        lng: 0,
      },
    });
  }

  addMarker(mappable: any): void {
    new google.maps.Marker({
      map: this.googleMap,
      position: {
        lat: mappable.location.lat,
        lng: mappable.location.lng,
      },
    });
  }
}
```

`addMarker`には`user`や`Company`や`Shop`とか色々
Google マップ上のアイコンとしてあり得そうなオブジェクトを引数として取り入れたい

たとえば...

```TypeScript
  addMarker(mappable: User | Company | Shop | School | ...): void {
    new google.maps.Marker({
      map: this.googleMap,
      position: {
        lat: mappable.location.lat,
        lng: mappable.location.lng,
      },
    });
  }
```

として Union 型をもちいることでいくつかの決められた引数だけを取り入れることを許可できる

しかしこれだと取り入れたい引数が増えれば Union 型もいちいち足していかないといけないし
可読性がめちゃ下がるので困る

ここは`addMarker`が必要とするプロパティをもつ interface を引数の型とすればいい

つまり

```TypeScript
interface Mappable {
    // 共通のプロパティを定義する
    location: {
        lat: number;
        lng: number;
    }
}
  // 共通のプロパティを定義したinterfaceを取ることにする
  addMarker(mappable: Mappable): void {
    new google.maps.Marker({
      map: this.googleMap,
      position: {
        lat: mappable.location.lat,
        lng: mappable.location.lng,
      },
    });
  }
```

こうすることで
User だろうが Company だろうが、`Mappable`の引数をもたない引数は受け付けなくできるし
逆に`Mappable`をみたせばどんな引数だろうと受け入れることができる

interface はそのプロパティをもつことを厳格に求めるけれど
ほかのプロパティを持っていることに関しては制限をもうけない

先の例ならば

```TypeScript
class User {
    name: string;
    location: {
        lat: number;
        lng: number;
    }
};

class Shop{
    name: string;
    parking: boolean;
}

const u: User = new User('Racka');
const s: Shop = new Ship('Cando');

// OK
// uはMappableと関係ないプロパティnameとか持っているけれど
// Mappableの求めるプロパティも持っているので
// 受け入れることができる
addMarker(u);

// NG
// sはMappableの求めるプロパティをもっていない
// なので受け入れられない
// addMarker(s);

```

## `implements`

https://typescript-jp.gitbook.io/deep-dive/type-system/interfaces

先の例で

```TypeScript
interface Mappable {
    // 共通のプロパティを定義する
    location: {
        lat: number;
        lng: number;
    }
    color: string;
}

addMarker(mappable: Mappable): void {
//   ...
}
```

共通のプロパティを定義した interface Mappable にプロパティを追加した

こうなると Mappable のプロパティが求められる addMarker のような引数に渡される
あらゆるオブジェクトはすべて`color`プロパティを追加していなくてはならない

addMarker に渡される引数がすべてこの変更に従っていなくてはならないように
強制したい場合
`implements`を使う

```TypeScript
class User implements Mappable{
    name: string;
    location: {
        lat: number;
        lng: number;
    }
    color: string = 'red';
};

interface Mappable {
    // 共通のプロパティを定義する
    location: {
        lat: number;
        lng: number;
    }
    color: string;
}
```

`implements`キーワードは
interface のオブジェクト構造に必ず従わなくてはならないクラスを生成させる

`extends`との違いは
`extends`は interface の継承であるのに対して
`implements`は class に対して interface の構造を守らせるよう強制するものである

## Parcel 抜き自動ビルド&実行 configuration

parcel や webpack ぬきで自動でビルドして実行してを実現する

基本参考：

https://docs.microsoft.com/ja-jp/visualstudio/javascript/compile-typescript-code-npm?view=vs-2022

https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

https://www.typescriptlang.org/docs/handbook/compiler-options.html

tsconfig.json：

```JSON
{
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false,
    "sourceMap": true,
    "target": "es5",
    "outDir": "dist"
  },
  "include": [
    "scripts/**/*"
  ]
}
```

package.json:

```JSON
{
    // ...
    "scripts": {
        // buildコマンド
        "start:build": "tsc -w",
        // 実行コマンド
        "start:run": "nodemon build/index.js",
        // npm:start:*で"npm:start"からなるコマンドすべてを実行するという意味
        "start": "concurrently npm:start:*",
    },
    "dependencies": {
        // 複数のコマンドを一度に実行できるnpmパッケージ
        "concurrently": "^4.1.0",
        "nodemon": "^1.19.0"
    },
}
```

`tsc -w`コマンドの意味

```bash
# --watch option: "Watch input files"
# 一度実行したら
# src/ディレクトリ以下で変更があったら自動で検知してコンパイルしてくれる
typescript-prod-dir/src $ tsc -w
```

ここまでできたらあとは`npm start`するだけ

```bash
typescript-prod-dir/src $ npm start
```
