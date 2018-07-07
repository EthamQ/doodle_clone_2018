import { Injectable } from '@angular/core';

@Injectable()
export class URLService {

    private isLocalServer = true;
    readonly localServer = 'http://localhost:3000';
    readonly uniServer = 'http://10.150.133.137:3000';
    readonly localFrontend = 'http://localhost:4200';
    readonly uniFrontend = 'http://10.150.133.137:4200';

    constructor() { }

    getServerURL() {
        return this.isLocalServer ? this.localServer : this.uniServer;
    }

    getFrontendURL() {
        return this.isLocalServer ? this.localFrontend : this.localFrontend;
    }
}
