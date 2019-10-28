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
 * @fileoverview Unit tests for SkillRightsBackendApiService.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.
require('App.ts');
require('domain/skill/skill-rights-backend-api.service.ts');
require('pages/skill-editor-page/skill-editor-page.controller.ts');
require('services/CsrfTokenService.ts');

describe('Skill rights backend API service', function() {
  var SkillRightsBackendApiService = null;
  var $rootScope = null;
  var $scope = null;
  var $httpBackend = null;
  var CsrfService = null;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.upgradedServices)) {
      $provide.value(key, value);
    }
  }));

  beforeEach(angular.mock.inject(function($injector, $q) {
    SkillRightsBackendApiService = $injector.get(
      'SkillRightsBackendApiService');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    CsrfService = $injector.get('CsrfTokenService');

    spyOn(CsrfService, 'getTokenAsync').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve('sample-csrf-token');
      return deferred.promise;
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should successfully set a skill to be public', function() {
    var successHandler = jasmine.createSpy('success');
    var failHandler = jasmine.createSpy('fail');

    $httpBackend.expect(
      'PUT', '/skill_editor_handler/publish_skill/0').respond(200);
    SkillRightsBackendApiService.setSkillPublic('0', 1).then(
      successHandler, failHandler);
    $httpBackend.flush();
    $rootScope.$digest();

    expect(successHandler).toHaveBeenCalled();
    expect(failHandler).not.toHaveBeenCalled();
  });

  it('should call the provided fail handler on HTTP failure', function() {
    var successHandler = jasmine.createSpy('success');
    var failHandler = jasmine.createSpy('fail');

    $httpBackend.expect(
      'PUT', '/skill_editor_handler/publish_skill/0').respond(
      500, 'Error loading skill 0.');
    SkillRightsBackendApiService.setSkillPublic('0', 1).then(
      successHandler, failHandler);
    $httpBackend.flush();
    $rootScope.$digest();

    expect(successHandler).not.toHaveBeenCalled();
    expect(failHandler).toHaveBeenCalled();
  });

  it('should report a cached skill rights after caching it', function() {
    var successHandler = jasmine.createSpy('success');
    var failHandler = jasmine.createSpy('fail');

    // The skill should not currently be cached.
    expect(SkillRightsBackendApiService.isCached('0')).toBe(false);
    // Cache a skill.
    SkillRightsBackendApiService.cacheSkillRights('0', {
      skill_id: '0',
      can_edit_skill: true,
      skill_is_private: true,
      creator_id: 'a'
    });

    // It should now be cached.
    expect(SkillRightsBackendApiService.isCached('0')).toBe(true);

    // A new skill should not have been fetched from the backend. Also,
    // the returned skill should match the expected skill object.
    SkillRightsBackendApiService.loadSkillRights('0').then(
      successHandler, failHandler);
    $rootScope.$digest();

    expect(successHandler).toHaveBeenCalledWith({
      skill_id: '0',
      can_edit_skill: true,
      skill_is_private: true,
      creator_id: 'a'
    });
    expect(failHandler).not.toHaveBeenCalled();
  });
});
