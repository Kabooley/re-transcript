# Note about Mix-In pattern

https://www.patterns.dev/posts/mixin-pattern/

NOTE:

> ミックスインを使用すると、オブジェクトのプロトタイプに機能を挿入することで、継承せずにオブジェクトに機能を簡単に追加できます。
> **ただしオブジェクトのプロトタイプを変更すると、**
> **プロトタイプの汚染や関数の起源に関する不確実性のレベルにつながる可能性があるため、悪い習慣と見なされます**


理解したうえでつかってみては？


> ミックスインは、継承を使用せずに、
> 別のオブジェクトまたはクラスに再利用可能な機能を追加するために使用できるオブジェクトです。
> ミックスインを単独で使用することはできません。
> ミックスインの唯一の目的は、継承なしでオブジェクトまたはクラスに機能を追加することです。 

通常オブジェクトに機能を追加する方法は

- 継承：`Obj.prototype.newFunc`のような
- 継承なし：`apply`, `call`: 他のオブジェクトのメソッドをthisをバインドすることでそのthisスコープに付与することができる
- 継承なしだけどprototypeを汚染する：`Object.assign()`: 渡されたオブジェクトに別のオブジェクトをコピーする

のような方法になる

> このアプリケーションでは、複数の犬を作成する必要があるとしましょう。ただし、作成する基本的な犬には、名前プロパティ以外のプロパティはありません。

```JavaScript
class Dog {
  constructor(name) {
    this.name = name;
  }
}

const dogFunctionality = {
  bark: () => console.log("Woof!"),
  wagTail: () => console.log("Wagging my tail!"),
  play: () => console.log("Playing!")
};
```

`Object.assing()`

```JavaScript
Object.assign(Dog.prototype, dogFunctionality);

const pet1 = new Dog("Daisy");

pet1.name; // Daisy
pet1.bark(); // Woof!
pet1.play(); // Playing!
```

`Dog`(のpropertyに)は`Object.assing()`によって`dogFunctionality`のプロパティが新たに追加される


たとえば哺乳類の普遍的な行動をまとめたオブジェクトを
あとからdogFunctionalityへ追加したいと思ったときにも
`Object.assing`が使える

```JavaScript
const animalFunctionality = {
  walk: () => console.log("Walking!"),
  sleep: () => console.log("Sleeping!")
};
We can add these properties to the dogFunctionality prototype, using Object.assign. In this case, the target object is dogFunctionality.

const animalFunctionality = {
  walk: () => console.log("Walking!"),
  sleep: () => console.log("Sleeping!")
};

const dogFunctionality = {
  bark: () => console.log("Woof!"),
  wagTail: () => console.log("Wagging my tail!"),
  play: () => console.log("Playing!"),
  walk() {
    super.walk();
  },
  sleep() {
    super.sleep();
  }
};

Object.assign(dogFunctionality, animalFunctionality);
Object.assign(Dog.prototype, dogFunctionality);
```