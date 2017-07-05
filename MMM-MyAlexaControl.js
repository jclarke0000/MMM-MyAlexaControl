Module.register('MMM-MyAlexaControl', {

  start: function() {
    this.sendSocketNotification("CONFIG", this.config);
  },


  socketNotificationReceived: function(notification, payload) {
    if ( notification === 'SEND-NOTIFICATION') {
      this.sendNotification(payload.notification, payload.payload);
    }

  },


});