## Adding Model Propeties

先までの Model インスタンスとの統合

```TypeScript
// UserForm.ts

import { User } from '../models/User';

export class UserForm {
    constructor(
        public parent: Element,
        public model: User)
    {}

    // ...

    template(): string {
        return `
            <div>
                <h1>User Form</h1>
                <div>User name: ${this.model.get('name')}</div>
                <div>User age: ${this.model.get('age')}</div>
                <input />
                <button>click me</button>
            </div>
        `
    }
}

// index.ts
import { UserForm } from './views/UserForm';
import { User } from './models/User';

const user = User.buildUser({ name: "NAME", age: 20 });
const userForm: UserForm = new UserForm(document.getElementById('root'), user);

userForm.render();
```

## class name にイベント・バインディング

今、年齢変更をサブミットするボタンを追加するとする

`<button>set random age</button>`

先までの`eventMap`のままだとこの<button>にも`onButtonClick`がバインドされてしまう

なので class 名`set-age`で区別するようにする

```TypeScript
// UserForm.ts

import { User } from '../models/User';

export class UserForm {
    constructor(
        public parent: Element,
        public model: User)
    {}

    onSetAgeClick(): void {
        console.log('new age set');
    }

    eventMap(): { [key: string]: () => void } {
        return {
            'click:button': this.onButtonClick,
            'mouseenter:h1': this.onHeaderHover,
            'click:.set-age': this.onSetAgeClick
        }
    }

    template(): string {
        return `
            <div>
                <h1>User Form</h1>
                <div>User name: ${this.model.get('name')}</div>
                <div>User age: ${this.model.get('age')}</div>
                <input />
                <button>click me</button>
                <button class="set-age">set random age</button>
            </div>
        `
    }
}

```

これをすると`button.set-age`には`onSetAgeClick`だけバインドされて

`onButtonClick`はバインドされない

なぜ？

```TypeScript
// UserForm.ts

bindEvents(fragment: DocumentFragment): void {
    const eventsMap = this.eventsMap();

    for( let eventKey in eventsMap) {
        const [eventName, selector] = eventKey.split(':');

        fragment.querySelectorAll(selector).forEach(element => {
            element.addEventListener(eventName)
        })
    }
}
```
