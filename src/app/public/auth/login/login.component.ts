import {Component, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {UserLoginService} from "../../../service/user-login.service";
import {CognitoCallback, LoggedInCallback} from "../../../service/cognito.service";
import {DynamoDBService} from "../../../service/ddb.service";

class Login {
    constructor(public email: string = '',
                public password: string = '') {
    }
  }

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {
    errorMessage: string;
    model: Login = new Login();
    @ViewChild('f') form: any;

    constructor(public router: Router,
                public ddb: DynamoDBService,
                public userService: UserLoginService) {
        console.log("LoginComponent constructor");
    }

    ngOnInit() {
        this.errorMessage = null;
        console.log("Checking if the user is already authenticated. If so, then redirect to the secure site");
        this.userService.isAuthenticated(this);
    }

    onLogin() {
        if (this.form.valid) {
            console.log(this.model.email);
            console.log(this.model.password);
            this.userService.authenticate(this.model.email, this.model.password, this);
        } else {
            this.errorMessage = "All fields are required";
        }
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            console.log("result: " + this.errorMessage);
            if (this.errorMessage === 'User is not confirmed.') {
                console.log("redirecting");
                this.router.navigate(['/home/confirmRegistration', this.model.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                console.log("redirecting to set new password");
                this.router.navigate(['/home/newPassword']);
            }
        } else { //success
            this.ddb.writeLogEntry("login");
            this.router.navigate(['/securehome']);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn)
            this.router.navigate(['/securehome']);
    }
}