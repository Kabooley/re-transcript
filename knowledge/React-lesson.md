# React 開発中に得た知見、教訓 まとめ

## 目次

[自動で閉じるアラートの実装方法](#自動で閉じるアラートの実装方法)

## 【Materiak UI】自動で閉じるアラートの実装方法【React】

### あらすじ

React コンポーネントの state のある値が true になったらアラートが表示されて、

しばらくしたら自動でアラートが閉じる

そんな仕様のコンポーネントを実装しようとしたら

結構工夫を凝らす必要があったので

ここにその方法を記録します

### この記事が取り上げるもの

あらすじをご覧になった方は

この実装は特段難しい話ではなくて、

React である state が`true`になったら、

Material UI の`Alert`を囲う`Slide`コンポーネントの`in`プロパティに state の値を渡せばいいだけじゃん

と思われるかもしれません。

問題は、

何度もアラートを表示しなくてはいけないような場合になったとき、

state の値だけを頼りにすると

`Slide`をトリガーする state を一旦 true にしたらいつ false に戻すの？

という課題に行き着くことです。

この記事では Material UI を使うので

その Material UI のアラートを表示してくれる Slide コンポーネントの独自の動きに応じて

工夫して React Hooks を使うことが求められました。

こうした制約の中で如何に実現していくかをこの記事で扱います。

### 使うもの

React Hooks の`useEffect()`

Material UI (`@mui/material/Slide`) の`Slide`コンポーネント

### 実装するもの

`Content.tsx`
`show`という boolean の state を持つ。
`show`は親コンポーネントからの props の更新で`true`になる
useEffect()で指定時間経過後、`show`は自動的に`false`になる
`show`は子コンポーネント`AlertMessage`へ渡す

`AlertMessage.tsx`

親コンポーネントから`props.built`が渡される
子コンポーネント`Content.tsx`は`props.built`が true だった時、5 秒間だけ自身の state`show`を true にする
`Content.tsx`は 5 秒したのち state`show`を必ず false に戻す
`AlertMessage`は`Content.tsx`から`props.show`を受け取り、これが`true`だったときに 3 秒間アニメーション要素を出力する

#### `@mui/material/Slide`コンポーネント動作条件の確認

公式のページに豊富なデモがあるのでそちらを確認した方が早いかもしれませんが、

とにかく`Slide`コンポーネントの`in`プロパティに boolean 値をわたすことで

アラートが出現/退場します。

なので`Slide`アニメーションのトリガーは`in`プロパティになります。

```TypeScript
// ほぼ公式そのままです
//
// `checked`がtrueになると、
// `FormControlLabel`を囲う`Box`コンポーネントの端から
// `Slide`コンポーネントに囲われた`icon`が出現します

import * as React from 'react';
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import FormControlLabel from '@mui/material/FormControlLabel';
import icon from './icon';

export default function SlideFromContainer() {
    // `checked`がtrueでアニメーションがトリガーされる
  const [checked, setChecked] = React.useState(false);
  const containerRef = React.useRef(null);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box
      sx={{
        height: 180,
        width: 240,
        display: 'flex',
        padding: 2,
        borderRadius: 1,
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >
      <Box sx={{ width: 200 }}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Show from target"
        />
        <Slide
            // 左から右に向かって出現する
            direction="right"
            // アニメーションのトリガープロパティ
            in={checked}
            // どのコンポーネントから出現するのかuseRef()で指定しておく
            container={containerRef.current}>
          {icon}
        </Slide>
      </Box>
    </Box>
  );
}
```

動作条件:

-   `in`プロパティにアニメーションのトリガーとなる boolean 値を渡すこと
-   どこからスライドして出現するか`direction`で指定する
-   特定のコンテナの端から出現させたいときは`container`にコンテナコンポーネントの`ref.current`を渡す

Transition のプロパティを操作することでアニメーションの動きに注文を付けることができます。

```TypeScript
// ...
 return (
    //  ...
      <Box sx={{ width: 200 }}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Show from target"
        />
        <Slide
            direction="right"
            in={checked}
            container={containerRef.current}
            // Transitionにかかわるプロパティ
            //
            // transition-timing-functionを指定できる
            easing={"ease-out"}
            // transition-durationと同じ。
            // 一方向のアニメーションにかける時間(ミリ秒)
            timeout={600}
        >
          {icon}
        </Slide>
      </Box>
    </Box>
  );
}
```

上記のサンプルはスライダーでアニメーションを手動で出現または退場させています。

これを自動で出現させるようにします。

### スライドアニメーションが自動で退場するようにする

先までのサンプルは手動によるアニメーションの実行でした。

親コンポーネントからpropsを受け取り

その値に応じてアニメーションを実行するようにします。


```TypeScript

export default function SlideFromContainer(props) {
  const [checked, setChecked] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(function() {
      setChecked(props.checked);
  });

  React.useEffect(function() {
      if(checked) {
          setTimeout(function() {
              setChecked(false);
          }, 3000);
      }
  }, [checked]);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <Box
      sx={{
        height: 180,
        width: 240,
        display: 'flex',
        padding: 2,
        borderRadius: 1,
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        overflow: 'hidden',
      }}
      ref={containerRef}
    >
      <Box sx={{ width: 200 }}>
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label="Show from target"
        />
        <Slide
            // 左から右に向かって出現する
            direction="right"
            // アニメーションのトリガープロパティ
            in={checked}
            // どのコンポーネントから出現するのかuseRef()で指定しておく
            container={containerRef.current}>
          {icon}
        </Slide>
      </Box>
    </Box>
  );
}
```
