/*


About Observer Pattern

https://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript
______________________________________________

Subject: Observersリストを管理する。Observer全てに対して通知を行う。通知をどうしたかは関心がない

Observer: Subjectの状態変化による通知によって更新をするインタフェイスを提供する

ConcreteSubject: 状態変化したことの通知をObserverへ発信する、ConcreteObserverの状態を保存する

ConcreteObserver: ConcreteSubjectへの参照を格納し、オブザーバーの更新インターフェイスを実装して、状態がサブジェクトの状態と一致していることを確認します


## 具体例： サンプルコードでしていること

ボタンをクリックするとcheckboxが生成される
すべてのcheckboxは`controlCheckbox`でcheckを入れられるとチェックが入ることになっている

1.
`controlCheckBox`にはSubject()のプロパティをくっつける(exnted())
これによりSubjectのプロパティを使えるようになり、notify()を呼び出すことでObserverList()へ登録されたすべてのオブジェクトのupdate()関数を呼出すことができる

これが「Observerすべてに対しての通知」である

2. 
生成されるcheckboxにはObserver()のプロパティをくっつける(extend())
これにより通知がされたときに実行されるupdate()関数を定義しておけば
Subjectでnotiyされたときに実行してもらえる



例では`addNewObserver`で新たなcheckboxを生成する
checkboxは押されたことを通知する仕組みを付ける

生成されるcheckboxはobserverであり、ObserverListへ追加される
ConcreteSubjectがnotifyを通知したら
ObserverListへ登録されているすべてのupdate関数は
notify()への引数が渡され実行される

ポイントは
ConcreteSubjectもConcreteObserverもお互いを知らない蜜結合の実装をしなくて済む点である

お互いが密接にかかわる実装を必要とせずに
Subjectの管理するObserverListへObserverの更新関数を登録しておくだけで
更新を常に受け取ることができる点である



## Usage

通知する側にくっつけるSubjectクラスを定義する
通知側にくっつける
notifyのトリガー条件を定義する

観測者側にくっつけるObserverクラスを定義する（notfy()で呼び出される共通の関数名だけ実装していればいい）
観測者側にくっつける
Subjectのadd()メソッドに自身のオブジェクトを渡す


## Observer Pattern と Pub/Sub Pattern の違い

> オブザーバーパターンでは、トピック通知の受信を希望するオブザーバー（またはオブジェクト）が、イベントを発生させるオブジェクト（サブジェクト）にこのインタレストをサブスクライブする必要があります。

通知を受け取りたい側が、通知を発信するオブジェクトに「関心」を登録する

> ただし、パブリッシュ/サブスクライブパターンは、通知の受信を希望するオブジェクト（サブスクライバー）とイベントを発生させるオブジェクト（パブリッシャー）の間にあるトピック/イベントチャネルを使用します。このイベントシステムにより、コードは、サブスクライバーが必要とする値を含むカスタム引数を渡すことができるアプリケーション固有のイベントを定義できます。ここでの考え方は、サブスクライバーとパブリッシャーの間の依存関係を回避することです。

つまりObserver Patternはイベント通知するオブジェクトと直接やり取りするのに対して
Pub/Sub Patternでは間に立つトピック/イベントチャンネルというものが存在する

Pub/Subパターンの方では共通の発火キーワードだけお互い持っていれば
まったくお互いを知らずに通知->発火ができる

*/


/*
    Observer List
    ____________
    Subjectが管理するObserver List

*/ 
function ObserverList(){
    this.observerList = [];
  }
   
  ObserverList.prototype.add = function( obj ){
    return this.observerList.push( obj );
  };
   
  ObserverList.prototype.count = function(){
    return this.observerList.length;
  };
   
  ObserverList.prototype.get = function( index ){
    if( index > -1 && index < this.observerList.length ){
      return this.observerList[ index ];
    }
  };
   
  ObserverList.prototype.indexOf = function( obj, startIndex ){
    var i = startIndex;
   
    while( i < this.observerList.length ){
      if( this.observerList[i] === obj ){
        return i;
      }
      i++;
    }
   
    return -1;
  };
   
  ObserverList.prototype.removeAt = function( index ){
    this.observerList.splice( index, 1 );
  };



/*
  Subject
  _________________

*/   
  function Subject(){
    this.observers = new ObserverList();
  }
   
  Subject.prototype.addObserver = function( observer ){
    this.observers.add( observer );
  };
   
  Subject.prototype.removeObserver = function( observer ){
    this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
  };
   
  Subject.prototype.notify = function( context ){
    var observerCount = this.observers.count();
    for(var i=0; i < observerCount; i++){
      this.observers.get(i).update( context );
    }
  };

  // Extend an object with an extension
  /*
  extensionとして渡されるnew Subject()の各プロパティを
  objeとして渡されるオブジェクトに追加する

  つまり
  Subjectのプロパティをobjにくっつけている処理
  
  */ 
function extend( obj, extension ){
    for ( var key in extension ){
      obj[key] = extension[key];
    }
  }
   
  // References to our DOM elements
   
  var controlCheckbox = document.getElementById( "mainCheckbox" ),
    addBtn = document.getElementById( "addNewObserver" ),
    container = document.getElementById( "observersContainer" );
   
   
  // Concrete Subject
   
  // Extend the controlling checkbox with the Subject class
  extend( controlCheckbox, new Subject() );
   
  // Clicking the checkbox will trigger notifications to its observers
  controlCheckbox.onclick = function(){
    controlCheckbox.notify( controlCheckbox.checked );
  };
   
  addBtn.onclick = addNewObserver;

  /*
    Observer
    ____________
  
  */ 
 function Observer() {
  this.update = function() {
    console.log("Obsrerver update");
  }
 }
   
  /*
  Concrete Observer
  ____________________________
  */ 
   
  function addNewObserver(){
   
    // Create a new checkbox to be added
    var check = document.createElement( "input" );
    check.type = "checkbox";
   
    // Extend the checkbox with the Observer class
    extend( check, new Observer() );
   
    // Override with custom update behaviour
    check.update = function( value ){
      this.checked = value;
    };
   
    // Add the new observer to our list of observers
    // for our main subject
    controlCheckbox.addObserver( check );
   
    // Append the item to the container
    container.appendChild( check );
  }