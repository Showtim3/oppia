// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview End-to-end tests of the publication and featuring process, and
 * the resultant display of explorations in the library.
 */


var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

var LibraryPage = require('../protractor_utils/LibraryPage.js');

describe('Play Later', function() {
var libraryPage = null;

beforeEach(function() {
    libraryPage = new LibraryPage.LibraryPage();
});

it('should display private and published explorations', function() {

    var EXPLORATION_FRACTION = 'fraction';
    var CATEGORY_ARCHITECTURE = 'Architecture';
    var LANGUAGE_ENGLISH = 'English';

    users.createUser(
        'feanor@publicationAndLibrary.com', 'feanorPublicationAndLibrary');

    users.login('feanor@publicationAndLibrary.com');
    workflow.createAndPublishExploration(
        EXPLORATION_FRACTION, CATEGORY_ARCHITECTURE,
        'hold the light of the two trees', LANGUAGE_ENGLISH);
    users.createUser(
        'celebrimor@publicationAndLibrary.com', 'celebriorPublicationAndLibrary');
    users.login('celebrimor@publicationAndLibrary.com');


});
afterEach(function() {
    general.checkForConsoleErrors([])
})
});
