// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for the csrf service
 */

// This needs to be imported first instead of using the global definition
// because Angular doesn't support global definitions and every library used
// needs to be imported explicitly.
import $ from 'jquery';

// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
import {CsrfTokenService} from './CsrfTokenService';
// ^^^ This block is to be removed.

require('services/CsrfTokenService.ts');

describe('Csrf Token Service', function() {
  let csrfTokenService: CsrfTokenService ;
  // let $q: any = new Promise((resolve, reject) => {
  //   resolve({token: 'sample-csrf-token'});
  // });

  beforeEach(() => {
    csrfTokenService = new CsrfTokenService();
    // spyOn($, 'ajax').and.returnValue($q);
  });

  it('should correctly set the csrf token', (done) => {
    csrfTokenService.initializeToken();

    csrfTokenService.getTokenAsync().then(function(token) {
      expect(token).toEqual('sample-csrf-token');
    }).then(done, done.fail);
  });

  it('should error if initialize is called more than once', () => {
    csrfTokenService.initializeToken();

    expect(csrfTokenService.initializeToken)
      .toThrowError('Token request has already been made');
  });

  it('should error if getTokenAsync is called before initialize', () => {
    expect(csrfTokenService.getTokenAsync())
      .toThrowError('Token needs to be initialized');
  });
});
