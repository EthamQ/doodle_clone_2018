import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-view',
    templateUrl: 'admin-view.component.html'
})

export class AdminViewComponent implements OnInit {

    editActive = false;
    adminId : string;

    constructor() { }

    ngOnInit() { }

    adminIdSubmitted(adminId){
        this.editActive = !this.editActive;
        this.adminId = adminId;
    }
}