import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThumbnailComponent implements OnInit {
  @Input('url') coverUrl: string;
  @Input('alt') alt: string;
  
  constructor(private sanitize: DomSanitizer) {
  }
  
  ngOnInit() {
  }

  sanitizeBookCover(): SafeUrl {
    return this.sanitize.bypassSecurityTrustUrl(this.coverUrl)
  }
}
