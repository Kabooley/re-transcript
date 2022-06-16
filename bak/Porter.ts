import { iMessage } from './constants';

export class Porter {
    port: chrome.runtime.Port;
    constructor(public portName: string) {
        this.port = chrome.runtime.connect({ name: this.portName });
    }

    postMessage(m: iMessage): void {
        console.log("posted message: ");
        console.log(m);
        this.port.postMessage(m);
    }

    diconnect(): void {
        console.log('Disconnect port.');
        this.port.disconnect();
    }

    onMessageListener(callback: (message: iMessage) => void): void {
        this.port.onMessage.addListener(callback);
    }

    onDisconnect(callback: (p: chrome.runtime.Port) => void): void {
        console.log('Port disconnected');
        this.port.onDisconnect.addListener(callback);
    }
}
