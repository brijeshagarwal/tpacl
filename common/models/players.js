'use strict';

module.exports = function (Players) {

  Players.byId = function (id, callback) {
    Players.find({
      where: {
        player_id: id
      }
    },
      function (err, player) {
        callback(err, player);
      });
  };

  Players.remoteMethod('byId', {
    http: {
      path: '/id/:id',
      verb: 'get'
    },
    returns: {
      arg: 'success',
      type: 'object'
    },
    accepts: [
      { arg: 'id', type: 'string' },
    ]
  });

};
