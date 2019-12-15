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

import {HttpClient} from '@angular/common/http';
import {TopicsAndSkillsDashboardDomainConstants} from
  // eslint-disable-next-line max-len
  'domain/topics_and_skills_dashboard/topics-and-skills-dashboard-domain.constants';
import {Injectable} from '@angular/core';
import {downgradeInjectable} from '@angular/upgrade/static';


/**
 * @fileoverview Service to retrieve information of topics and skills dashboard
  from the backend and to merge skills from the dashboard.
 */

@Injectable({
  providedIn: 'root'
})
export class TopicsAndSkillsDashboardBackendApiService {
  constructor(private httpClient: HttpClient) {}

  _fetchDashboardData() {
    return this.httpClient.get('/topics_and_skills_dashboard/data').toPromise();
  }

  _mergeSkills(oldSkillId, newSkillId) {
    let mergeSkillsData = {
      old_skill_id: oldSkillId,
      new_skill_id: newSkillId
    };
    return this.httpClient.post(
      TopicsAndSkillsDashboardDomainConstants.MERGE_SKILLS_URL,
      mergeSkillsData).toPromise();
  }

  fetchDashboardData = this._fetchDashboardData;
  mergeSkills = this._mergeSkills;
}


angular.module('oppia').factory(
  'TopicsAndSkillsDashboardBackendApiService',
  downgradeInjectable(TopicsAndSkillsDashboardBackendApiService));
