/* global Module */

/* Magic Mirror
 * Module: MMM-CornellTechCore
 *
 * 
 * MIT Licensed.
 */

Module.register('MMM-CornellTechCore', {

  defaults: {},

  start: function() {
    Log.info('Starting module: ' + this.name);
    this.sendSocketNotification('START', {});
  },

  getStyles: function() {
    return [
      "MMM-CornellTechCore.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
    ]
  },

  getScripts: function() {
    return [
      this.file("QRCode/qrcode.min.js")
    ]
  },

  // Override socket notification handler.
  socketNotificationReceived: function(notification, payload) {
    Log.info(this.name + "received a socket notification:\n" + notification);

    if (notification === "QRCODE") {
      Log.info(payload)

      var qrcode = new QRCode(this.qrcode, {
        text: payload,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else if (notification === "CALENDAR") {
      Log.info("received data")
      Log.info(payload)
    }
  },

  getDom: function() {
    wrapper = document.createElement("div");
    wrapper.className = 'thin large bright';

    this.qrcode = document.createElement('div')
    this.qrcode.id = "qrcode"
    wrapper.appendChild(this.qrcode)

    return wrapper;
  }
});