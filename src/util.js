const SetDeceleratingTimeout = (fn, factor, times, callback) => {
  var internalCallback = function(tick, counter) {
      return function() {
          if (--tick >= 0) {
            var success = fn();
            if (success) {
              callback(true);
            } else {
              setTimeout(internalCallback, ++counter * factor);
            }                  
          } else {
            callback(false);
          }
      }
  }(times, 0);

  setTimeout(internalCallback, factor);
}

export default SetDeceleratingTimeout;