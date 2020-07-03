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
 * @fileoverview Controller for unassign skill from topics modal.
 */

require(
  'components/common-layout-directives/common-elements/' +
    'confirm-or-cancel-modal.controller.ts');

require(
  'domain/topics_and_skills_dashboard/' +
    'topics-and-skills-dashboard-backend-api.service.ts');

angular.module('oppia').controller('UnassignSkillFromTopicModalController', [
  '$controller', '$scope', '$uibModalInstance',
  'TopicsAndSkillsDashboardBackendApiService',
  'skillId',
  function($controller, $scope, $uibModalInstance,
      TopicsAndSkillsDashboardBackendApiService, skillId) {
    $controller('ConfirmOrCancelModalController', {
      $scope: $scope,
      $uibModalInstance: $uibModalInstance
    });
    $scope.fetchAssignedSkillData = function() {
      TopicsAndSkillsDashboardBackendApiService.fetchAssignedSkillData(
        skillId).then((response) => {
        console.log(response);
        $scope.assignedTopics = response.assigned_topics;
        $scope.assignedTopicsAreFetched = true;
      });
    };
    $scope.init = function() {
      $scope.selectedIndexes = [];
      $scope.assignedTopicsAreFetched = false;
      $scope.fetchAssignedSkillData();
    };
    $scope.addTopicId = function(topicId) {
      console.log(topicId);
      var index = $scope.selectedIndexes.indexOf(topicId);
      if (index !== -1) {
        $scope.selectedIndexes.splice(index, 1);
      } else {
        $scope.selectedIndexes.push(topicId);
      }
    };
    $scope.close = function() {
      var selectedTopics = [];
      for (let index in $scope.selectedIndexes) {
        selectedTopics.push(
          $scope.assignedTopics[$scope.selectedIndexes[index]]);
      }
      $uibModalInstance.close(selectedTopics);
    };
    $scope.init();
  }
]);
