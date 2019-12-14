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
 * @fileoverview Tests for StateCardObjectFactory.
 */

import { TestBed } from '@angular/core/testing';

import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { InteractionObjectFactory } from
  'domain/exploration/InteractionObjectFactory';
import { RecordedVoiceoversObjectFactory } from
  'domain/exploration/RecordedVoiceoversObjectFactory';
import { StateCardObjectFactory } from
  'domain/state_card/StateCardObjectFactory';
import { VoiceoverObjectFactory } from
  'domain/exploration/VoiceoverObjectFactory';

describe('State card object factory', () => {
  let stateCardObjectFactory = null;
  let interactionObjectFactory = null;
  let recordedVoiceoversObjectFactory = null;
  let voiceoverObjectFactory = null;
  let _sampleCard = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamelCaseToHyphensPipe]
    });

    stateCardObjectFactory = TestBed.get(StateCardObjectFactory);
    interactionObjectFactory = TestBed.get(InteractionObjectFactory);
    recordedVoiceoversObjectFactory = (
      TestBed.get(RecordedVoiceoversObjectFactory));
    voiceoverObjectFactory =
      TestBed.get(VoiceoverObjectFactory);

    let interactionDict = {
      answer_groups: [],
      confirmed_unclassified_answers: [],
      customization_args: {
        rows: {
          value: 1
        },
        placeholder: {
          value: 'Type your answer here.'
        }
      },
      default_outcome: {
        dest: '(untitled state)',
        feedback: {
          content_id: 'default_outcome',
          html: ''
        },
        param_changes: []
      },
      hints: [],
      id: 'TextInput'
    };
    _sampleCard = stateCardObjectFactory.createNewCard(
      'State 1', '<p>Content</p>', '<interaction></interaction>',
      interactionObjectFactory.createFromBackendDict(interactionDict),
      recordedVoiceoversObjectFactory.createFromBackendDict({
        voiceovers_mapping: {
          content: {
            en: {
              filename: 'filename1.mp3',
              file_size_bytes: 100000,
              needs_update: false
            },
            hi: {
              filename: 'filename2.mp3',
              file_size_bytes: 11000,
              needs_update: false
            }
          }
        }
      }),
      'content');
  });

  it('should be able to get the letious fields', () => {
    expect(_sampleCard.getStateName()).toEqual('State 1');
    expect(_sampleCard.getContentHtml()).toEqual('<p>Content</p>');
    expect(_sampleCard.getInteraction().id).toEqual('TextInput');
    expect(_sampleCard.getInteractionHtml()).toEqual(
      '<interaction></interaction>');
    expect(_sampleCard.getInputResponsePairs()).toEqual([]);
    expect(_sampleCard.getLastInputResponsePair()).toEqual(null);
    expect(_sampleCard.getLastOppiaResponse()).toEqual(null);
    expect(_sampleCard.getRecordedVoiceovers().getBindableVoiceovers(
      'content')).toEqual({
      en: voiceoverObjectFactory.createFromBackendDict({
        filename: 'filename1.mp3',
        file_size_bytes: 100000,
        needs_update: false
      }),
      hi: voiceoverObjectFactory.createFromBackendDict({
        filename: 'filename2.mp3',
        file_size_bytes: 11000,
        needs_update: false
      })
    });
    expect(_sampleCard.getVoiceovers()).toEqual({
      en: voiceoverObjectFactory.createFromBackendDict({
        filename: 'filename1.mp3',
        file_size_bytes: 100000,
        needs_update: false
      }),
      hi: voiceoverObjectFactory.createFromBackendDict({
        filename: 'filename2.mp3',
        file_size_bytes: 11000,
        needs_update: false
      })
    });

    expect(_sampleCard.getInteractionId()).toEqual('TextInput');
    expect(_sampleCard.isTerminal()).toEqual(false);
    expect(_sampleCard.isInteractionInline()).toEqual(true);
    expect(_sampleCard.getInteractionInstructions()).toEqual(null);
    expect(_sampleCard.getInteractionCustomizationArgs()).toEqual({
      rows: {
        value: 1
      },
      placeholder: {
        value: 'Type your answer here.'
      }
    });
    expect(_sampleCard.getInteractionHtml()).toEqual(
      '<interaction></interaction>'
    );

    _sampleCard.addInputResponsePair({
      oppiaResponse: 'response'
    });

    expect(_sampleCard.getOppiaResponse(0)).toEqual('response');
    expect(_sampleCard.getLastOppiaResponse()).toEqual('response');
    expect(_sampleCard.getLastInputResponsePair()).toEqual({
      oppiaResponse: 'response'
    });
  });

  it('should add input response pair', () => {
    _sampleCard.addInputResponsePair('pair 1');
    expect(_sampleCard.getInputResponsePairs()).toEqual(['pair 1']);
  });

  it('should add not add response if input response pair is empty', () => {
    _sampleCard._inputResponsePairs = [];
    _sampleCard.setLastOppiaResponse('response');
    expect(_sampleCard.getInputResponsePairs()).toEqual([]);
  });

  it('should be able to set the letious fields', () => {
    _sampleCard.setInteractionHtml('<interaction_2></interaction_2>');
    expect(_sampleCard.getInteractionHtml()).toEqual(
      '<interaction_2></interaction_2>');

    _sampleCard.addInputResponsePair({
      oppiaResponse: 'response'
    });

    _sampleCard.setLastOppiaResponse('response_3');
    expect(_sampleCard.getLastOppiaResponse()).toEqual('response_3');
  });
});
