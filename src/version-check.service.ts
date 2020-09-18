
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionCheckService {
  // this will be replaced by actual hash post-build.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private http: HttpClient) {
  }

  /**
   * Checks in every set frequency the version of frontend application
   * @param url
   * @param {number} frequency - in milliseconds, defaults to 30 minutes
   */
  public initVersionCheck(frequency = 10000) {
    const url = 'https://' + window.location.host;
    console.log('currentHash from main', this.currentHash);
    this.checkVersion(`${url}/version.json`);
    // comment below if polling is not required.
    setInterval(() => {
      this.checkVersion(`${url}/version.json`);
    }, frequency);
  }

  /**
   * Will do the call and check if the hash has changed or not
   * @param url
   */
  private checkVersion(url) {

    // timestamp these requests to invalidate caches

    this.http.get(url + '?t=' + new Date().getTime()).pipe(first())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);
          // If new version, do something
          if (hashChanged) {
            // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
            // for an example: location.reload();
            this.currentHash = hash;
            window.alert('current hash from alert' + this.currentHash);
            window.location.reload(true);
          }
          // store the new hash so we wouldn't trigger versionChange again
          this.currentHash = hash;
        },
        (err) => {
          console.error(err, 'Could not get version');
        }
      );
  }

  /**
   * Checks if hash has changed.
   * This file has the JS hash, if it is a different one than in the version.json
   * we are dealing with version change
   * @param currentHash
   * @param newHash
   * @returns {boolean}
   */
  private hasHashChanged(currentHash, newHash) {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
