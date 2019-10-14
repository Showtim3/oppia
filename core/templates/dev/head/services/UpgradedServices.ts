// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for storing all upgraded services
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';

import { UtilsService } from 'services/UtilsService';
import { LoggerService } from './LoggerService';
import { SearchService } from './SearchService';

@Injectable({
  providedIn: 'root'
})
export class UpgradedServices {
  /* eslint-disable quote-props */
  upgradedServices = {
    'UtilsService': new UtilsService(),
    'LoggerService': new LoggerService(),
    'SearchService': new SearchService()
  };
  /* eslint-enable quote-props */
}

angular.module('oppia').factory(
  'UpgradedServices',
  downgradeInjectable(UpgradedServices));
