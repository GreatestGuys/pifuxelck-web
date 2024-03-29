goog.provide('pifuxelck.controller.HistoryController');

goog.require('pifuxelck.controller.BaseController');
goog.require('pifuxelck.ui.Drawing');
goog.require('pifuxelck.ui.soy.history');
goog.require('soy');



/**
 * @constructor
 * @extends {pifuxelck.controller.BaseController}
 */
pifuxelck.controller.HistoryController = function() {
  pifuxelck.controller.BaseController.call(this);

  /** @private {Element} */
  this.grid_ = document.getElementById('grid');

  this.getDataStore().withHistory(goog.bind(this.loadHistory_, this));
};
goog.inherits(
    pifuxelck.controller.HistoryController,
    pifuxelck.controller.BaseController);
goog.exportSymbol(
    'pifuxelck.controller.HistoryController',
    pifuxelck.controller.HistoryController);


pifuxelck.controller.HistoryController.prototype.loadHistory_ = function(db) {
  // Pre-populate history with all the games that have been cached locally.
  var historyPromise = db.getAll();
  historyPromise.then(goog.bind(function(history) {
    history.sort(function(a, b) {
      return parseInt(a['completed_at_id'], 10) -
             parseInt(b['completed_at_id'], 10);
    });

    // The current greatest completed_at_id.
    var sinceId = history.length == 0 ? 0 :
        history[history.length - 1]['completed_at_id'];

    // Render the now gathered list of games.
    var finish = goog.bind(function() {
      console.log('history size: ' + JSON.stringify(history).length);
      history.sort(function(a, b) {
        return parseInt(a['completed_at_id'], 10) -
               parseInt(b['completed_at_id'], 10);
      });
      for (var i = history.length - 1; i >= 0; --i) {
        var entry = history[i];
        var fragment = soy.renderAsFragment(
            pifuxelck.ui.soy.history.entry,
            {
              'label': entry['turns'][0]['label'],
              'gameId': entry['id']
            });
        this.grid_.appendChild(fragment);
        this.renderDrawing_(fragment, entry);
      }
    }, this);

    // Process a list of games that has just been returned from the API.
    var processGames = goog.bind(function(games) {
      if (!games) {
        finish();
        return;
      }

      var oldSinceId = sinceId;
      for (var i = 0; i < games.length; ++i) {
        history.push(games[i]);
        goog.bind(function(game) {
          this.getDataStore().withHistory(function(db) {
            db.put(game).then(function() {
                  console.log('saved ' + game['id']);
                }, function() {
                  console.log('failed to save ' + game['id']);
                });
          });
        }, this)(games[i]);

        var completedAtId = parseInt(games[i]['completed_at_id'], 10);
        console.log('completed at id: ' + completedAtId);
        console.log('since id: ' + sinceId);
        if (sinceId <= completedAtId) {
          console.log('Updating sinceId to ' + completedAtId);
          sinceId = completedAtId;
        }
      }

      // Only bother continuing to query history if the sinceId was updated,
      // otherwise we will get the same data that was returned for this step.
      if (oldSinceId < sinceId) {
        console.log('Updated since ID, continuing...');
        step();
      } else {
        console.log('No update, finishing...');
        finish();
      }
    }, this);

    // Perform one step of the entire history load.
    var step = goog.bind(function() {
      console.log('Steping history at ID ' + sinceId);
      this.getApi().history(sinceId).then(processGames, finish);
    }, this);

    // Perform the first history loading step.
    step();
  }, this));
};


pifuxelck.controller.HistoryController.prototype.renderDrawing_ = function(
    fragment,
    game) {
  var turns = game['turns'];
  var drawing = new pifuxelck.ui.Drawing(fragment.children[0].children[0]);
  if (turns.length > 1) {
    drawing.setDrawing(turns[1]['drawing']);
  }
  drawing.updateCanvas();
};
