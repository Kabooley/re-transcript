# Note: Material UI


## アニメーション

https://mui.com/components/dialogs/

https://mui.com/components/transitions/


## CUSTOM THEME

https://mui.com/customization/theming/

> テーマをカスタマイズする場合は、テーマをアプリケーションに挿入するために、ThemeProviderコンポーネントを使用する必要があります。
> ただし、これはオプションです。 MUIコンポーネントにはデフォルトのテーマが付属しています。

https://mui.com/customization/default-theme/

ということで

- themeのデフォ値は上記のURLから確認できるよ
- Material UIのコンポーネントはこのthemeデフォ値に従っているよ

この中でthemeをカスタムする


### themeをカスタムするとき

カスタムといいつつ実際にはオーバーライドである

なにかまったく新しいプロパティを追加はできない。

あくまでデフォ値に例えば色の指定があったら別の色の上書きを行えるだけである

新しいプロパティを追加しようとするとエラーになる。

なのでカスタム作業は、

上書きしたい箇所をデフォ値からコピペしてそれを編集する感じになる。



`.palette`:

> パレットを使用すると、貴方のブランドに合わせてコンポーネントの色を変更できます。

Material UIの色のプロパティの頂点なので

ここの`primary`をデフォで採用しているコンポーネントの色がすべて変わる



### 疑問：デフォ値のテーマとカスタムのテーマを両方利用できないのか？

...を考えるよりも、

themeの各プロパティにある`primary`や`secondary`をうまく使うほうが使い分けが捗る。

一方のボタンは赤色のテーマ、もう一方のボタンは青色のテーマと使い分けたいときは...


```TypeScript
const theme = createTheme({
  palette: {
    primary: {
        main: "red"
    },
    secondary: {
        main: "blue"
    }
  },
});

// ...
<Button color="primary">RED BUTTON</Button>
<Button color="secondary">RED BUTTON</Button>
```

### カスタムしたthemeを導入するには

`ThemeProvider`コンポーネントでアプリケーションをラップする



```TypeScript
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status.danger,
  '&.Mui-checked': {
    color: theme.status.danger,
  },
}));

const theme = createTheme({
  status: {
    danger: orange[500],
  },
});

export default function CustomStyles() {
  return (
    <ThemeProvider theme={theme}>
      <CustomCheckbox defaultChecked />
    </ThemeProvider>
  );
}
```

これでラップしたコンポーネント以下でカスタムthemeが採用される