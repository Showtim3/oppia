// Copyright 2015 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Factory for creating new frontend instances of State
 * domain objects given a list of backend state dictionaries.
 */

import { downgradeInjectable } from '@angular/upgrade/static';

require('domain/state/StateObjectFactory.ts');

const INTERACTION_SPECS = require('interactions/interaction_specs.json');

class StateObject {
    _states;

    constructor(states: any,) {
      this._states = states;
    }

    States(states) {
      this._states = states;
    }

    getState(stateName) {
      return angular.copy(this._states[stateName]);
    }

    // TODO(tjiang11): Remove getStateObjects() and replace calls
    // with an object to represent data to be manipulated inside
    // ExplorationDiffService.

    getStateObjects() {
      return angular.copy(this._states);
    }

    createDefaultState(newStateName) {
      return new this.States(newStateName);
    }

    addState(newStateName) {
      this._states[newStateName] = new StateObject(newStateName);
    }

    setState(stateName, stateData) {
      this._states[stateName] = angular.copy(stateData);
    }

    hasState(stateName) {
      return this._states.hasOwnProperty(stateName);
    }

    deleteState(deleteStateName) {
      delete this._states[deleteStateName];
      for (let otherStateName in this._states) {
        let interaction = this._states[otherStateName].interaction;
        let groups = interaction.answerGroups;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].outcome.dest === deleteStateName) {
            groups[i].outcome.dest = otherStateName;
          }
        }
        if (interaction.defaultOutcome) {
          if (interaction.defaultOutcome.dest === deleteStateName) {
            interaction.defaultOutcome.dest = otherStateName;
          }
        }
      }
    }

    renameState(oldStateName, newStateName) {
      this._states[newStateName] = angular.copy(this._states[oldStateName]);
      this._states[newStateName].setName(newStateName);
      delete this._states[oldStateName];

      for (let otherStateName in this._states) {
        let interaction = this._states[otherStateName].interaction;
        let groups = interaction.answerGroups;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].outcome.dest === oldStateName) {
            groups[i].outcome.dest = newStateName;
          }
        }
        if (interaction.defaultOutcome) {
          if (interaction.defaultOutcome.dest === oldStateName) {
            interaction.defaultOutcome.dest = newStateName;
          }
        }
      }
    }

    getStateNames() {
      return Object.keys(this._states);
    }

    getFinalStateNames() {
      let finalStateNames = [];
      for (let stateName in this._states) {
        let interaction = this._states[stateName].interaction;
        if (interaction.id && INTERACTION_SPECS[interaction.id].is_terminal) {
          finalStateNames.push(stateName);
        }
      }
      return finalStateNames;
    }

    getAllVoiceoverLanguageCodes() {
      let allAudioLanguageCodes = [];
      for (let stateName in this._states) {
        let state = this._states[stateName];
        let contentIdsList = state.recordedVoiceovers.getAllContentId();
        contentIdsList.forEach(function(contentId) {
          let audioLanguageCodes = (
            state.recordedVoiceovers.getVoiceoverLanguageCodes(contentId));
          audioLanguageCodes.forEach(function(languageCode) {
            if (allAudioLanguageCodes.indexOf(languageCode) === -1) {
              allAudioLanguageCodes.push(languageCode);
            }
          });
        });
      }
      return allAudioLanguageCodes;
    }

    getAllVoiceovers(languageCode) {
      let allAudioTranslations = {};
      for (let stateName in this._states) {
        let state = this._states[stateName];
        allAudioTranslations[stateName] = [];
        let contentIdsList = state.recordedVoiceovers.getAllContentId();
        contentIdsList.forEach(function(contentId) {
          let audioTranslations = (
            state.recordedVoiceovers.getBindableVoiceovers(contentId));
          if (audioTranslations.hasOwnProperty(languageCode)) {
            allAudioTranslations[stateName].push(
              audioTranslations[languageCode]);
          }
        });
      }
      return allAudioTranslations;
    }
}


export class StatesObjectFactory {
  createFromBackendDict(statesBackendDict: Object) {
    let stateObjectsDict = {};
    for (let stateName in statesBackendDict) {
      stateObjectsDict[stateName] = new StateObject(
        statesBackendDict[stateName]);
    }
    return stateObjectsDict;
  }
}

angular.module('oppia').factory(
  'StatesObjectFactory',
  downgradeInjectable(StatesObjectFactory));

