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
 * @fileoverview Controller for CreateNewSkillModal.
 */

require('domain/utilities/url-interpolation.service.ts');
require('domain/exploration/SubtitledHtmlObjectFactory.ts');
require('components/ck-editor-helpers/ck-editor-4-rte.directive.ts');
require('components/ck-editor-helpers/ck-editor-4-widgets.initializer.ts');
require(
  'components/forms/schema-based-editors/schema-based-editor.directive.ts');
require('domain/exploration/SubtitledHtmlObjectFactory.ts');
require('domain/utilities/url-interpolation.service.ts');
require('components/ck-editor-helpers/ck-editor-4-rte.directive.ts');
require('components/ck-editor-helpers/ck-editor-4-widgets.initializer.ts');
require('components/forms/custom-forms-directives/image-uploader.directive.ts');

require('directives/mathjax-bind.directive.ts');
require('filters/string-utility-filters/normalize-whitespace.filter.ts');
require('objects/objectComponentsRequires.ts');
require('directives/angular-html-bind.directive.ts');

angular.module('oppia').controller('CreateNewSkillModalController', [
  '$scope', '$uibModalInstance', 'RubricObjectFactory', 'SkillCreationService',
  'SubtitledHtmlObjectFactory', 'COMPONENT_NAME_EXPLANATION',
  'SkillObjectFactory', 'MAX_CHARS_IN_SKILL_DESCRIPTION',
  'SKILL_DESCRIPTION_STATUS_VALUES', 'SKILL_DIFFICULTIES',
  function($scope, $uibModalInstance, RubricObjectFactory, SkillCreationService,
      SubtitledHtmlObjectFactory, COMPONENT_NAME_EXPLANATION,
      SkillObjectFactory, MAX_CHARS_IN_SKILL_DESCRIPTION,
      SKILL_DESCRIPTION_STATUS_VALUES, SKILL_DIFFICULTIES) {
    var rubrics = [
      RubricObjectFactory.create(SKILL_DIFFICULTIES[0], []),
      RubricObjectFactory.create(SKILL_DIFFICULTIES[1], ['']),
      RubricObjectFactory.create(SKILL_DIFFICULTIES[2], [])];
    $scope.newSkillDescription = '';
    $scope.rubrics = rubrics;
    $scope.errorMsg = '';
    $scope.conceptCardExplanationEditorIsShown = false;
    $scope.bindableDict = {
      displayedConceptCardExplanation: ''
    };
    $scope.HTML_SCHEMA = {
      type: 'html'
    };
    $scope.MAX_CHARS_IN_SKILL_DESCRIPTION = (
      MAX_CHARS_IN_SKILL_DESCRIPTION);
    $scope.newExplanationObject = null;

    $scope.openConceptCardExplanationEditor = function() {
      console.log('open called');
      $scope.conceptCardExplanationEditorIsShown = true;
    };

    $scope.updateSkillDescription = function() {
      $scope.resetErrorMsg();
      if (
        SkillCreationService.getSkillDescriptionStatus() !==
          SKILL_DESCRIPTION_STATUS_VALUES.STATUS_DISABLED) {
        $scope.rubrics[1].setExplanations([$scope.newSkillDescription]);
        SkillCreationService.markChangeInSkillDescription();
      }
    };

    $scope.resetErrorMsg = function() {
      $scope.errorMsg = '';
    };

    $scope.saveConceptCardExplanation = function() {
      var explanationObject = SubtitledHtmlObjectFactory.createDefault(
        $scope.bindableDict.displayedConceptCardExplanation,
        COMPONENT_NAME_EXPLANATION);
      $scope.newExplanationObject = explanationObject.toBackendDict();
      $scope.bindableDict.displayedConceptCardExplanation = (
        explanationObject.getHtml());
    };

    $scope.createNewSkill = function() {
      if (
        !SkillObjectFactory.hasValidDescription(
          $scope.newSkillDescription)) {
        $scope.errorMsg = (
          'Please use a non-empty description consisting of ' +
          'alphanumeric characters, spaces and/or hyphens.');
        return;
      }
      $scope.saveConceptCardExplanation();
      $uibModalInstance.close({
        description: $scope.newSkillDescription,
        rubrics: $scope.rubrics,
        explanation: $scope.newExplanationObject,
        linkedTopicIds: [],
        imagesData: []
      });
    };

    $scope.cancel = function() {
      SkillCreationService.resetSkillDescriptionStatusMarker();
      $uibModalInstance.dismiss('cancel');
    };
  }
]);
