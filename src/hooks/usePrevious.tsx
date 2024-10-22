import React from 'react';

/***
 * 以前のpropsの状態を保持して返す関数
 *
 * 参考:
 * https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
 * https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
 * */
export function usePrevious<T>(value: T) {
    const ref = React.useRef<T>();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
