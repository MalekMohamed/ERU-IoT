import {Component, ViewChild} from '@angular/core';
import {EventsService} from '../../shared/services/events.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    public events;

    constructor(private eventsService: EventsService) {
        eventsService.getIncomingData().subscribe(events => {
            this.events = events;
            console.log(events);
        });
        eventsService.getDeviceState();
    }

    setData(docName, Data) {
        if (this.eventsService.deviceIsOnline) {
            this.eventsService.setDocData(docName, Data);
        } else {
            this.eventsService.toastrService.error('Device is offline');
        }
    }
}

