// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for topics and skills dashboard page.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { TopicsAndSkillsDashboardPageConstants } from
  // eslint-disable-next-line max-len
  'pages/topics-and-skills-dashboard-page/topics-and-skills-dashboard-page.constants';
import { DashboardFilter } from
  'domain/topics_and_skills_dashboard/FilterObjectFactory';

@Injectable({
  providedIn: 'root'
})
export class TopicsAndSkillsDashboardPageService {
  getFilteredTopics(topicsArray, filterObject: DashboardFilter) {
    const {sort, keywords, category, status} = filterObject;
    let ESortOptions = TopicsAndSkillsDashboardPageConstants.E_SORT_OPTIONS;
    let EPublishedOptions = (
      TopicsAndSkillsDashboardPageConstants.E_PUBLISHED_OPTIONS);
    let filteredTopics = topicsArray;
    if (keywords) {
      filteredTopics = topicsArray.filter((topic) => {
        return (
          topic.name.toLowerCase().includes(keywords.toLowerCase()) ||
          topic.description.toLowerCase().includes(keywords.toLowerCase()));
      });
    }

    if (category) {
      filteredTopics = filteredTopics.filter((topic) => {
        return (
          TopicsAndSkillsDashboardPageConstants.TOPIC_CATEGORIES.includes(
            topic.category));
      });
    }

    if (status) {
      filteredTopics = filteredTopics.filter((topic) => {
        if (status === EPublishedOptions.Published && topic.is_published) {
          return true;
        } else if (
          status === EPublishedOptions.NotPublished && !topic.is_published) {
          return true;
        }
        return false;
      });
    }

    if (sort) {
      switch (sort) {
        case ESortOptions.IncreasingUpdatedOn:
          filteredTopics.sort((a, b) => (
            b.topic_model_created_on - a.topic_model_created_on));
          break;
        case ESortOptions.DecreasingUpdatedOn:
          filteredTopics.sort((a, b) =>
            -(b.topic_model_created_on - a.topic_model_created_on));
          break;
        case ESortOptions.IncreasingCreatedOn:
          filteredTopics.sort((a, b) =>
            (b.topic_model_last_updated - a.topic_model_last_updated));
          break;
        case ESortOptions.DecreasingCreatedOn:
          filteredTopics.sort((a, b) =>
            -(b.topic_model_last_updated - a.topic_model_last_updated));
      }
    }
    return filteredTopics;
  }
}

angular.module('oppia').factory(
  'TopicsAndSkillsDashboardPageService',
  downgradeInjectable(TopicsAndSkillsDashboardPageService));
