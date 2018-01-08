import {Router} from "@angular/router";
import { Component, OnInit, ViewChild, Directive, forwardRef, Attribute, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';

import {UserRegistrationService} from "../../../service/user-registration.service";
import {CognitoCallback} from "../../../service/cognito.service";
import { User } from './../../../shared/user.model';

/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './registration.html'
})
export class RegisterComponent implements CognitoCallback {
    model: User = new User();
    @ViewChild('f') form: any;
    router: Router;
    errorMessage: string;

    constructor(public userRegistration: UserRegistrationService, router: Router) {
        this.router = router;
        this.onInit();
    }

    onInit() {
        this.errorMessage = null;
    }

    onRegister() {
        this.errorMessage = null;
        if (this.form.valid) {
            this.userRegistration.register(this.model, this);
        } else {
            this.errorMessage = "All fields are required";
        }
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { //success
            //move to the next step
            console.log("redirecting");
            this.router.navigate(['/home/confirmRegistration', result.user.username]);
        }
    }
}