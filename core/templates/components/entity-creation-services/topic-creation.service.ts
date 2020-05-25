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
 * @fileoverview Modal and functionality for the create topic button.
 */

require(
  'components/forms/custom-forms-directives/select2-dropdown.directive.ts');
require(
  'components/forms/custom-forms-directives/thumbnail-uploader.directive.ts');
require('domain/topic/topic-update.service.ts');
require('domain/topics_and_skills_dashboard/DashboardFilterObjectFactory');
require('domain/utilities/url-interpolation.service.ts');
require('domain/topic/topic-creation-backend-api.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');
require('services/alerts.service.ts');
require('services/image-upload-helper.service.ts');

angular.module('oppia').factory('TopicCreationService', [
  '$rootScope', '$uibModal', '$window', 'AlertsService',
  'TopicCreationBackendApiService', 'UrlInterpolationService',
  'EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED',
  'MAX_CHARS_IN_TOPIC_DESCRIPTION', 'MAX_CHARS_IN_TOPIC_NAME',
  'TOPIC_CATEGORIES',
  function(
      $rootScope, $uibModal, $window, AlertsService,
      TopicCreationBackendApiService, UrlInterpolationService,
      EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED,
      MAX_CHARS_IN_TOPIC_DESCRIPTION, MAX_CHARS_IN_TOPIC_NAME,
      TOPIC_CATEGORIES) {
    var TOPIC_EDITOR_URL_TEMPLATE = '/topic_editor/<topic_id>';
    var topicCreationInProgress = false;

    return {
      createNewTopic: function() {
        if (topicCreationInProgress) {
          return;
        }
        var modalInstance = $uibModal.open({
          templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
            '/pages/topics-and-skills-dashboard-page/templates/' +
            'new-topic-name-editor.template.html'),
          backdrop: true,
          controller: [
            '$scope', '$uibModalInstance', 'DashboardTopicObjectFactory',
            function($scope, $uibModalInstance, DashboardTopicObjectFactory) {
              $scope.categories = TOPIC_CATEGORIES;
              $scope.topic = DashboardTopicObjectFactory.createDefault();
              $scope.MAX_CHARS_IN_TOPIC_NAME = MAX_CHARS_IN_TOPIC_NAME;
              $scope.MAX_CHARS_IN_TOPIC_DESCRIPTION = (
                MAX_CHARS_IN_TOPIC_DESCRIPTION);

              $scope.save = function() {
                $uibModalInstance.close($scope.topic);
              };
              $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
              };
            }
          ]
        });

        modalInstance.result.then(function(topic) {
          if (!topic.isValid()) {
            throw new Error('Topic fields can not be empty');
          }

          topicCreationInProgress = true;
          AlertsService.clearWarnings();
          // $window.open has to be initialized separately since if the 'open
          // new tab' action does not directly result from a user input (which
          // is not the case, if we wait for result from the backend before
          // opening a new tab), some browsers block it as a popup. Here, the
          // new tab is created as soon as the user clicks the 'Create' button
          // and filled with URL once the details are fetched from the backend.
          var newTab = $window.open();
          TopicCreationBackendApiService.createTopic(
            topic).then(
            function(response) {
              $rootScope.$broadcast(
                EVENT_TOPICS_AND_SKILLS_DASHBOARD_REINITIALIZED);
              topicCreationInProgress = false;
              newTab.location.href = UrlInterpolationService.interpolateUrl(
                TOPIC_EDITOR_URL_TEMPLATE, {
                  topic_id: response.topicId
                });
            }, function(errorResponse) {
              newTab.close();
              topicCreationInProgress = false;
              AlertsService.addWarning(errorResponse.error);
            });
        });
      }
    };
  }
]);
