/* =========================================================================
   Opening hours — the only place they are defined.
   Confirmed by the client: every day, 07:00 to 24:00 (midnight).
   Time is always evaluated in Amman, whatever the visitor's phone is set to.
   ========================================================================= */
window.ELYA_HOURS = (function () {
  "use strict";

  var TZ = "Asia/Amman";
  var OPEN_MIN = 7 * 60;   // 07:00
  var CLOSE_MIN = 24 * 60; // 24:00 (midnight)

  function ammanMinutes(date) {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      }).formatToParts(date);
      var h = 0, m = 0;
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].type === "hour") h = parseInt(parts[i].value, 10) % 24;
        if (parts[i].type === "minute") m = parseInt(parts[i].value, 10);
      }
      return h * 60 + m;
    } catch (e) {
      // Very old browsers without Intl time zones: fall back to UTC+3 (Jordan, no DST).
      var utc = date.getUTCHours() * 60 + date.getUTCMinutes();
      return (utc + 180) % 1440;
    }
  }

  function isOpen(date) {
    var t = ammanMinutes(date || new Date());
    return t >= OPEN_MIN && t < CLOSE_MIN;
  }

  return { isOpen: isOpen, ammanMinutes: ammanMinutes };
})();
