import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})

export class EventsService {

    constructor(public db: AngularFirestore,
                public router: Router,
                public toastrService: ToastrService) {
    }

    getIncomingData() {
        return this.db.collection('events').doc('Incoming-From-Sensors').valueChanges();
    }

    setDocData(docName, data) {
        console.log('Setting ' + docName + ' Data...!', data);

        return this.db.collection('events').doc(docName).set({data: data}, {merge: true}).then(res=> {
            if (docName != 'Set-Fan-Speed') {
                this.toastrService.success(`${docName.replace('Set-', '').replace('-', ' ').replace('_', '&')} Set to ${data ? 'On' : 'Off'}`);
            } else {
                this.toastrService.success(`Fan Speed Set to ${data}`);
            }
        });
    }

    getDeviceState() {
        return this.db.collection('events').doc('device').valueChanges().subscribe(res => {
            console.log(res);
            if (res['state'] == 'online') {
                this.toastrService.success('Device is online');
            } else {
                this.toastrService.error('Device is offline');
            }
        });
    }
}
