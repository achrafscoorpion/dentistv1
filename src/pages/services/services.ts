import { Component } from '@angular/core';
import {Service} from "../../models/service.models";
import { NavController, AlertController, Loading, LoadingController } from 'ionic-angular';
import { ApiClient } from "../../providers/api-client.service";
import { Subscription } from "rxjs/Subscription";
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
  providers: [ApiClient]
})

export class ServicesPage {
	private loading:Loading;
	private loadingShown:Boolean = false;
	private subscriptions:Array<Subscription> = [];
	private services = new Array<Service>();
	
	constructor(private toastCtrl: ToastController, public navCtrl: NavController, private service:ApiClient, private loadingCtrl:LoadingController, private alertCtrl:AlertController) {
		let savedList: Array<Service> = JSON.parse(window.localStorage.getItem('services'));
		if(savedList != null && savedList.length!=0) {
			this.services = savedList;
		}
		this.loadServices();
	}
	
	loadServices() {
		this.presentLoading('Fetching services');
		let subscription:Subscription = this.service.serviceList(window.localStorage.getItem('api_key')).subscribe(data => {
		this.services = data;
		window.localStorage.setItem('services', JSON.stringify(this.services));
		this.dismissLoading();
		}, err=> {
			console.log('loading error');
			this.dismissLoading();
			this.presentErrorAlert("Unable to process your request at this time");
		});
		this.subscriptions.push(subscription);
	}
	
	private presentLoading(message:string) {
        this.loading = this.loadingCtrl.create({
            content: message
        });

        this.loading.onDidDismiss(() => {});

        this.loading.present();
		this.loadingShown = true;
    }
	
	private dismissLoading(){
		if(this.loadingShown){
			this.loadingShown = false;
			this.loading.dismiss();
		}
	}
	
	private presentErrorAlert(msg:string) {
        let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: msg,
            buttons: ['Dismiss']
        });
        alert.present();
    }
	
	showToast(message:string) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'bottom'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
}
