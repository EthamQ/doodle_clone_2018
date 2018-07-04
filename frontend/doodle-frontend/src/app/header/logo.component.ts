import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-logo-header',
    templateUrl: 'logo.component.html',
    styleUrls: ['./logo.component.scss']
})

export class LogoHeaderComponent implements OnInit {

    @Input() isLanding: boolean = false;
    @Input() isJoin: boolean = false;
    @Input() isCreate: boolean = false;
    @Input() isViewEvent: boolean = false;
    
    constructor() { }

    ngOnInit() { }

    getClass(){
        let cssClass = "title ";
        if(this.isLanding){
            return cssClass + "white" + " landing" + " big";
        }
        if(this.isJoin){
            return cssClass + "white" + " big";
        }
        if(this.isCreate || this.isViewEvent){
            return cssClass + "black" + " small";
        }
    }
}