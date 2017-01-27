'use strict';
const NodeHelper = require('node_helper');
const request = require('request')
const core_token = require('./keys.json').token
var URL = 'http://core.edgeframe.webfactional.com'

module.exports = NodeHelper.create({
  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'START') {
      this.core_handshake();
    }
  },

  core_handshake: function() {
    var self = this
    var user_id = "123456789012345678901234"
    var URL_token = `${URL}/api/query?app_token=${core_token}`

    var post_options_token = {
      method: 'post',
      url: URL_token,
      json: true,
      body: {
        "query_allowed_for": "one-day",
        "streams": [{
          "name": "gcalendar",
          "scopes": []
        }]
      }
    }

    request(post_options_token, function(err, response, body) {
      if (body.link) {
        var queries = `?query_token=${body.query_token}&user_id=${user_id}`
        console.log(queries)
        var URL_user = `${URL}/api/authorize${queries}`
        self.sendSocketNotification("QRCODE", URL_user);
        self.poll(queries)
      }
    })
  },

  poll: function(queries) {
    var self = this;
    var URL_ready = `${URL}/api/ready${queries}`
    setTimeout(function() {
      request.get(URL_ready, function(err, response, body) {
        console.log("poll")
        console.log(body)

        if (body.ready) {
          console.log(body.ready)
          console.log("ready!!!")
          self.fetch_data(queries)
        } else {
          self.poll(URL_ready)
        }
      })

    }, 1000);
  },

  fetch_data: function(queries) {
    var URL_fulfilled = `${URL}/api/fulfilled${queries}`
    request.get(URL_fulfilled, function(err, response, body) {
      console.log("fulfilled")
      console.log(body)
      self.sendSocketNotification("CALENDAR", body);
    })
  }
});