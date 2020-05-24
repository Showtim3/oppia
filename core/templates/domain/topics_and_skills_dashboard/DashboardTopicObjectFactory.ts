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
 * @fileoverview Factory for creating domain object for frontend topics
 * that are used in topics dashboard.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

export class DashboardTopic {
    name: string;
    category: string;
    description: string;
    /**
     * @param {String} category - category of the topic
     * @param {String} name - name of the topic
     * @param {String} description - description of the topic
     */
    constructor(category, name, description) {
      this.category = category;
      this.name = name;
      this.description = description;
    }
    /**
     * @returns {Boolean} - A boolean indicating if the topic is valid
     */
    isValid(): boolean {
      return !(!this.name || !this.category || !this.description);
    }
}

@Injectable({
  providedIn: 'root'
})
export class DashboardTopicObjectFactory {
  /**
    * @returns {DashboardTopic} - A new DashboardTopic instance
    */
  createDefault(): DashboardTopic {
    return new DashboardTopic(
      '', '', '');
  }
}

angular.module('oppia').factory(
  'DashboardTopicObjectFactory',
  downgradeInjectable(DashboardTopicObjectFactory));
