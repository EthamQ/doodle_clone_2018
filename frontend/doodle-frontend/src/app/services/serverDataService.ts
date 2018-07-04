import { Injectable } from '@angular/core';

@Injectable()
export class ServerDataService {

    private isLocalServer = true;
    readonly localServer = 'http://localhost:3000';
    readonly uniServer = 'http://10.150.133.137:3000';

    constructor() { }

    getServerURL(){
        return this.isLocalServer? this.localServer : this.uniServer;
    }
}