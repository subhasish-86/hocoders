import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {tokenNotExpired} from 'angular2-jwt';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
    lock = new Auth0Lock('B9mm5D14EcXpnQtKUfQnz3wewfwmL5ua', 'darkdefender27.auth0.com');
    refreshSubscription: any;
    user: Object;
    zoneImpl: NgZone;

    constructor(zone: NgZone, private router: Router) {
        this.zoneImpl = zone;
        this.user = JSON.parse(localStorage.getItem('profile'));
    }

    public authenticated() {
        // Check if there's an unexpired JWT
        return tokenNotExpired();
    }

    public login() {
        // Show the Auth0 Lock widget
        this.lock.show({}, (err, profile, token) => {
            if (err) {
                alert(err);
                return;
            }
            // If authentication is successful, save the items
            // in local storage
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('id_token', token);
            this.zoneImpl.run(() => this.user = profile);
        });
    }

    public logout() {
        localStorage.removeItem('profile');
        localStorage.removeItem('id_token');
        this.zoneImpl.run(() => this.user = null);
        this.router.navigate(['Dashboard']);
    }
}