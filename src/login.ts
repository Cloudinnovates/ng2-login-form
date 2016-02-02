import { Component, ElementRef } from 'angular2/core';  
import { FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators, AbstractControl } from 'angular2/common';
import { CustomValidators } from "ng2-login-form/src/custom.validators";

declare var document;
declare var window;

/*
    @component: login-form
    @descrip: Component for implement login form using ajax and validators
*/ 
@Component({  
  selector: 'login-form',  
  directives: [FORM_DIRECTIVES],  
  templateUrl: 'node_modules/ng2-login-form/src/login.html'
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
            break;
        //Bootstrap
        default:
            this.inputsClass = "form-control"; 
            this.btnClass = "btn btn-default";
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
        creds = "email=" + value.email + "&username=" + value.username;
    }
    else{
        creds = "username=" + value.username + "&username=" + value.username;
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
 
