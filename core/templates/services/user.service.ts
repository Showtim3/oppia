// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {downgradeInjectable} from '@angular/upgrade/static';
import {Injectable} from '@angular/core';

import {UrlInterpolationService} from 'domain/utilities/url-interpolation.service';
import {HttpClient} from '@angular/common/http';
import {UserInfoObjectFactory} from 'domain/user/UserInfoObjectFactory';
import {UrlService} from 'services/contextual/url.service';
import {WindowRef} from 'services/contextual/window-ref.service';
import {AppConstants} from 'app.constants';


/**
 * @fileoverview Service for user data.
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {
  PREFERENCES_DATA_URL = '/preferenceshandler/data';
  USER_COMMUNITY_RIGHTS_DATA_URL = '/usercommunityrightsdatahandler';

  userInfo = null;
  userCommunityRightsInfo = null;

  constructor(
      private httpClient: HttpClient,
      private urlService: UrlService,
      private urlInterpolationService: UrlInterpolationService,
      private userInfoObjectFactory: UserInfoObjectFactory,
      private windowRef: WindowRef
  ) {}

  getUserInfoAsync() {
    if (this.urlService.getPathname() === '/signup') {
      return Promise.resolve(this.userInfoObjectFactory.createDefault());
    }
    if (this.userInfo) {
      return Promise.resolve(this.userInfo);
    }
    return this.httpClient.get(
      '/userinfohandler'
    ).toPromise().then((response: any) => {
      if (response.data.user_is_logged_in) {
        this.userInfo = (
          this.userInfoObjectFactory.createFromBackendDict(response.data));
        return Promise.resolve(this.userInfo);
      } else {
        return Promise.resolve(this.userInfoObjectFactory.createDefault());
      }
    });
  }

  getProfileImageDataUrlAsync() {
    let profilePictureDataUrl = (
      this.urlInterpolationService.getStaticImageUrl(
        AppConstants.DEFAULT_PROFILE_IMAGE_PATH));
    return new Promise((resolve, reject) => {
      this.getUserInfoAsync().then((userInfo) => {
        if (userInfo.isLoggedIn()) {
          this.httpClient.get(
            '/preferenceshandler/profile_picture'
          ).toPromise().then((response: any) => {
            if (response.data.profile_picture_data_url) {
              profilePictureDataUrl = response.data.profile_picture_data_url;
            }
            return resolve(profilePictureDataUrl);
          });
        } else {
          return resolve(profilePictureDataUrl);
        }
      });
    });
  }

  setProfileImageDataUrlAsync(newProfileImageDataUrl) {
    return this.httpClient.put(this.PREFERENCES_DATA_URL, {
      update_type: 'profile_picture_data_url',
      data: newProfileImageDataUrl
    }).toPromise();
  }

  getLoginUrlAsync() {
    let urlParameters = {
      current_url: this.windowRef.nativeWindow.location.pathname
    };
    return this.httpClient.get('/url_handler', {params: urlParameters}).toPromise().then(
      (response: any) => {
        return response.data.login_url;
      }
    );
  }

  getUserCommunityRightsData(): Promise<Object> {
    return new Promise((resolve, reject) => {
      if (this.userCommunityRightsInfo) {
        return resolve(this.userCommunityRightsInfo);
      } else {
        return this.httpClient.get(
          this.USER_COMMUNITY_RIGHTS_DATA_URL).toPromise().then(
          (response: any) => {
            this.userCommunityRightsInfo = response.data;
            return resolve(this.userCommunityRightsInfo);
          }
        );
      }
    });
  }
}

angular.module('oppia').factory(
  'UserService', downgradeInjectable(UserService));
