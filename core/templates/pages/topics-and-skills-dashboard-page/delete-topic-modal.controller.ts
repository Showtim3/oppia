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
 * @fileoverview Controller for simple modal with only two actions: close or
 * dismiss.
 */

angular.module('oppia').controller('DeleteTopicModalController', [
  '$scope', '$uibModalInstance', 'topicName',
  function($scope, $uibModalInstance, topicName) {
    $scope.init = function() {
      $scope.topicName = topicName;
    };
    $scope.confirm = function(value) {
      $uibModalInstance.close(value);
    };

    $scope.cancel = function(value) {
      var dismissValue = value || 'cancel';
      $uibModalInstance.dismiss(dismissValue);
    };
    $scope.init();
  }
]);
