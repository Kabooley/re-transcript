## usage sample

```JavaScript
// select the target node
var target = document.querySelector('#some-id');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

    });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }

// pass in the target node, as well as the observer options
observer.observe(target, config);

// later, you can stop observing
observer.disconnect();
```

この例でできることを分析するならば

target という監視対象を決めて、
config という監視対象で検知したい変更を決めて
実行する処理を`new MutationObserver`のコールバックで定義して
`observer.observer()`でこれらを結びつけて監視開始
`observer.disconnect()`で監視終了

#### 検知できる対象とは？

`observer.observer`で第二引数で指定した基準に基づいて変更を報告してくれる

https://dom.spec.whatwg.org/#interface-mutationobserver

-   childList
    Set to true if mutations to target’s children are to be observed.

-   attributes
    Set to true if mutations to target’s attributes are to be observed. Can be omitted if attributeOldValue or attributeFilter is specified.

-   characterData
    Set to true if mutations to target’s data are to be observed. Can be omitted if characterDataOldValue is specified.

-   subtree
    Set to true if mutations to not just target, but also target’s descendants are to be observed.

    > ターゲットだけでなく、ターゲットの子孫への突然変異も観察される場合は、true に設定します。

-   attributeOldValue
    Set to true if attributes is true or omitted and target’s attribute value before the mutation needs to be recorded.

-   characterDataOldValue
    Set to true if characterData is set to true or omitted and target’s data before the mutation needs to be recorded.

-   attributeFilter
    Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted.

ということで大きく３つで

-   childList
-   attribute
-   characterData

#### 検知対象の DOM は一つだけなのか？

## MutationObserver()

> MutationObserver() コンストラクタ (MutationObserver インターフェースの一部) は、指定されたコールバックを DOM イベントが発生したときに実行するオブザーバを作成して返します。DOM の監視はすぐに開始されるわけではありません。
> 最初に observe() メソッドを呼び出し、DOM のどの部分を監視し、どのような変更を監視するかを決めなければなりません。

```JavaScript
function callback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    switch(mutation.type) {
      case 'childList':
        /* ツリーに１つ以上の子が追加されたか、ツリーから削除された。
           mutation.addedNodes と mutation.removedNodes を参照。 */
        break;
      case 'attributes':
        /* Mutation.target の要素の属性値が変更された。
           属性名は mutation.attributeName にあり、
           以前の値は mutation.oldValue にある。 */
        break;
    }
  });
}
```
