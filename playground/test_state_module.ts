// test @ codesandbox

class State<TYPE> {
    private _state: TYPE;
  
    constructor(value: TYPE) {
      this._state = value;
    }
  
    setState(
      prop: {
        [Property in keyof TYPE]: TYPE[Property];
      }
    ): void {
      console.log(prop);
      this._state = {
        ...this._state,
        ...prop
      };
    }
  
    getState(): TYPE {
      return JSON.parse(JSON.stringify(this._state));
    }
  }
  
  interface iStatus {
    scripts?: {
      popup: string;
      contentScript: string;
      controller: string;
      option: string;
    };
    pageStatus?: {
      isTranscriptOn: boolean;
      isEnglish: boolean;
      isWindowTooSmall: boolean;
    };
    progress?: {
      capturing: boolean;
      captured: boolean;
      stored: boolean;
      restructured: boolean;
    };
  }
  
  const status_data: iStatus = {
    scripts: {
      popup: "Working",
      contentScript: "Working",
      controller: "Working",
      option: "Working"
    },
    pageStatus: {
      isTranscriptOn: false,
      isEnglish: false,
      isWindowTooSmall: false
    },
    progress: {
      capturing: false,
      captured: false,
      stored: false,
      restructured: false
    }
  };
  
  
  const status_data2 = {
    scripts: {
      popup: "notWorking",
      contentScript: "notWorking",
      controller: "notWorking",
      option: "notWorking"
    },
    pageStatus: {
      isTranscriptOn: false,
      isEnglish: false,
      isWindowTooSmall: false
    },
    progress: {
      capturing: false,
      captured: false,
      stored: false,
      restructured: false
    }
  };
  
  // 
  // --- 参照の防止 ----
  // 
  const status = new State<iStatus>(status_data);
  
  // 注意！：プログラマの責任
  // setState()するデータは予めdeep copyしておくこと
  const d = JSON.parse(JSON.stringify(status_data2));
  status.setState(d);
  
  // そうすれば参照による変更を受け付けない
  status_data2.pageStatus.isEnglish = true;
  console.log(status.getState());
  
  const got = status.getState();
  got.scripts.option = true;
  console.log(status.getState());
  
  
  // 
  // --- 利用できるTYPE ----
  // 
  
  // // BAD USAGE
  // // 
  // // setState()では引数のプロパティを展開するので
  // // {0: "t", 1: "h", 2: "i", 3: "s", 4: " "…}
  // // というデータが_stateに登録されてしまう
  // const title = new State<string>("this is section title");
  // title.setState("this is new title");
  // // しかしgetState()はJSONメソッドを使うおかげなのか、
  // // "this is new title"と文字列として返してくれる
  // console.log(title.getState());
  
  // // 一方numberの場合は
  // // setState()したら2121で登録されるけれど
  // const num = new State<number>(111);
  // num.setState(2121);
  // // JSON-niseはできないから空のオブジェクトが返される
  // console.log(num.getState());
  // // {}
  
  // 注意！: プログラマの責任
  // >>なので必ずオブジェクトとして渡すこと<<
  
  // CORRECT USAGE
  interface iTitle {
    title: string;
  }
  const correctTitle = new State<iTitle>({title: "this is correct"});
  correctTitle.setState({title: "this is new correct title"});
  console.log(correctTitle.getState());
  
  interface iNumber {
    num: number;
  }
  const correctNum = new State<iNumber>({num: 333});
  correctNum.setState({num: 777});
  console.log(correctNum.getState());
  
  
  const _uData = {data: "donald"};
  const _key = "this_is_awesome_key";
  const obj = {[_key]: _uData};
  console.log(obj);