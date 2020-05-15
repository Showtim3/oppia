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

/**
 * @fileoverview Tests that the user service is working as expected.
 */

import { UserInfoObjectFactory } from 'domain/user/UserInfoObjectFactory';
import {CsrfTokenService} from 'services/csrf-token.service';
import {UrlService} from 'services/contextual/url.service';
import {UrlInterpolationService} from 'domain/utilities/url-interpolation.service';
import {UserService} from 'services/user.service';
import {HttpTestingController, HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed, flushMicrotasks, fakeAsync} from '@angular/core/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {WindowRef} from 'services/contextual/window-ref.service';


fdescribe('User Service', () => {
  let userService: UserService = null;
  let urlInterpolationService: UrlInterpolationService = null;
  let userInfoObjectFactory: UserInfoObjectFactory;
  let csrfTokenService: CsrfTokenService = null;
  let urlService: UrlService;
  let httpTestingController: HttpTestingController = null;
  let sampleUserInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    userService = TestBed.get(UserService);
    urlInterpolationService = TestBed.get(UrlInterpolationService);
    urlService = TestBed.get(UrlService);
    // The injector is required because this service is directly used in this
    // spec, therefore even though UserInfoObjectFactory is upgraded to
    // Angular, it cannot be used just by instantiating it by its class but
    // instead needs to be injected. Note that 'userInfoObjectFactory' is
    // the injected service instance whereas 'UserInfoObjectFactory' is the
    // service class itself. Therefore, use the instance instead of the class in
    // the specs.
    userInfoObjectFactory = TestBed.get(UserInfoObjectFactory);
    httpTestingController = TestBed.get(HttpTestingController);
    sampleUserInfo = userInfoObjectFactory.createDefault();
    csrfTokenService = TestBed.get(CsrfTokenService);
    spyOn(csrfTokenService, 'getTokenAsync').and.callFake(function() {
      return new Promise((resolve, reject) => {
        resolve('sample-csrf-token');
      });
    });
    // spyOn(urlService, 'getPathname').and.returnValue('/home');
    // spyOn(window.location, 'pathname').and.returnValue('home');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // it('should return userInfo data', () => {
  //   // creating a test user for checking profile picture of user.
  //   let sampleUserInfoBackendObject = {
  //     is_moderator: false,
  //     is_admin: false,
  //     is_super_admin: false,
  //     is_topic_manager: false,
  //     can_create_collections: true,
  //     preferred_site_language_code: null,
  //     username: 'tester',
  //     user_is_logged_in: true
  //   };
  //
  //   let sampleUserInfo = userInfoObjectFactory.createFromBackendDict(
  //     sampleUserInfoBackendObject);
  //
  //   userService.getUserInfoAsync().then((userInfo) => {
  //     expect(userInfo.isAdmin()).toBe(sampleUserInfo.isAdmin());
  //     expect(userInfo.isSuperAdmin()).toBe(sampleUserInfo.isSuperAdmin());
  //     expect(userInfo.isModerator()).toBe(sampleUserInfo.isModerator());
  //     expect(userInfo.isTopicManager()).toBe(sampleUserInfo.isTopicManager());
  //     expect(userInfo.isLoggedIn()).toBe(sampleUserInfo.isLoggedIn());
  //     expect(userInfo.canCreateCollections()).toBe(
  //       sampleUserInfo.canCreateCollections());
  //     expect(userInfo.getUsername()).toBe(sampleUserInfo.getUsername());
  //     expect(userInfo.getPreferredSiteLanguageCode()).toBe(
  //       sampleUserInfo.getPreferredSiteLanguageCode());
  //   });
  //
  //   const req = httpTestingController.expectOne('/userinfohandler');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(sampleUserInfoBackendObject);
  // });
  //
  // it('should return new userInfo data when url path is signup', () => {
  //   // spyOn(urlService, 'getPathname').and.returnValue('/signup');
  //   // spyOn(urlService, 'getPathname').and.callFake(function() {
  //   //   return '/signup';
  //   // });
  //   // spyOn(urlService, 'getPathname').and.returnValue('/signup');
  //   spyOn(UrlService, 'getPathname').and.returnValue('/signup');
  //   let sample = userInfoObjectFactory.createDefault();
  //   userService.getUserInfoAsync().then((userInfo) => {
  //     expect(userInfo).toEqual(sample);
  //   });
  // });
  //
  // it('should not fetch userInfo if it is was fetched before', () => {
  //   const sampleUserInfoBackendObject = {
  //     is_moderator: false,
  //     is_admin: false,
  //     is_super_admin: false,
  //     is_topic_manager: false,
  //     can_create_collections: true,
  //     preferred_site_language_code: null,
  //     username: 'tester',
  //     user_is_logged_in: true
  //   };
  //
  //   userService.getUserInfoAsync().then((userInfo) => {
  //     expect(userInfo).toEqual(sampleUserInfo);
  //     // Fetch userInfo again
  //     userService.getUserInfoAsync().then(function(sameUserInfo) {
  //       expect(sameUserInfo).toEqual(userInfo);
  //     });
  //   });
  //
  //   const req = httpTestingController.expectOne('/userinfohandler');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(sampleUserInfoBackendObject);
  // });
  //
  // it('should return new userInfo data if user is not logged', function() {
  //   const sampleUserInfoBackendObject = {
  //     is_moderator: false,
  //     is_admin: false,
  //     is_super_admin: false,
  //     is_topic_manager: false,
  //     can_create_collections: true,
  //     preferred_site_language_code: null,
  //     username: 'tester',
  //     user_is_logged_in: false
  //   };
  //
  //   userService.getUserInfoAsync().then((userInfo) => {
  //     expect(userInfo).toEqual(sampleUserInfo);
  //   });
  //
  //   const req = httpTestingController.expectOne('/userinfohandler');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(sampleUserInfoBackendObject);
  // });

  it('should return image data', () => {
    const requestUrl = '/preferenceshandler/profile_picture';
    // Create a test user for checking profile picture of user.

    const sampleUserInfoBackendObject = {
      is_moderator: false,
      is_admin: false,
      is_super_admin: false,
      is_topic_manager: false,
      can_create_collections: true,
      preferred_site_language_code: null,
      username: 'tester',
      user_is_logged_in: true
    };

    userService.getProfileImageDataUrlAsync().then(function(dataUrl) {
      expect(dataUrl).toBe('image data');
    });

    let req = httpTestingController.expectOne('/userinfohandler');
    expect(req.request.method).toEqual('GET');
    req.flush(sampleUserInfoBackendObject);

    // req = httpTestingController.expectOne(requestUrl);
    // req.flush({profile_picture_data_url: 'image data'});
    // expect(req.request.method).toEqual('GET');

    userService.getProfileImageDataUrlAsync().then(function(dataUrl) {
      expect(dataUrl).toBe(urlInterpolationService.getStaticImageUrl(
        '/avatar/user_blue_72px.png'));
    });

    req = httpTestingController.expectOne('/userinfohandler');
    expect(req.request.method).toEqual('GET');
    req.flush(sampleUserInfoBackendObject);

    // req = httpTestingController.expectOne(requestUrl);
    // req.error(new ErrorEvent('Error'), {status: 404});
  });
  //
  // it('should return the default profile image path when user is not logged',
  //   () => {
  //     const sampleUserInfoBackendObject = {
  //       is_moderator: false,
  //       is_admin: false,
  //       is_super_admin: false,
  //       is_topic_manager: false,
  //       can_create_collections: true,
  //       preferred_site_language_code: null,
  //       username: 'tester',
  //       user_is_logged_in: false
  //     };
  //
  //     userService.getProfileImageDataUrlAsync().then(function(dataUrl) {
  //       expect(dataUrl).toBe(urlInterpolationService.getStaticImageUrl(
  //         '/avatar/user_blue_72px.png'));
  //     });
  //
  //     const req = httpTestingController.expectOne('/userinfohandler');
  //     expect(req.request.method).toEqual('GET');
  //     req.flush(sampleUserInfoBackendObject);
  //   });
  //
  // it('should return the login url', function() {
  //   let loginUrl = '/login';
  //   let currentUrl = 'home';
  //
  //   userService.getLoginUrlAsync().then((dataUrl) => {
  //     expect(dataUrl).toBe(loginUrl);
  //   });
  //
  //   const req = httpTestingController.expectOne((req) => {
  //     return req.method === 'GET' && req.url === '/url_handler';
  //   });
  //
  //   expect(req.request.method).toEqual('GET');
  //   req.flush({login_url: loginUrl});
  // });
  //
  // it('should set a profile image data url', () => {
  //   let newProfileImageDataurl = '/avatar/x.png';
  //
  //   userService.setProfileImageDataUrlAsync(newProfileImageDataurl).then(
  //     (response: any) => {
  //       expect(response.profile_picture_data_url).toBe(
  //         newProfileImageDataurl);
  //     }
  //   );
  //   const req = httpTestingController.expectOne('/preferenceshandler/data');
  //   expect(req.request.method).toEqual('PUT');
  //   req.flush({profile_picture_data_url: newProfileImageDataurl});
  // });
  //
  // it('should handle when set profile image data url is reject', () => {
  //   let newProfileImageDataurl = '/avatar/x.png';
  //   let errorMessage = 'It\'s not possible to set a new profile image data';
  //
  //   const errorResponse = new HttpErrorResponse({
  //     error: errorMessage,
  //     status: 500
  //   });
  //
  //   userService.setProfileImageDataUrlAsync(newProfileImageDataurl)
  //     /* eslint-disable dot-notation */
  //     .catch((error: HttpErrorResponse) => {
  //     /* eslint-enable dot-notation */
  //       expect(error.error.errorMessage).toEqual(errorMessage);
  //     });
  //
  //   const req = httpTestingController.expectOne('/preferenceshandler/data');
  //   req.error(new ErrorEvent('Error'), errorResponse);
  //   expect(req.request.method).toEqual('PUT');
  //   // req.flush({}, {status: 500, statusText: errorMessage});
  // });
  //
  // it('should return user community rights data', () => {
  //   const sampleUserCommunityRightsDict = {
  //     translation: ['hi'],
  //     voiceover: [],
  //     question: true
  //   };
  //
  //   userService.getUserCommunityRightsData().then((userCommunityRights) => {
  //     expect(userCommunityRights).toEqual(sampleUserCommunityRightsDict);
  //   });
  //
  //   const req = httpTestingController.expectOne('/usercommunityrightsdatahandler');
  //   expect(req.request.method).toEqual('GET');
  //   req.flush(sampleUserCommunityRightsDict);
  // });
  //
  // it('should not fetch userCommunityRights if it is was fetched before',
  //   () => {
  //     const sampleUserCommunityRightsDict = {
  //       translation: ['hi'],
  //       voiceover: [],
  //       question: true
  //     };
  //
  //     userService.getUserCommunityRightsData().then(
  //       (userCommunityRights) => {
  //         expect(userCommunityRights).toEqual(sampleUserCommunityRightsDict);
  //         // Fetch userCommunityRightsInfo again.
  //         userService.getUserCommunityRightsData().then((
  //             sameUserCommunityRights) => {
  //           expect(sameUserCommunityRights).toEqual(
  //             sampleUserCommunityRightsDict);
  //         });
  //       });
  //
  //     const req = httpTestingController.expectOne('/usercommunityrightsdatahandler');
  //     expect(req.request.method).toEqual('GET');
  //     req.flush(sampleUserCommunityRightsDict);
  //   });
});
