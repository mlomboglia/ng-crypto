import {Component, OnInit, ViewChild} from "@angular/core";
import {UserRegistrationService} from "../../../service/user-registration.service";
import {CognitoCallback} from "../../../service/cognito.service";
import {Router} from "@angular/router";

class Login {
    constructor(public email: string = '') {
    }
}

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './resendCode.html'
})
export class ResendCodeComponent implements CognitoCallback {
    @ViewChild('f') form: any;
    model: Login = new Login();
    errorMessage: string;

    constructor(public registrationService: UserRegistrationService, public router: Router) {
    }

    resendCode() {
        this.errorMessage = null;
        if (this.form.valid) {
            this.registrationService.resendCode(this.model.email, this);
        } else {
            this.errorMessage = "All fields are required";
        }
    }

    cognitoCallback(error: any, result: any) {
        if (error != null) {
            this.errorMessage = error;
        } else {
            this.router.navigate(['/home/confirmRegistration', this.model.email]);
        }
    }
}