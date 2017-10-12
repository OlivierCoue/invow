import { Component, OnInit }   from '@angular/core';
import { TcAuthService }          from '../tc-auth/tc-auth.service';
import { Router } from '@angular/router';
import { URLSearchParams  }   from '@angular/http';
import { TcCollectionService }   from '../tc-collection/tc-collection.service';
import { TcCollection } from '../tc-collection/tc-collection.class';
import { TcLanguageService } from '../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-dashboard.component.html',
    styleUrls: ['./tc-dashboard.component.scss']
})

export class TcDashboardComponent implements OnInit {

    public myCollections: TcCollection[];
    public myFavoriteCollections: TcCollection[];
    public isUpdatingPosition: boolean;

    constructor(public t: TcLanguageService, public authService: TcAuthService, private router: Router, private service: TcCollectionService) {
    }

    ngOnInit() {
        this.initMyCollections();
        this.initMyFavoriteCollections();
    }

    initMyCollections(){
        this.myCollections = [];
        let params = new URLSearchParams();
        params.set('populate', '_author+_thumbnail');
        params.set('custom_sort', 'true');
        params.set('limit', '7');
        params.set('_author', this.authService.currentUser._id);
        this.service.getCollections(params).subscribe(collections => {
            collections.sort(function(a, b){
                if(a.position < b.position) return -1;
                if(a.position > b.position) return 1;
                return 0;
            });
            this.myCollections = collections;
        }, () => {});
    }

    initMyFavoriteCollections(){
        let params = new URLSearchParams();
        params.set('populate', '_author+_thumbnail');
        params.set('sort_field', 'createdAt');
        params.set('sort_dir', '-1');
        params.set('limit', '8');
        params.set('_starredBy', this.authService.currentUser._id);
        this.service.getCollections(params).subscribe(collections => {
            this.myFavoriteCollections = collections;
        }, () => {});
    }

    onbCollectionCreated(event){
        if(event.value){
            this.router.navigate(['/c', event.value._id]);
        }
    }

    onCollectionMoved(event){
        this.isUpdatingPosition = true;
        this.service.putCollection(event.value.modifiedItem).subscribe(collection => {
            this.isUpdatingPosition = false;
        }, (err) => {
            this.initMyCollections();
            this.isUpdatingPosition = false;
        });
    }

}
