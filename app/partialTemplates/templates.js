angular.module('templates-main', ['../app/404.html', '../app/components/header/headerComponent.html', '../app/features/create/create.component.html', '../app/features/game/game.component.html', '../app/features/join/join.component.html', '../app/features/room/room.component.html', '../app/index.html', '../app/views/chat.html', '../app/views/home.html']);

angular.module("../app/404.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/404.html",
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Page Not Found :(</title>\n" +
    "    <style>\n" +
    "      ::-moz-selection {\n" +
    "        background: #b3d4fc;\n" +
    "        text-shadow: none;\n" +
    "      }\n" +
    "\n" +
    "      ::selection {\n" +
    "        background: #b3d4fc;\n" +
    "        text-shadow: none;\n" +
    "      }\n" +
    "\n" +
    "      html {\n" +
    "        padding: 30px 10px;\n" +
    "        font-size: 20px;\n" +
    "        line-height: 1.4;\n" +
    "        color: #737373;\n" +
    "        background: #f0f0f0;\n" +
    "        -webkit-text-size-adjust: 100%;\n" +
    "        -ms-text-size-adjust: 100%;\n" +
    "      }\n" +
    "\n" +
    "      html,\n" +
    "      input {\n" +
    "        font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n" +
    "      }\n" +
    "\n" +
    "      body {\n" +
    "        max-width: 500px;\n" +
    "        _width: 500px;\n" +
    "        padding: 30px 20px 50px;\n" +
    "        border: 1px solid #b3b3b3;\n" +
    "        border-radius: 4px;\n" +
    "        margin: 0 auto;\n" +
    "        box-shadow: 0 1px 10px #a7a7a7, inset 0 1px 0 #fff;\n" +
    "        background: #fcfcfc;\n" +
    "      }\n" +
    "\n" +
    "      h1 {\n" +
    "        margin: 0 10px;\n" +
    "        font-size: 50px;\n" +
    "        text-align: center;\n" +
    "      }\n" +
    "\n" +
    "      h1 span {\n" +
    "        color: #bbb;\n" +
    "      }\n" +
    "\n" +
    "      h3 {\n" +
    "        margin: 1.5em 0 0.5em;\n" +
    "      }\n" +
    "\n" +
    "      p {\n" +
    "        margin: 1em 0;\n" +
    "      }\n" +
    "\n" +
    "      ul {\n" +
    "        padding: 0 0 0 40px;\n" +
    "        margin: 1em 0;\n" +
    "      }\n" +
    "\n" +
    "      .container {\n" +
    "        max-width: 380px;\n" +
    "        _width: 380px;\n" +
    "        margin: 0 auto;\n" +
    "      }\n" +
    "\n" +
    "      /* google search */\n" +
    "\n" +
    "      #goog-fixurl ul {\n" +
    "        list-style: none;\n" +
    "        padding: 0;\n" +
    "        margin: 0;\n" +
    "      }\n" +
    "\n" +
    "      #goog-fixurl form {\n" +
    "        margin: 0;\n" +
    "      }\n" +
    "\n" +
    "      #goog-wm-qt,\n" +
    "      #goog-wm-sb {\n" +
    "        border: 1px solid #bbb;\n" +
    "        font-size: 16px;\n" +
    "        line-height: normal;\n" +
    "        vertical-align: top;\n" +
    "        color: #444;\n" +
    "        border-radius: 2px;\n" +
    "      }\n" +
    "\n" +
    "      #goog-wm-qt {\n" +
    "        width: 220px;\n" +
    "        height: 20px;\n" +
    "        padding: 5px;\n" +
    "        margin: 5px 10px 0 0;\n" +
    "        box-shadow: inset 0 1px 1px #ccc;\n" +
    "      }\n" +
    "\n" +
    "      #goog-wm-sb {\n" +
    "        display: inline-block;\n" +
    "        height: 32px;\n" +
    "        padding: 0 10px;\n" +
    "        margin: 5px 0 0;\n" +
    "        white-space: nowrap;\n" +
    "        cursor: pointer;\n" +
    "        background-color: #f5f5f5;\n" +
    "        background-image: -webkit-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "        background-image: -moz-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "        background-image: -ms-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "        background-image: -o-linear-gradient(rgba(255,255,255,0), #f1f1f1);\n" +
    "        -webkit-appearance: none;\n" +
    "        -moz-appearance: none;\n" +
    "        appearance: none;\n" +
    "        *overflow: visible;\n" +
    "        *display: inline;\n" +
    "        *zoom: 1;\n" +
    "      }\n" +
    "\n" +
    "      #goog-wm-sb:hover,\n" +
    "      #goog-wm-sb:focus {\n" +
    "        border-color: #aaa;\n" +
    "        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);\n" +
    "        background-color: #f8f8f8;\n" +
    "      }\n" +
    "\n" +
    "      #goog-wm-qt:hover,\n" +
    "      #goog-wm-qt:focus {\n" +
    "        border-color: #105cb6;\n" +
    "        outline: 0;\n" +
    "        color: #222;\n" +
    "      }\n" +
    "\n" +
    "      input::-moz-focus-inner {\n" +
    "        padding: 0;\n" +
    "        border: 0;\n" +
    "      }\n" +
    "    </style>\n" +
    "  </head>\n" +
    "  <body>\n" +
    "    <div class=\"container\">\n" +
    "      <h1>Not found <span>:(</span></h1>\n" +
    "      <p>Sorry, but the page you were trying to view does not exist.</p>\n" +
    "      <p>It looks like this was the result of either:</p>\n" +
    "      <ul>\n" +
    "        <li>a mistyped address</li>\n" +
    "        <li>an out-of-date link</li>\n" +
    "      </ul>\n" +
    "      <script>\n" +
    "        var GOOG_FIXURL_LANG = (navigator.language || '').slice(0,2),GOOG_FIXURL_SITE = location.host;\n" +
    "      </script>\n" +
    "      <script src=\"//linkhelp.clients.google.com/tbproxy/lh/wm/fixurl.js\"></script>\n" +
    "    </div>\n" +
    "  </body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("../app/components/header/headerComponent.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/components/header/headerComponent.html",
    "<h1>Monikers</h1>\n" +
    "");
}]);

angular.module("../app/features/create/create.component.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/features/create/create.component.html",
    "<div layout=\"column\">\n" +
    "  <div flex>\n" +
    "    <md-content layout-gt-sm=\"column\" layout-padding>\n" +
    "      <form ng-submit=\"$ctrl.createGame()\">\n" +
    "        <h4 style=\"margin: 0;\">Creating a game...</h4>\n" +
    "        <md-input-container>\n" +
    "          <label>What's your name?</label>\n" +
    "          <input ng-model=\"$ctrl.user.name\">\n" +
    "          <md-button class=\"md-raised md-primary\" ng-click=\"$ctrl.createGame()\" ng-disabled=\"$ctrl.isLoading\">\n" +
    "            Create\n" +
    "          </md-button>\n" +
    "        </md-input-container>\n" +
    "      </form>\n" +
    "    </md-content>\n" +
    "    <md-button href=\"/\" class=\"md-raised\" ng-disabled=\"$ctrl.isLoading\">\n" +
    "      Back\n" +
    "    </md-button>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("../app/features/game/game.component.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/features/game/game.component.html",
    "<div ng-if=\"!$ctrl.everyoneInGame() && !$ctrl.room.gameStatus.readyForNewGame\">\n" +
    "  Waiting for everyone to press start\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"$ctrl.everyoneInGame()\">\n" +
    "  <div>\n" +
    "    ROUND: {{ $ctrl.room.gameStatus.round }}\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <h2>{{ $ctrl.room.gameStatus.teamTurn }}</h2>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <div ng-repeat=\"player in $ctrl.room.gameStatus.turnOrder track by $index\">\n" +
    "      <li ng-if=\"$index === $ctrl.room.gameStatus.playerTurn\">\n" +
    "        <h3>{{ $ctrl.getUserName(player.userId) }}</h3>\n" +
    "      </li>\n" +
    "      <li ng-if=\"$index !== $ctrl.room.gameStatus.playerTurn\">\n" +
    "        {{ $ctrl.getUserName(player.userId) }}\n" +
    "      </li>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div ng-if=\"$ctrl.isPlayersTurn()\">\n" +
    "    <div>\n" +
    "      <md-button class=\"btn-game md-raised\" ng-click=\"$ctrl.gotIt()\">\n" +
    "        Got it!\n" +
    "      </md-button>\n" +
    "      <h1 ng-if=\"!$ctrl.noWordsLeft()\"> {{ $ctrl.getWord() }} </h1>\n" +
    "      <h1 ng-if=\"$ctrl.noWordsLeft()\"> NO MORE WORDS! </h1>\n" +
    "      <md-button class=\"btn-game md-raised md-primary\" ng-click=\"$ctrl.nextWord()\">\n" +
    "        Pass\n" +
    "      </md-button>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "      <md-button ng-if=\"$ctrl.isLastPlayer()\" class=\"btn-game md-primary\" ng-click=\"$ctrl.nextRound()\">\n" +
    "        <span ng-if=\"!($ctrl.room.gameStatus.round === 3)\">Next Round</span>\n" +
    "        <span ng-if=\"($ctrl.room.gameStatus.round === 3)\">New Game</span>\n" +
    "      </md-button>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "      <md-button ng-if=\"!$ctrl.isLastPlayer()\" class=\"btn-game md-raised md-primary\" ng-click=\"$ctrl.nextPlayersTurn()\">\n" +
    "        Next Player\n" +
    "      </md-button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div>\n" +
    "  <md-button ng-if=\"$ctrl.room.gameStatus.readyForNewGame\" class=\"btn-game md-primary\" ng-click=\"$ctrl.goBackToRoom()\">\n" +
    "    <span>New Game</span>\n" +
    "  </md-button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("../app/features/join/join.component.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/features/join/join.component.html",
    "<form ng-submit=\"$ctrl.joinRoom()\">\n" +
    "  <h4 style=\"margin: 0;\">Joining a game...</h4>\n" +
    "  <md-input-container>\n" +
    "    <label>What's the room code?</label>\n" +
    "    <input type=\"text\" ng-model=\"$ctrl.form.roomCode\" autofocus/>\n" +
    "  </md-input-container>\n" +
    "\n" +
    "  <md-input-container>\n" +
    "    <label>What's your name?</label>\n" +
    "    <input type=\"text\" ng-model=\"$ctrl.form.userName\" />\n" +
    "  </md-input-container>\n" +
    "\n" +
    "  <md-button class=\"md-raised md-primary\" ng-click=\"$ctrl.joinRoom()\">\n" +
    "    Join\n" +
    "  </md-button>\n" +
    "</form>\n" +
    "\n" +
    "<a href=\"/\">Back</a>");
}]);

angular.module("../app/features/room/room.component.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/features/room/room.component.html",
    "<h1>{{ $ctrl.room.roomCode }}</h1>\n" +
    "<md-list>\n" +
    "  <md-subheader class=\"md-no-sticky\">\n" +
    "    <span>Players</span>\n" +
    "  </md-subheader>\n" +
    "  <div>\n" +
    "    <md-button class=\"btn-switch-teams md-raised\" ng-click=\"$ctrl.switchTeams()\">SWITCH TEAMS</md-button>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <span class=\"col-team-one\" >\n" +
    "      <div class=\"team-label\">Team One</div>\n" +
    "      <div ng-repeat=\"player in $ctrl.room.players track by $index\">\n" +
    "        <div ng-if=\"player.team === 'Team One'\">\n" +
    "          <div class=\"user-label\">{{player.username }}</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    </span>\n" +
    "    <span class=\"col-team-two\">\n" +
    "          <div class=\"team-label\">Team Two</div>\n" +
    "      <div  ng-repeat=\"player in $ctrl.room.players track by $index\">\n" +
    "    <div ng-if=\"player.team === 'Team Two'\">\n" +
    "          <div class=\"user-label\">{{player.username }}</div>\n" +
    "      <!--<md-button class=\"md-raised\" ng-if=\"$ctrl.isUser($index) && !$ctrl.isSubmitted()\" ng-click=\"$ctrl.switchTeams()\"> {{ $ctrl.team($index) }} </md-button>-->\n" +
    "      <!--<span ng-if=\"!$ctrl.isUser($index) || $ctrl.isSubmitted()\">{{ $ctrl.team($index) }}</span>-->\n" +
    "      <!--<div ng-if=\"player.team =='Team One'\"><md-button class=\"md-raised md-primary\" ng-click=\"$ctrl.changeTeams()\">Team One</md-button></div>-->\n" +
    "      <!--<div ng-if=\"player.team =='Team two'\"><md-button ng-click=\"$ctrl.changeTeams()\">Team Two</md-button></div>-->\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    </span>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "</md-list>\n" +
    "\n" +
    "<div ng-if=\"!$ctrl.isSubmitted()\">\n" +
    "  <form ng-submit=\"$ctrl.submitWords()\" ng-if=\"!$ctrl.submitted\">\n" +
    "    <h4 style=\"margin: 0;\">Submit 5 Words!</h4>\n" +
    "    <li>\n" +
    "      <md-input-container>\n" +
    "        <label>1)</label>\n" +
    "        <input type=\"text\" ng-model=\"$ctrl.form.wordOne\" autofocus/>\n" +
    "      </md-input-container>\n" +
    "\n" +
    "      <md-input-container>\n" +
    "        <label>2)</label>\n" +
    "        <input type=\"text\" ng-model=\"$ctrl.form.wordTwo\" autofocus/>\n" +
    "      </md-input-container>\n" +
    "\n" +
    "      <md-input-container>\n" +
    "        <label>3)</label>\n" +
    "        <input type=\"text\" ng-model=\"$ctrl.form.wordThree\" autofocus/>\n" +
    "      </md-input-container>\n" +
    "\n" +
    "      <md-input-container>\n" +
    "        <label>4)</label>\n" +
    "        <input type=\"text\" ng-model=\"$ctrl.form.wordFour\" autofocus/>\n" +
    "      </md-input-container>\n" +
    "\n" +
    "      <md-input-container>\n" +
    "        <label>5)</label>\n" +
    "        <input type=\"text\" ng-model=\"$ctrl.form.wordFive\" autofocus/>\n" +
    "      </md-input-container>\n" +
    "    </li>\n" +
    "\n" +
    "    <md-button class=\"btn-submit md-raised md-primary\" ng-click=\"$ctrl.submitWords()\">\n" +
    "      Submit\n" +
    "    </md-button>\n" +
    "  </form>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"$ctrl.submitted\">You have submitted :)</div>\n" +
    "\n" +
    "\n" +
    "<div >\n" +
    "  <md-button ng-if=\"$ctrl.readyToStart()\" class=\"md-raised md-primary\" ng-click=\"$ctrl.startGame()\">\n" +
    "    Start\n" +
    "  </md-button>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"btn-back\">\n" +
    "  <a href=\"/\">Back</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../app/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/index.html",
    "<!doctype html>\n" +
    "<html class=\"no-js\">\n" +
    "  <head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Monikers</title>\n" +
    "    <meta name=\"description\" content=\"\">\n" +
    "    <meta name=\"viewport\" content=\"width=device-width\">\n" +
    "    <meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1, user-scalable=no\" />\n" +
    "    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->\n" +
    "    <!-- build:css(.) styles/vendor.css -->\n" +
    "    <!-- bower:css -->\n" +
    "    <link rel=\"stylesheet\" href=\"/bower_components/angular-material/angular-material.css\" />\n" +
    "    <link rel=\"stylesheet\" href=\"/features/game/game.component.css\" />\n" +
    "    <link rel=\"stylesheet\" href=\"/features/room/room.component.css\" />\n" +
    "    <!-- endbower -->\n" +
    "    <!-- endbuild -->\n" +
    "    <!-- build:css(.tmp) styles/main.css -->\n" +
    "    <link rel=\"stylesheet\" href=\"/styles/main.css\">\n" +
    "    <!-- endbuild -->\n" +
    "    <base href=\"/\">\n" +
    "  </head>\n" +
    "  <body ng-app=\"monikersApp\">\n" +
    "    <!--[if lt IE 7]>\n" +
    "      <p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.</p>\n" +
    "    <![endif]-->\n" +
    "    <header></header>\n" +
    "\n" +
    "    <div id=\"main\">\n" +
    "      <ui-view></ui-view>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->\n" +
    "     <script>\n" +
    "       !function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){\n" +
    "       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),\n" +
    "       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)\n" +
    "       }(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n" +
    "\n" +
    "       ga('create', 'UA-XXXXX-X');\n" +
    "       ga('send', 'pageview');\n" +
    "    </script>\n" +
    "\n" +
    "    <!-- build:js(.) scripts/vendor.js -->\n" +
    "    <!-- bower:js -->\n" +
    "    <script src=\"bower_components/angular/angular.js\"></script>\n" +
    "    <script src=\"bower_components/firebase/firebase.js\"></script>\n" +
    "    <script src=\"bower_components/angularfire/dist/angularfire.js\"></script>\n" +
    "    <script src=\"bower_components/angular-animate/angular-animate.js\"></script>\n" +
    "    <script src=\"bower_components/angular-aria/angular-aria.js\"></script>\n" +
    "    <script src=\"bower_components/angular-messages/angular-messages.js\"></script>\n" +
    "    <script src=\"bower_components/angular-material/angular-material.js\"></script>\n" +
    "    <script src=\"bower_components/angular-ui-router/release/angular-ui-router.js\"></script>\n" +
    "    <script src=\"bower_components/lodash/lodash.js\"></script>\n" +
    "    <!-- endbower -->\n" +
    "    <!-- endbuild -->\n" +
    "\n" +
    "    <!-- build:js({.tmp,app}) scripts/scripts.js -->\n" +
    "    <script src=\"/scripts/app.js\"></script>\n" +
    "    <script src=\"/scripts/angularfire/config.js\"></script>\n" +
    "    <script src=\"/scripts/angularfire/firebase.ref.js\"></script>\n" +
    "    <script src=\"/scripts/controllers/chat.js\"></script>\n" +
    "    <script src=\"/scripts/angularfire/auth.js\"></script>\n" +
    "    <script src=\"/config/constants.js\"></script>\n" +
    "\n" +
    "    <script src=\"/components/header/headerComponent.js\"></script>\n" +
    "    <script src=\"/features/create/create.component.js\"></script>\n" +
    "    <script src=\"/features/join/join.component.js\"></script>\n" +
    "    <script src=\"/features/room/room.component.js\"></script>\n" +
    "    <script src=\"/features/game/game.component.js\"></script>\n" +
    "\n" +
    "\n" +
    "    <script src=\"/scripts/controllers/gameController.js\"></script>\n" +
    "    <script src=\"/scripts/factories/usersFactory.js\"></script>\n" +
    "    <script src=\"/scripts/factories/roomsFactory.js\"></script>\n" +
    "\n" +
    "    <script src=\"/partialTemplates/templates.js\"></script>\n" +
    "    <!-- endbuild -->\n" +
    "  </body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("../app/views/chat.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/views/chat.html",
    "<h2>Chat</h2>\n" +
    "\n" +
    "<form>\n" +
    "  <input placeholder=\"Message...\" ng-model=\"newMessage\">\n" +
    "  <button type=\"submit\" ng-click=\"addMessage(newMessage);newMessage = null;\">send</button>\n" +
    "</form>\n" +
    "\n" +
    "<ul id=\"messages\" ng-show=\"messages.length\">\n" +
    "  <li ng-repeat=\"message in messages\">{{message.text}}</li>\n" +
    "</ul>\n" +
    "\n" +
    "<p class=\"alert alert-danger\" ng-show=\"err\">{{err}}</p>\n" +
    "");
}]);

angular.module("../app/views/home.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../app/views/home.html",
    "<div class=\"main\" layout=\"row\">\n" +
    "  <span flex></span>\n" +
    "  <div layout=\"column\">\n" +
    "    <h3>What do you want to do?</h3>\n" +
    "    <md-button class=\"md-raised\" href=\"/create\">Create</md-button>\n" +
    "    <md-button class=\"md-raised md-primary\" href=\"/join\">Join</md-button>\n" +
    "  </div>\n" +
    "  <span flex></span>\n" +
    "</div>\n" +
    "");
}]);
