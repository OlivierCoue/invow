import { Component }   from '@angular/core';
import { ROUTER_DIRECTIVES, Router }      from '@angular/router';
import { IvAuthService } from './iv-auth.service';
import { IvUser }        from '../iv-user/iv-user.class';
import { IvUserService } from '../iv-user/iv-user.service';

@Component({
    selector: 'iv-signup',
    templateUrl: './iv-signup.component.html',
    styleUrls: ['./iv-auth.component.scss'],
    directives: [ROUTER_DIRECTIVES]
})

export class IvSignupComponent {

    public passWordValid: boolean;

    public usernameState: string;
    public validatingUsername: boolean;
    private typingUsernameTimer;
    private doneTypingUsernameInterval: number;

    public emailState: string;
    public validatingEmail: boolean;
    public typingEmailTimer;
    public doneTypingEmailInterval: number;

    signupData = new class SignupData{
        username: string;
        lastChekedUsername: string;
        email: string;
        lastChekedEmail: string;
        password: string;
        passwordRepeat: string;
    };

    constructor(private userService: IvUserService, public authService: IvAuthService, public router: Router) {
        this.doneTypingUsernameInterval = 1000;
        this.doneTypingEmailInterval = 1000;
    }

    public onUsernameKeyUp(){
        if(this.signupData.lastChekedUsername == this.signupData.username)
            return;
        this.signupData.lastChekedUsername = this.signupData.username;
        this.usernameState = IvUser.isValidUsername(this.signupData.username) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingUsernameTimer);
        new Promise((resolve, reject) => {
            this.typingUsernameTimer = setTimeout(()=>{resolve(true);}, this.doneTypingUsernameInterval);
        }).then((e)=>{
            this.checkUsername();
        })
    }

    public onUsernameKeyDown(){
        clearTimeout(this.typingUsernameTimer);
    }

    public checkUsername(){
        if(!IvUser.isValidUsername(this.signupData.username)){
            this.usernameState = 'INVALID';
            return;
        }
        this.userService.getValidUsername(this.signupData.username).subscribe((isValid) => {
            this.usernameState = isValid ? 'FREE' : 'TAKEN';
            this.validatingUsername = false;
        })
    }

    public onEmailKeyUp(){
        if(this.signupData.lastChekedEmail == this.signupData.email)
            return;
        this.signupData.lastChekedEmail = this.signupData.email;
        this.emailState = IvUser.isValidEmail(this.signupData.email) ? 'VALIDATING' : 'INVALID';
        clearTimeout(this.typingEmailTimer);
        new Promise((resolve, reject) => {
            this.typingEmailTimer = setTimeout(()=>{resolve(true);}, this.doneTypingEmailInterval);
        }).then((e)=>{
            this.checkEmail();
        })
    }

    public onEmailKeyDown(){
        clearTimeout(this.typingEmailTimer);
    }

    private checkEmail(){
        if(!IvUser.isValidEmail(this.signupData.email)){
            this.emailState = 'INVALID';
            return;
        }
        this.userService.getValidEmail(this.signupData.email).subscribe((isValid) => {
            this.emailState = isValid ? 'FREE' : 'TAKEN';
        })
    }

    public isFormValid(){
        return  this.usernameState == 'FREE' &&
                this.emailState == 'FREE' &&
                this.signupData.password &&
                this.signupData.password.length > 3 &&
                this.signupData.password === this.signupData.passwordRepeat;
    }

    onSignupSubmit() {
        if(!this.isFormValid())
            return;
        let user = new IvUser(
            undefined,
            undefined,
            undefined,
            this.signupData.username,
            this.signupData.username,
            this.signupData.email,
            this.signupData.password
            );
        this.authService.signup(user).then(success => {
            console.log(success);
            this.router.navigate(['/']);
        });
    }

}
