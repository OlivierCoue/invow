import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer   } from '@angular/platform-browser';
import { TcItemYoutube } from './tc-item-youtube.class';

@Component({
    selector: 'tc-item-youtube',
    templateUrl: 'tc-item-youtube.component.html',
    styleUrls: ['../tc-item.component.scss', 'tc-item-youtube.component.scss']
})

export class TcItemYoutubeComponent implements OnInit {

    @Input() itemYoutube: TcItemYoutube;

    public displayVideo: boolean;

    constructor(private sanitizer: DomSanitizer  ) {
    }

    ngOnInit() {
        this.itemYoutube.trustedEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.itemYoutube.embedUrl);
    }
}
