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
 * @fileoverview Unit tests for DashboardFilterObjectFactory.
 */

import { DashboardFilter, DashboardFilterObjectFactory } from
  'domain/topics_and_skills_dashboard/DashboardFilterObjectFactory';

describe('Dashboard Filter object factory', () => {
  let dashboardFilterObjectFactory: DashboardFilterObjectFactory = null;
  let filter: DashboardFilter = null;

  beforeEach(() => {
    dashboardFilterObjectFactory = new DashboardFilterObjectFactory();
    filter = dashboardFilterObjectFactory.createDefault();
  });

  it('should create a new dashboard filter object', () => {
    expect(filter.category).toEqual('');
    expect(filter.sort).toEqual('');
    expect(filter.status).toEqual('');
    expect(filter.keywords).toEqual('');
  });

  it('should reset values of the filter', () => {
    expect(filter.category).toEqual('');
    expect(filter.sort).toEqual('');
    expect(filter.status).toEqual('');
    expect(filter.keywords).toEqual('');

    const category = 'Mathematics';
    const sort = 'Newly Created';
    const status = 'Published';
    const keywords = 'Key1';

    filter.category = category;
    filter.sort = sort;
    filter.status = status;
    filter.keywords = keywords;

    expect(filter.category).toEqual(category);
    expect(filter.sort).toEqual(sort);
    expect(filter.status).toEqual(status);
    expect(filter.keywords).toEqual(keywords);

    filter.reset();
    expect(filter.category).toEqual('');
    expect(filter.sort).toEqual('');
    expect(filter.status).toEqual('');
    expect(filter.keywords).toEqual('');
  });
});
