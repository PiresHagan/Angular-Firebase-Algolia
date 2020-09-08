import { Component } from '@angular/core';
import { MessagingService } from './shared/services/messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(private messagingService: MessagingService) { }
    
	ngOnInit() {
        this.messagingService.requestPermission();
	}
}
