ng2-login-form
================

Login form for Angular 2. Using:

1. Angular2 (2.0.0-beta.0)
2. SystemJs
3. Support MaterializeCss or Bootstrap

Getting started
---------------

1. Install via npm::

    npm install ng2-login-form --save
    
2. Configure SystemJs. In this case the main folder is **app**::

    <script>
      System.config({
        paths: {
            'ng2-login-form/*': 'node_modules/ng2-login-form/*.js',
        },
        packages: {        
          app: {
            format: 'register',
            defaultExtension: 'js'
          }
        }
      });
      System.import('app/boot')
            .then(null, console.error.bind(console));
    </script>
    
3. Add to the file boot.ts the class LoginForm::

    import {bootstrap} from 'angular2/platform/browser';
    import {LoginForm} from 'ng2-login-form/src/login';

    bootstrap(LoginForm);
    
4. Add the tag <login-form>::
    
    //With type email
    <login-form 
        type_username_or_email="email" email="Correo electrónico" send="Ingresar"
        password="Contraseña" frameworkCss="materialize" url="login">
    </login-form>
    
    //With type username
    <login-form 
        type_username_or_email="username" username="Nombre de usuario" send="Ingresar"
        password="Contraseña" frameworkCss="materialize" url="login">
    </login-form>

The attributes are not obligatory have default values. For example::
    
    Value default of 'type_username_or_email': In this case value default is the type email.
    Value default of 'username': 'Username'.
    Value default of 'email': 'Email'.
    Value default of 'password': 'Password'.
    Value default of 'frameworkCss': 'bootstrap'.
    Value default of 'send': 'Send'.
    Value default of 'url': 'send'.
    
This last attribute (url) is the url that receives POST parameters to the backend.

5. This component using API Fetch, if is necessary add polyfill https://github.com/github/fetch. Not is obligatory.
    
Example
-------

Check the file index_

To the run example of the folder **example**::

    npm install
    npm start

.. _index: https://github.com/mapeveri/ng2-login-form/blob/master/example/index.html

