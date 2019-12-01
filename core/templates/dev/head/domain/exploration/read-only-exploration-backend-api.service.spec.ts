// Copyright 2015 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for ReadOnlyExplorationBackendApiService.
 */

import {fakeAsync, flushMicrotasks, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from
  '@angular/common/http/testing';
import {ReadOnlyExplorationBackendApiService} from
  'domain/exploration/read-only-exploration-backend-api.service';

fdescribe('Read only exploration backend API service', () => {
  let readOnlyExplorationBackendApiService:
      ReadOnlyExplorationBackendApiService = null;
  // Sample exploration object returnable from the backend
  let httpTestingController: HttpTestingController = null;
  let sampleDataResults;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReadOnlyExplorationBackendApiService]
    });
    sampleDataResults = {
      exploration_id: '0',
      is_logged_in: true,
      session_id: 'KERH',
      exploration: {
        init_state_name: 'Introduction',
        states: {
          Introduction: {
            param_changes: [],
            content: {
              html: '',
              audio_translations: {}
            },
            unresolved_answers: {},
            interaction: {
              customization_args: {},
              answer_groups: [],
              default_outcome: {
                param_changes: [],
                dest: 'Introduction',
                feedback: {
                  html: '',
                  audio_translations: {}
                }
              },
              confirmed_unclassified_answers: [],
              id: null
            }
          }
        }
      },
      version: 1,
      state_classifier_mapping: {}
    };
    readOnlyExplorationBackendApiService = TestBed.get(
      ReadOnlyExplorationBackendApiService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should successfully fetch an existing exploration from the backend',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      readOnlyExplorationBackendApiService.fetchExploration(
        '0', null).then(successHandler, failHandler);

      let req = httpTestingController.expectOne('/explorehandler/init/0');
      expect(req.request.method).toEqual('GET');
      req.flush(sampleDataResults);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();
    })
  );
  // todo failed
  fit('should load a cached exploration after fetching it from the backend',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      // Loading a exploration the first time should fetch it from the backend.
      readOnlyExplorationBackendApiService.loadExploration(
        '0', null).then(successHandler, failHandler);

      let req = httpTestingController.expectOne('/explorehandler/init/0');
      expect(req.request.method).toEqual('GET');
      req.flush(sampleDataResults);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();

      // Loading a exploration the second time should not fetch it.
      readOnlyExplorationBackendApiService.loadExploration(
        '0', null).then(successHandler, failHandler);
      let req2 = httpTestingController.expectOne('/explorehandler/init/0');
      expect(req2.request.method).toEqual('GET');
      req2.flush(sampleDataResults);

      // req.flush(sampleDataResults);
      // todo
      // flushMicrotasks();
      httpTestingController.expectNone('/explorehandler/init/0');
      flushMicrotasks();
      expect(successHandler).toHaveBeenCalled();
      expect(failHandler).not.toHaveBeenCalled();
    }));

  it('should use the rejection handler if the backend request failed',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      // Loading a exploration the first time should fetch it from the backend.
      // $httpBackend.expect('GET', '/explorehandler/init/0').respond(
      //   500, 'Error loading exploration 0.');
      readOnlyExplorationBackendApiService.loadExploration(
        '0', null).then(successHandler, failHandler);

      const req = httpTestingController.expectOne('/explorehandler/init/0');
      expect(req.request.method).toEqual('GET');
      req.flush('Error loading exploration 0.', {
        status: 500, statusText: 'Invalid Request'
      });

      flushMicrotasks();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalled();
    }));

  it('should report caching and support clearing the cache', fakeAsync(() => {
    let successHandler = jasmine.createSpy('success');
    let failHandler = jasmine.createSpy('fail');

    // The exploration should not currently be cached.
    expect(readOnlyExplorationBackendApiService.isCached('0')).toBe(false);

    // Loading a exploration the first time should fetch it from the backend.
    readOnlyExplorationBackendApiService.loadLatestExploration('0').then(
      successHandler, failHandler);

    let req = httpTestingController.expectOne('/explorehandler/init/0');
    expect(req.request.method).toEqual('GET');
    req.flush(sampleDataResults);

    flushMicrotasks();

    expect(successHandler).toHaveBeenCalled();
    expect(failHandler).not.toHaveBeenCalled();

    // The exploration should now be cached.
    expect(readOnlyExplorationBackendApiService.isCached('0')).toBe(true);

    // The exploration should be loadable from the cache.
    readOnlyExplorationBackendApiService.loadLatestExploration('0').then(
      successHandler, failHandler);
    expect(successHandler).toHaveBeenCalled();
    expect(failHandler).not.toHaveBeenCalled();

    // Resetting the cache will cause another fetch from the backend.
    readOnlyExplorationBackendApiService.clearExplorationCache();
    expect(readOnlyExplorationBackendApiService.isCached('0')).toBe(false);

    readOnlyExplorationBackendApiService.loadLatestExploration('0').then(
      successHandler, failHandler);

    req = httpTestingController.expectOne('/explorehandler/init/0');
    expect(req.request.method).toEqual('GET');
    req.flush(sampleDataResults);

    flushMicrotasks();

    expect(successHandler).toHaveBeenCalled();
    expect(failHandler).not.toHaveBeenCalled();
  }));

  it('should report a cached exploration after caching it', fakeAsync(() => {
    let successHandler = jasmine.createSpy('success');
    let failHandler = jasmine.createSpy('fail');

    // The exploration should not currently be cached.
    expect(readOnlyExplorationBackendApiService.isCached('0')).toBe(false);

    // Cache a exploration.
    readOnlyExplorationBackendApiService.cacheExploration('0', {
      id: '0',
      nodes: []
    });

    // It should now be cached.
    expect(readOnlyExplorationBackendApiService.isCached('0')).toBe(true);

    // A new exploration should not have been fetched from the backend. Also,
    // the returned exploration should match the expected exploration object.
    readOnlyExplorationBackendApiService.loadLatestExploration('0').then(
      successHandler, failHandler);

    // http://brianmcd.com/2014/03/27/
    // a-tip-for-angular-unit-tests-with-promises.html
    // $rootScope.$digest();
    flushMicrotasks();

    expect(successHandler).toHaveBeenCalledWith({
      id: '0',
      nodes: []
    });
    expect(failHandler).not.toHaveBeenCalled();
  }));
});
