import React from 'react';
// import {} from 'react-facebook'
import { useEffect } from 'react';

const Facebook = () => {
    let func1;
    useEffect(() => {
        // Load the Facebook SDK asynchronously
        func1=function loadFacebookSDK() {
          window.fbAsyncInit = function() {
            FB.init({
              appId: '1468165183808821',
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v19.0'
            });
    
            FB.getLoginStatus(function(response) {
              if (response.status === 'connected') {
                console.log('Logged in.');
                // User is logged in, fetch user's information
                FB.api('/me', { fields: 'name, email' }, function(response) {
                  console.log('Welcome! Fetching your information...');
                  console.log('Good to see you, ' + response.name + '. I see your email address is ' + response.email);
                });
              } else {
                console.log('Not logged in.');
                // User is not logged in, open login dialog
                FB.login(function(response) {
                  if (response.authResponse) {
                    console.log('Logged in.');
                  } else {
                    console.log('User cancelled login or did not fully authorize.');
                  }
                });
              }
            });
          };
    
          // Load the SDK asynchronously
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        }
    
        // loadFacebookSDK();
      }, []);
  return (
    <div>
      <div id="fb-root">
      <div className="fb-login-button" 
           data-width="" 
           data-size="" 
           data-button-type="" 
           data-layout="" 
           data-auto-logout-link="false" 
           data-use-continue-as="false" onClick={func1}>
            Login
      </div>
    </div>
    </div>
  )
}

export default Facebook
