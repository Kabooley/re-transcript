import { iMessage } from './constants';

export class Porter {
    port: chrome.runtime.Port;
    constructor(public portName: string) {
        this.port = chrome.runtime.connect({ name: this.portName });
    }

    postMessage(m: iMessage): void {
        this.port.postMessage(m);
    }

    diconnect(): void {
        this.port.disconnect();
    }

    onMessageListener(callback: (message: iMessage) => void): void {
        this.port.onMessage.addListener(callback);
    }

    onDisconnect(callback: (p: chrome.runtime.Port) => void): void {
        this.port.onDisconnect.addListener(callback);
    }
}
