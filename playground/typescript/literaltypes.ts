/****************************************************
Objectのプロパティが特定の値群のみをとるように強制する方法の検証
*****************************************************/

let x: 'hello' = 'hello';
// OK
x = 'hello';
// ...
// x = "howdy";

function printText(s: string, alignment: 'left' | 'right' | 'center') {
    // ...
}
printText('Hello, world', 'left');
// printText("G'day, mate", "centre");

interface iMessage {
    from: 'contentScript' | 'background' | 'popup';
    to: 'contentScript' | 'background' | 'popup';
}

const message: iMessage = {
    from: 'contentScript',
    to: 'background',
};

// ReadOnlyのObjectから特定の値群しかとらないプロパティをもつオブジェクトのための
// interfaceを作る方法
//
// もととなる定数のオブジェクトを作る（プロパティ名と値は同じにすること！）
// typeofからkeyofへ変換してオブジェクトの値群をunionタイプにする
// interfaceに渡す
//
// 使う側はextensionNamesとiMessage2両方を渡せばよい
const extensionNames = {
    popup: 'popup',
    contentScript: 'content-script',
    option: 'option',
    background: 'background',
} as const;

type typeOfEn = typeof extensionNames;
type keyOfEn = keyof typeOfEn;

interface iMessage2 {
    from: keyOfEn;
    to: keyOfEn;
}

// OK
const message2: iMessage2 = {
    from: 'contentScript',
    to: 'background',
};

// INVALID
const message3: iMessage2 = {
    from: 'content-script',
    to: 'background',
};
