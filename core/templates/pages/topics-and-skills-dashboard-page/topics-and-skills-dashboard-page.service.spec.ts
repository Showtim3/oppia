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
 * @fileoverview Unit tests for TopicsAndSkillsDashboardPageService.
 */

import { TopicsAndSkillsDashboardPageService } from
  // eslint-disable-next-line max-len
  'pages/topics-and-skills-dashboard-page/topics-and-skills-dashboard-page.service';
import { DashboardFilterObjectFactory } from
  'domain/topics_and_skills_dashboard/DashboardFilterObjectFactory';

describe('Topic and Skill dashboard page service', () => {
  let tsds: TopicsAndSkillsDashboardPageService = null;
  let dfof: DashboardFilterObjectFactory = null;

  beforeEach(() => {
    tsds = new TopicsAndSkillsDashboardPageService();
    dfof = new DashboardFilterObjectFactory();
  });

  it('should filter the topics', () => {
    const topic1 = {
      topic_model_created_on: 1581839432987.596,
      uncategorized_skill_count: 0,
      canonical_story_count: 0,
      id: 'wbL5aAyTWfOH1',
      is_published: true,
      total_skill_count: 10,
      can_edit_topic: true,
      topic_model_last_updated: 1581839492500.852,
      additional_story_count: 0,
      name: 'Alpha',
      category: 'Mathematics',
      version: 1,
      description: 'Alpha description',
      subtopic_count: 0,
      language_code: 'en',
      $$hashKey: 'object:63',
    };
    const topic2 = {
      topic_model_created_on: 1681839432987.596,
      uncategorized_skill_count: 0,
      canonical_story_count: 0,
      id: 'wbL5aAyTWfOH1',
      is_published: false,
      total_skill_count: 10,
      can_edit_topic: true,
      topic_model_last_updated: 1681839492500.852,
      additional_story_count: 0,
      name: 'Beta',
      category: 'Mathematics',
      version: 1,
      description: 'Beta description',
      subtopic_count: 0,
      language_code: 'en',
      $$hashKey: 'object:63',
    };
    const topic3 = {
      topic_model_created_on: 1781839432987.596,
      uncategorized_skill_count: 0,
      canonical_story_count: 0,
      id: 'wbL5aAyTWfOH1',
      is_published: true,
      total_skill_count: 10,
      can_edit_topic: true,
      topic_model_last_updated: 1781839492500.852,
      additional_story_count: 0,
      name: 'Gamma',
      category: 'Algorithms',
      version: 1,
      description: 'Gamma description',
      subtopic_count: 0,
      language_code: 'en',
      $$hashKey: 'object:63',
    };
    const topicsArray = [topic1, topic2, topic3];
    let filterOptions = dfof.createDefault();
    let filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual(topicsArray);

    filterOptions.keywords = 'alp';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic1]);

    filterOptions.keywords = '';
    filterOptions.status = 'Published';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic1, topic3]);

    filterOptions.status = 'Not Published';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic2]);

    filterOptions.status = '';
    filterOptions.sort = 'Most Recently Updated';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic3, topic2, topic1]);

    filterOptions.sort = 'Least Recently Updated';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic1, topic2, topic3]);

    filterOptions.sort = 'Newly Created';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic3, topic2, topic1]);

    filterOptions.sort = 'Oldest Created';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic1, topic2, topic3]);

    filterOptions.sort = '';
    filterOptions.category = 'Mathematics';
    filteredArray = tsds.getFilteredTopics(topicsArray, filterOptions);
    expect(filteredArray).toEqual([topic1, topic2]);
  });
});
