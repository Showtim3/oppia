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
 * @fileoverview Controllers for the topics and skills dashboard.
 */

require('base-components/base-content.directive.ts');
require(
  'components/common-layout-directives/common-elements/' +
  'background-banner.directive.ts');
require(
  'pages/topics-and-skills-dashboard-page/skills-list/' +
  'skills-list.directive.ts');
require(
  'pages/topics-and-skills-dashboard-page/topics-list/' +
  'topics-list.directive.ts');

require('components/entity-creation-services/skill-creation.service.ts');
require('components/entity-creation-services/topic-creation.service.ts');
require('components/rubrics-editor/rubrics-editor.directive.ts');

require('domain/skill/RubricObjectFactory.ts');
require('domain/topics_and_skills_dashboard/DashboardFilterObjectFactory.ts');
require('domain/skill/SkillObjectFactory.ts');
require(
  'domain/topics_and_skills_dashboard/' +
  'topics-and-skills-dashboard-backend-api.service.ts');
require('domain/utilities/url-interpolation.service.ts');
require(
  'pages/topics-and-skills-dashboard-page/' +
  'create-new-skill.modal.controller.ts');
require(
  'pages/topics-and-skills-dashboard-page/skills-list/' +
  'skills-list.directive.ts');
require(
  'pages/topics-and-skills-dashboard-page/topics-list/' +
  'topics-list.directive.ts');
require(
  'pages/topics-and-skills-dashboard-page/' +
  'topics-and-skills-dashboard-page.service');
require('pages/topics-and-skills-dashboard-page/' +
    'topics-and-skills-dashboard-page.constants.ajs.ts');
require(
  'pages/topics-and-skills-dashboard-page/' +
  'topics-and-skills-dashboard-page.constants.ajs.ts');
require('services/alerts.service.ts');


angular.module('oppia').directive('topicsAndSkillsDashboardPage', [
  'UrlInterpolationService', function(
      UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/topics-and-skills-dashboard-page/' +
        'topics-and-skills-dashboard-page.directive.html'),
      controllerAs: '$ctrl',
      controller: [
        '$http', '$rootScope', '$scope', '$uibModal', '$window',
        'AlertsService', 'DashboardFilterObjectFactory',
        'RubricObjectFactory', 'SkillCreationService',
        'SkillObjectFactory', 'TopicCreationService',
        'TopicsAndSkillsDashboardBackendApiService',
        'TopicsAndSkillsDashboardPageService', 'UrlInterpolationService',
        'EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED',
        'EVENT_TYPE_SKILL_CREATION_ENABLED',
        'EVENT_TYPE_TOPIC_CREATION_ENABLED',
        'FATAL_ERROR_CODES', 'SKILL_DIFFICULTIES',
        'MAX_CHARS_IN_SKILL_DESCRIPTION', 'SKILL_DESCRIPTION_STATUS_VALUES',
        'TOPIC_CATEGORIES', 'E_SORT_OPTIONS', 'E_PUBLISHED_OPTIONS',
        function(
            $http, $rootScope, $scope, $uibModal, $window,
            AlertsService, DashboardFilterObjectFactory,
            RubricObjectFactory, SkillCreationService,
            SkillObjectFactory, TopicCreationService,
            TopicsAndSkillsDashboardBackendApiService,
            TopicsAndSkillsDashboardPageService, UrlInterpolationService,
            EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED,
            EVENT_TYPE_SKILL_CREATION_ENABLED,
            EVENT_TYPE_TOPIC_CREATION_ENABLED,
            FATAL_ERROR_CODES, SKILL_DIFFICULTIES,
            MAX_CHARS_IN_SKILL_DESCRIPTION, SKILL_DESCRIPTION_STATUS_VALUES,
            TOPIC_CATEGORIES, E_SORT_OPTIONS, E_PUBLISHED_OPTIONS) {
          var ctrl = this;
          ctrl._initDashboard = function(stayInSameTab) {
            TopicsAndSkillsDashboardBackendApiService.fetchDashboardData().then(
              function(response) {
                // The following condition is required for Karma testing. The
                // Angular HttpClient returns an Observable which when converted
                // to a promise does not have the 'data' key but the AngularJS
                // mocks of services using HttpClient use $http which return
                // promise and the content is contained in the 'data' key.
                // Therefore the following condition checks for presence of
                // 'response.data' which would be the case in AngularJS testing
                // but assigns 'response' if the former is not present which is
                // the case with HttpClient.
                var responseData = response.data ? response.data : response;

                ctrl.totalTopicSummaries = responseData.topic_summary_dicts;
                ctrl.topicSummaries = responseData.topic_summary_dicts;
                ctrl.totalCount = ctrl.topicSummaries.length;
                ctrl.currentCount = ctrl.totalCount;
                ctrl.activeTab = ctrl.TAB_NAME_TOPICS;
                ctrl.paginate(0);
                ctrl.editableTopicSummaries = ctrl.topicSummaries.filter(
                  function(summary) {
                    return summary.can_edit_topic === true;
                  }
                );
                ctrl.untriagedSkillSummaries =
                    responseData.untriaged_skill_summary_dicts;
                ctrl.totalUntriagedSkillSummaries =
                    ctrl.untriagedSkillSummaries;
                ctrl.mergeableSkillSummaries =
                    responseData.mergeable_skill_summary_dicts;
                if (!stayInSameTab || !ctrl.activeTab) {
                  ctrl.activeTab = ctrl.TAB_NAME_TOPICS;
                }
                ctrl.userCanCreateTopic = responseData.can_create_topic;
                ctrl.userCanCreateSkill = responseData.can_create_skill;
                $rootScope.$broadcast(
                  EVENT_TYPE_TOPIC_CREATION_ENABLED, ctrl.userCanCreateTopic);
                $rootScope.$broadcast(
                  EVENT_TYPE_SKILL_CREATION_ENABLED, ctrl.userCanCreateSkill);
                ctrl.userCanDeleteTopic = responseData.can_delete_topic;
                ctrl.userCanDeleteSkill = responseData.can_delete_skill;

                if (ctrl.topicSummaries.length === 0 &&
                    ctrl.untriagedSkillSummaries.length !== 0) {
                  ctrl.activeTab = ctrl.TAB_NAME_UNTRIAGED_SKILLS;
                }
                $rootScope.$apply();
              },
              function(errorResponse) {
                if (FATAL_ERROR_CODES.indexOf(errorResponse.status) !== -1) {
                  AlertsService.addWarning('Failed to get dashboard data.');
                } else {
                  AlertsService.addWarning(
                    'Unexpected error code from the server.');
                }
              }
            );
          };

          ctrl.setActiveTab = function(tabName) {
            ctrl.activeTab = tabName;
            if (ctrl.activeTab === ctrl.TAB_NAME_TOPICS) {
              ctrl.paginate(ctrl.topicPageNumber);
            } else if (ctrl.activeTab === ctrl.TAB_NAME_UNTRIAGED_SKILLS) {
              ctrl.paginate(ctrl.skillPageNumber);
            }
          };

          ctrl.createTopic = function() {
            TopicCreationService.createNewTopic();
          };

          ctrl.createSkill = function() {
            $uibModal.open({
              templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                '/pages/topics-and-skills-dashboard-page/templates/' +
                'create-new-skill-modal.template.html'),
              backdrop: 'static',
              controller: 'CreateNewSkillModal'
            }).result.then(function(result) {
              SkillCreationService.createNewSkill(
                result.description, result.rubrics, result.explanation, []);
            });
          };
          ctrl.paginate = function(pageNumber) {
            if (ctrl.activeTab === ctrl.TAB_NAME_TOPICS) {
              ctrl.topicPageNumber = pageNumber;
              ctrl.pageNumber = ctrl.topicPageNumber;
              ctrl.displayedTopicSummaries =
                  ctrl.topicSummaries.slice(
                    pageNumber * ctrl.itemsPerPage,
                    (pageNumber + 1) * ctrl.itemsPerPage);
            } else if (ctrl.activeTab === ctrl.TAB_NAME_UNTRIAGED_SKILLS) {
              ctrl.totalCount = ctrl.totalUntriagedSkillSummaries.length;
              ctrl.skillPageNumber = pageNumber;
              ctrl.pageNumber = ctrl.skillPageNumber;
              ctrl.untriagedSkillSummaries =
                  ctrl.totalUntriagedSkillSummaries.slice(
                    pageNumber * ctrl.itemsPerPage,
                    (pageNumber + 1) * ctrl.itemsPerPage);
            }
          };

          ctrl.changePage = function(str) {
            ctrl.lastPage = parseInt(
              String(ctrl.totalCount / ctrl.itemsPerPage));
            if (str === ctrl.PREV_PAGE && ctrl.pageNumber >= 1) {
              ctrl.paginate(ctrl.pageNumber - 1);
            } else if (str === ctrl.NEXT_PAGE &&
                ctrl.pageNumber < ctrl.lastPage) {
              ctrl.paginate(ctrl.pageNumber + 1);
            }
          };

          ctrl.applyFilters = function() {
            ctrl.topicSummaries = (
              TopicsAndSkillsDashboardPageService.getFilteredTopics(
                ctrl.totalTopicSummaries, ctrl.filterObject));

            ctrl.displayedTopicSummaries =
                ctrl.topicSummaries.slice(0, ctrl.itemsPerPage);
            ctrl.currentCount = ctrl.topicSummaries.length;
            ctrl.pageNumber = 0;
          };

          ctrl.resetFilters = function() {
            ctrl.topicSummaries = ctrl.totalTopicSummaries;
            ctrl.currentCount = ctrl.totalCount;
            ctrl.filterObject.reset();
            ctrl.paginate(0);
          };

          ctrl.changeItemsPerPage = function() {
            ctrl.paginate(0);
          };

          ctrl.$onInit = function() {
            ctrl.TAB_NAME_TOPICS = 'topics';
            ctrl.activeTab = ctrl.TAB_NAME_TOPICS;
            ctrl.NEXT_PAGE = 'next_page';
            ctrl.PREV_PAGE = 'prev_page';
            ctrl.TAB_NAME_UNTRIAGED_SKILLS = 'untriagedSkills';
            ctrl.TAB_NAME_UNPUBLISHED_SKILLS = 'unpublishedSkills';
            ctrl.pageNumber = 0;
            ctrl.topicPageNumber = 0;
            ctrl.itemsPerPage = 10;
            ctrl.skillPageNumber = 0;
            ctrl.selectedIndex = null;
            ctrl.itemsPerPageChoice = [10, 15, 20];
            ctrl.filterObject = DashboardFilterObjectFactory.createDefault();
            ctrl.categories = TOPIC_CATEGORIES;
            ctrl.sortOptions = (E_SORT_OPTIONS);
            ctrl.statusOptions = (E_PUBLISHED_OPTIONS);

            ctrl.generateIndexNumbersTillRange = function(range) {
              var arr = [];
              for (var i = 0; i < range; i++) {
                arr.push(i);
              }
              return arr;
            };
            $scope.$on(
              EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED, function(
                  evt, stayInSameTab) {
                ctrl._initDashboard(stayInSameTab);
              }
            );
            // The _initDashboard function is written separately since it is
            // also called in $scope.$on when some external events are
            // triggered.
            ctrl._initDashboard(false);
          };
        }
      ]
    };
  }]);
