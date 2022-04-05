/*
Basics : Mapped Types

https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

*/

type Horse = {};

// keyは文字列で値はbooleanかHorseの値をとるよという意味
type OnlyBoolsAndHorses = {
    [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
    del: true,
    rodney: false,
};

// <Type>のkey群をkeyとしてセットする
// それらの値はboolean値をとる
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
}

type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};


/*
FeatureOptions

    type FeatureOptions = {
        darkMode: boolean;
        newUserProfile: boolean;
    }

つまり
Genericsとして挿入されたオブジェクトのプロパティがFeatureOptionsのkeyに、
そしてそれらの値はOptionsFlagsのプロパティ値のbooleanになる

OptionsFlags<挿入されたオブジェクトのkeyがここでのKeyとして登録される>
*/ 
type FeatureOptions = OptionsFlags<FeatureFlags>;


/*
`Properties`
*/ 

