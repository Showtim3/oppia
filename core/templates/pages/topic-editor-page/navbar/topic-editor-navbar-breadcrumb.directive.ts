// Copyright 2016 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Controller for the navbar breadcrumb of the topic editor.
 */

require('domain/utilities/url-interpolation.service.ts');
require('pages/topic-editor-page/services/topic-editor-routing.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');
require('services/stateful/focus-manager.service.ts');

angular.module('oppia').directive('topicEditorNavbarBreadcrumb', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/topic-editor-page/navbar/' +
        'topic-editor-navbar-breadcrumb.directive.html'),
      controller: [
        '$scope', 'TopicEditorStateService', 'TopicEditorRoutingService',
        function(
            $scope, TopicEditorStateService, TopicEditorRoutingService) {
          var ctrl = this;
          $scope.enableBackToTopic = function() {
            const activeTab = TopicEditorRoutingService.getActiveTabName();
            return (activeTab.startsWith('subtopic') ||
                TopicEditorRoutingService.getLastTabVisited() === 'subtopic');
          };
          $scope.navigateToMainTab = function() {
            TopicEditorRoutingService.navigateToMainTab();
          };
          ctrl.$onInit = function() {
            $scope.topic = TopicEditorStateService.getTopic();
          };
        }
      ]
    };
  }]);
