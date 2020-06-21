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
 * @fileoverview Controller for the subtopics list editor.
 */
require(
  'components/forms/custom-forms-directives/thumbnail-uploader.directive.ts');

require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/topic/SubtopicPageObjectFactory.ts');
require('domain/topic/topic-update.service.ts');
require('domain/utilities/url-interpolation.service.ts');

require('domain/editor/undo_redo/undo-redo.service.ts');
require('domain/topic/SubtopicPageObjectFactory.ts');
require('domain/topic/topic-update.service.ts');
require('domain/utilities/url-interpolation.service.ts');
require('services/contextual/url.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');
require('pages/topic-editor-page/services/topic-editor-routing.service.ts');
require('pages/topic-editor-page/services/topic-editor-helper.service.ts');
require('pages/topic-viewer-page/subtopics-list/subtopics-list.directive.ts');

angular.module('oppia').directive('subtopicPreviewTab', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/topic-editor-page/subtopic-editor/' +
                'subtopic-preview-tab.directive.html'),
      controller: [
        '$location', '$scope', '$uibModal', 'SubtopicPageObjectFactory',
        'TopicEditorHelperService', 'TopicEditorStateService',
        'TopicEditorRoutingService', 'TopicUpdateService',
        'UndoRedoService', 'UrlInterpolationService', 'UrlService',
        'EVENT_TOPIC_INITIALIZED', 'EVENT_TOPIC_REINITIALIZED',
        'EVENT_SUBTOPIC_PAGE_LOADED',
        function(
            $location, $scope, $uibModal, SubtopicPageObjectFactory,
            TopicEditorHelperService, TopicEditorStateService,
            TopicEditorRoutingService, TopicUpdateService,
            UndoRedoService, UrlInterpolationService, UrlService,
            EVENT_TOPIC_INITIALIZED, EVENT_TOPIC_REINITIALIZED,
            EVENT_SUBTOPIC_PAGE_LOADED) {
          var ctrl = this;
          var _initEditor = function() {
            $scope.topic = TopicEditorStateService.getTopic();
            $scope.subtopicId = TopicEditorHelperService.getSubtopicIdFromUrl();
            $scope.subtopic = (
              $scope.topic.getSubtopicById(parseInt($scope.subtopicId)));

            if ($scope.topic.getId() && $scope.subtopic) {
              $scope.showThumbnail = true;
              TopicEditorStateService.loadSubtopicPage(
                $scope.topic.getId(), $scope.subtopicId);
              $scope.editableTitle = $scope.subtopic.getTitle();
              $scope.editableThumbnailFilename = (
                $scope.subtopic.getThumbnailFilename());
              $scope.editableThumbnailBgColor = (
                $scope.subtopic.getThumbnailBgColor());
              $scope.subtopicPage = (
                TopicEditorStateService.getSubtopicPage());
              $scope.pageContents = $scope.subtopicPage.getPageContents();
            }
          };

          $scope.navigateToSubtopic = function() {
            TopicEditorRoutingService.navigateToSubtopicEditorWithId(
              $scope.subtopicId);
          };

          $scope.$on(EVENT_SUBTOPIC_PAGE_LOADED, function() {
            $scope.subtopicPage = TopicEditorStateService.getSubtopicPage();
            var pageContents = $scope.subtopicPage.getPageContents();
            $scope.htmlData = pageContents.getHtml();
          });

          $scope.navigateToSubtopic = function() {
            TopicEditorRoutingService.navigateToSubtopicEditorWithId(
              $scope.subtopicId);
          };

          $scope.changeContent = function(itemToDisplay) {
            if (itemToDisplay === $scope.SHOW_THUMBNAIL) {
              $scope.showThumbnail = true;
              return;
            }
            $scope.showThumbnail = false;
          };

          $scope.$on(EVENT_TOPIC_INITIALIZED, _initEditor);
          $scope.$on(EVENT_TOPIC_REINITIALIZED, _initEditor);
          ctrl.$onInit = function() {
            $scope.SHOW_THUMBNAIL = 'thumbnail';
            $scope.SHOW_CONTENT = 'content';
            _initEditor();
          };
        }
      ]
    };
  }]);
