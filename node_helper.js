var PubNub = require('pubnub');

module.exports = NodeHelper.create({

  start: function() {
    this.started = false;
    this.pubnub = null;
    this.pnListener = null;    
  },

  socketNotificationReceived: function(notification, payload) {

    var self = this;

    if (notification === 'CONFIG') {

      if (!this.started)  {

        this.config = payload;
        this.createListeners();
        this.started = true;

        //set up some cleanup on application exit
        process.on('SIGINT', function () {  
          console.log("[MMM-MYAlexaControl] Cleaning Up");
          self.pubnub.removeListener(self.pnListener);
          self.pubnub.unsubscribeAll();
          process.exit();
        });

      } 


    }
  },

  createListeners: function() {

    var self = this;

    this.pubnub = new PubNub({
      subscribeKey: self.config.pn_subscribe_key,
      ssl: true
    });

    this.pnListener = this.pubnub.addListener({
      message: function(m) {
        self.handleCommand(m.message);
      }
    });

    var subChannels = [];
    subChannels.push(this.config.pn_channel)

    this.pubnub.subscribe({
      channels: subChannels
    });

  },

  handleCommand: function(message) {

    //var message = JSON.parse(rawData);
    console.log("[MMM-MYAlexaControl] Received command: " + message.command);

    switch(message.command) {
      case 'SLEEP':
        this.sendSocketNotification("SEND-NOTIFICATION", {notification: "SET_SCREEN_STATE", payload: "OFF"})
        break;
      case 'SCREENSAVER':
        this.sendSocketNotification("SEND-NOTIFICATION", {notification: "SET_SCREEN_STATE", payload: "SCREENSAVER"})
        break;
      case 'WAKE':
        this.sendSocketNotification("SEND-NOTIFICATION", {notification: "SET_SCREEN_STATE", payload: "ON"})
        break;
    }

  }


});