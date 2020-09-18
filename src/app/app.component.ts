import { Component } from '@angular/core';
import { VersionCheckService } from 'src/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngrx-angular';

  constructor(versionCheckService: VersionCheckService) {
    versionCheckService.initVersionCheck();
  }
}
