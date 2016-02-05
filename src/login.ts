import { Component, ElementRef } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from 'angular2/common';
import { CustomValidators } from "ng2-login-form/src/custom.validators";

declare var document;
declare var window;

const DEFAULT_TEMPLATE = `
  <style>
    .spinner {
      width: 50px;
      height: 40px;
      font-size: 10px;
    }
    .spinner > div {
      background-color: #333;
      height: 100%;
      width: 6px;
      display: inline-block;
    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
      animation: sk-stretchdelay 1.2s infinite ease-in-out;
    }
    .spinner .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }
    .spinner .rect3 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }
    .spinner .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }
    .spinner .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }
    @-webkit-keyframes sk-stretchdelay {
      0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
      20% { -webkit-transform: scaleY(1.0) }
    }
    @keyframes sk-stretchdelay {
      0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
      }  20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
      }
    }
  </style>
  <div class="container">
      <div class="col m10 offset-m1 s12">
          <div class="{{ alertClass }}" id="result_card" style="display: none">
                 <i class="tiny material-icons">info_outline</i> <span class="grey-text text-darken-4" id="result"></span>
              </div>
          <div class="row">
              <form [ngFormModel]="myForm" (ngSubmit)="sendLogin(myForm.value)" class="col s12">
                  <div class="field">
                      <div class="row" *ngIf="typeUsernameOrEmailAttr == 'email'">
                          <label>{{ emailAttr }}</label><label *ngIf="email.hasError('required')"><span style="color: red"> (Required)</span></label>
                          <div *ngIf="email.dirty && !email.valid">
                              <label *ngIf="email.errors.invalidEmailAddress" style="color: red"> Invalid Email </label>
                          </div>
                          <input type="email" id="emailInput" class="{{ inputsClass }}" [ngFormControl]="email">
                      </div>

                      <div class="row" *ngIf="typeUsernameOrEmailAttr == 'username'">
                          <label>{{ usernameAttr }}</label><label *ngIf="username.hasError('required')"><span style="color: red"> (Required)</span></label>
                          <input type="text" id="usernameInput" class="{{ inputsClass }}" [ngFormControl]="username">
                      </div>

                      <div class="row">
                          <label>{{ passwordAttr }}</label><label *ngIf="password.hasError('required')"><span style="color: red"> (Required)</span></label>
                          <input type="password" id="passwordInput" class="{{ inputsClass }}" [ngFormControl]="password">
                      </div>
                  </div>

                  <div class="row">
                    <div class="pull-left spinner" style="display: none"  id="progress">
                      <div class="rect1"></div>
                      <div class="rect2"></div>
                      <div class="rect3"></div>
                      <div class="rect4"></div>
                      <div class="rect5"></div>
                    </div>
                      <div class="pull-left" style="margin-top: 5px">
                          <input type="submit" [disabled]="!myForm.valid"
                          class="{{ btnClass }}"
                          name="action" value="{{ sendAttr }}" />
                      </div>
                  </div>
              </form>
          </div>
      </div>
    </div>
`;
/*
    @component: login-form
    @descrip: Component for implement login form using ajax and validators
*/
@Component({
  selector: 'login-form',
  directives: [FORM_DIRECTIVES],
  template: DEFAULT_TEMPLATE
})
export class LoginForm {
  //Properties
  myForm: ControlGroup;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  typeUsernameOrEmailAttr: string;
  usernameAttr: string;
  emailAttr: string;
  passwordAttr: string;
  sendAttr: string;
  urlAttr: string;
  frameworkCssAttr: string;
  inputsClass: string;
  btnClass: string;
  alertClass: string;

  constructor(fb: FormBuilder, private element:ElementRef) {
    //Get attributes values
    let tag = this.element.nativeElement;
    this.typeUsernameOrEmailAttr = typeof tag.getAttribute('type_username_or_email') !== 'undefined' ? tag.getAttribute('type_username_or_email') : "email";
    this.usernameAttr = typeof tag.getAttribute('username') !== 'undefined' ? tag.getAttribute('username') : "Username";
    this.passwordAttr = typeof tag.getAttribute('password') !== 'undefined' ? tag.getAttribute('password') : "Password";
    this.emailAttr = typeof tag.getAttribute('email') !== 'undefined' ? tag.getAttribute('email') : "Email";
    this.sendAttr = typeof tag.getAttribute('send') !== 'undefined' ? tag.getAttribute('send') : "Send";
    this.urlAttr = typeof tag.getAttribute('url') !== 'undefined' ? tag.getAttribute('url') : "/send/";
    this.frameworkCssAttr = typeof tag.getAttribute('frameworkCss') !== 'undefined' ? tag.getAttribute('frameworkCss') : "bootstrap";

    //Check framework css to use
    switch(this.frameworkCssAttr.toLowerCase()){
        //MaterializeCSS
        case 'materialize':
            this.inputsClass = "validate";
            this.btnClass = "btn-large waves-effect waves-light teal default_color scrollspy";
            this.alertClass = "card-panel";
            break;
        //Bootstrap
        default:
            this.inputsClass = "form-control";
            this.btnClass = "btn btn-default";
            this.alertClass = "alert alert-info";
            break;
    }

    //Validators form
    if(this.typeUsernameOrEmailAttr.trim() == "email"){
        this.myForm = fb.group({
            'email':  ['', Validators.compose([Validators.required, CustomValidators.validateEmail])],
            'password':  ['', Validators.required],
        });

        this.email = this.myForm.controls['email'];
        this.password = this.myForm.controls['password'];
    }else{
        this.myForm = fb.group({
            'username':  ['', Validators.required],
            'password':  ['', Validators.required],
        });

        this.username = this.myForm.controls['username'];
        this.password = this.myForm.controls['password'];
    }
  }

  /*
    @method: sendLogin
    @descrip: Event submit for form login
  */
  sendLogin(value: any): void {

    //Result to send email
    let result = document.querySelector("#result");
    let result_card = document.querySelector("#result_card");
    let progress = document.querySelector("#progress");

    //Hide elements
    result_card.style.display = "none";
    //Show progress
    progress.removeAttribute("style");

    //Parameters
    let creds = "";
    if(this.typeUsernameOrEmailAttr.trim() == "email"){
        creds = "email=" + value.email + "&password=" + value.password;
    }
    else{
        creds = "username=" + value.username + "&password=" + value.password;
    }

    //Send email
    window.fetch(this.urlAttr, {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: creds
    })
    .then((data) => {
        let res = data.text();
        res.then((message) => {
            result.innerHTML = message;
            //Show card message and hide progress
            result_card.style.display = "block";
            progress.style.display = "none";
        });
    })
    .catch((error) => {
        result.innerHTML = "Error al procesar el formulario";
        //Show card message and hide progress
        result_card.style.display = "block";
        progress.style.display = "none";
    });
  }
}
