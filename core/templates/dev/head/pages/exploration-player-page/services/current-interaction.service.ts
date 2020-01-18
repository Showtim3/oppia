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
 * @fileoverview Facilitates communication between the current interaction
 * and the progress nav. The former holds data about the learner's answer,
 * while the latter contains the actual "Submit" button which triggers the
 * answer submission process.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { ContextService } from 'services/context.service';
import { DebugInfoTrackerService } from 'services/debug-info-tracker.service';
import { PlayerPositionService } from
  'pages/exploration-player-page/services/player-position.service';
import { PlayerTranscriptService } from
  'pages/exploration-player-page/services/player-transcript.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentInteractionService {
  _submitAnswerFn: Function | null = null;
  _onSubmitFn: Function | null = null;
  _validityCheckFn: Function | null = null;
  _presubmitHooks: Array<Function> = [];

  constructor(private contextService: ContextService,
              private debugInfoTrackerService: DebugInfoTrackerService,
              private playerPositionService: PlayerPositionService,
           private playerTranscriptService: PlayerTranscriptService) {}

  setOnSubmitFn(onSubmit: Function): void {
    /**
         * The ConversationSkinDirective should register its onSubmit
         * callback here.
         *
         * @param {function(answer, interactionRulesService)} onSubmit
         */
    this._onSubmitFn = onSubmit;
  }

  registerCurrentInteraction(
      submitAnswerFn: Function, validityCheckFn: Function): void {
    /**
         * Each interaction directive should call registerCurrentInteraction
         * when the interaction directive is first created.
         *
         * @param {function|null} submitAnswerFn - Should grab the learner's
         *   answer and pass it to onSubmit. The interaction can pass in
         *   null if it does not use the progress nav's submit button
         *   (ex: MultipleChoiceInput).
         * @param {function} validityCheckFn - The progress nav will use this
         *   to decide whether or not to disable the submit button. If the
         *   interaction passes in null, the submit button will remain
         *   enabled (for the entire duration of the current interaction).
         */
    this._submitAnswerFn = submitAnswerFn || null;
    this._validityCheckFn = validityCheckFn || null;
  }

  registerPresubmitHook(hookFn: Function): void {
    /* Register a hook that will be called right before onSubmit.
         * All hooks for the current interaction will be cleared right
         * before loading the next card.
         */
    this._presubmitHooks.push(hookFn);
  }

  clearPresubmitHooks(): void {
    /* Clear out all the hooks for the current interaction. Should
         * be called before loading the next card.
         */
    this._presubmitHooks = [];
  }

  onSubmit(answer: any, interactionRulesService: any): void {
    for (let i = 0; i < this._presubmitHooks.length; i++) {
      this._presubmitHooks[i]();
    }
    this._onSubmitFn(answer, interactionRulesService);
  }

  submitAnswer(): void {
    /* This starts the answer submit process, it should be called once the
         * learner presses the "Submit" button.
         */
    if (this._submitAnswerFn === null) {
      let index = this.playerPositionService.getDisplayedCardIndex();
      let displayedCard = this.playerTranscriptService.getCard(index);
      let sequenceOfInteractions = (
        JSON.stringify(this.debugInfoTrackerService.getSequenceOfActions()));
      let additionalInfo = ('\nUndefined submit answer debug logs:' +
              '\nInteraction ID: ' + displayedCard.getInteractionId() +
              '\nExploration ID: ' + this.contextService.getExplorationId() +
              '\nState Name: ' + displayedCard.getStateName() +
              '\nContext: ' + this.contextService.getPageContext() +
              '\nSequence of steps: ' + sequenceOfInteractions +
              '\nErrored at index: ' + index);
      throw Error('The current interaction did not ' +
              'register a _submitAnswerFn.' + additionalInfo);
    } else {
      this._submitAnswerFn();
    }
  }

  isSubmitButtonDisabled(): boolean {
    /* Returns whether or not the Submit button should be disabled based on
         * the validity of the current answer. If the interaction does not pass
         * in a _validityCheckFn, then _validityCheckFn will be null and by
         * default we assume the answer is valid, so the submit button should
         * not be disabled.
         */
    if (this._validityCheckFn === null) {
      return false;
    }
    return !this._validityCheckFn();
  }
}

angular.module('oppia').factory(
  'CurrentInteractionService',
  downgradeInjectable(CurrentInteractionService));
