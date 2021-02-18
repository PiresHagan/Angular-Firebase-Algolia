import { Component } from '@angular/core';
import { AuthService } from './shared/services/authentication.service';
import { MessagingService } from './shared/services/messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(
        private messagingService: MessagingService,
        public authService: AuthService
    ) { }

    
	ngOnInit() {
        this.messagingService.requestPermission();
	}
}
