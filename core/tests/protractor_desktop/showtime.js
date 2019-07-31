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

