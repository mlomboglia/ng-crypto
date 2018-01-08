import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import {UserLoginService} from "../../../service/user-login.service";
import {CognitoCallback} from "../../../service/cognito.service";
import { User } from './../../../shared/user.model';

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPassword.html'
})
export class ForgotPasswordStep1Component implements CognitoCallback {
    @ViewChild('f') form: any;
    model: User = new User();
    errorMessage: string;

    constructor(public router: Router,
                public userService: UserLoginService) {
        this.errorMessage = null;
    }

    onNext() {
        this.errorMessage = null;
        if (this.form.valid) {
            this.userService.forgotPassword(this.model.email, this);
        } else {
            this.errorMessage = "All fields are required";
        }
    }

    cognitoCallback(message: string, result: any) {
        if (message == null && result == null) { //error
            this.router.navigate(['/home/forgotPassword', this.model.email]);
        } else { //success
            this.errorMessage = message;
        }
    }
}


@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './forgotPasswordStep2.html'
})
export class ForgotPassword2Component implements CognitoCallback, OnInit, OnDestroy {
    @ViewChild('f') form: any;
    model: User = new User();
    errorMessage: string;
    private sub: any;

    constructor(public router: Router, public route: ActivatedRoute,
                public userService: UserLoginService) {
        console.log("email from the url: " + this.model.email);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.model.email = params['email'];

        });
        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onNext() {
        this.errorMessage = null;
        if (this.form.valid) {
            this.userService.confirmNewPassword(this.model.email, this.model.verificationCode, this.model.password, this);
        } else {
            this.errorMessage = "All fields are required";
        }
    }

    cognitoCallback(message: string) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
        } else { //success
            this.router.navigate(['/home/login']);
        }
    }

}