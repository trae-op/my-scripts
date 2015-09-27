


(function(w, d) {

  w.EventWheel = function() {};

  EventWheel.prototype.AllData = [];

  EventWheel.prototype.All = function(data, callBack) {
    if (data.forEach) data.forEach(callBack);
    else {
      for (var i = 0; i < data.length; i++) callBack(data[i], i);
    }
  };

  EventWheel.prototype.Initialize = function(data) {
    this.AllData.push(data(this));
  };

  EventWheel.prototype.OneEvent = function(event) {
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
  };

  EventWheel.prototype.EventWeel = function(dataControl, callBack) {
    var _this   = this;
    var element = dataControl.element;
    var delay   = dataControl.delay;

    if (element.addEventListener) {
      if ('onwheel' in d) {
        element.addEventListener("wheel", function(event) {
          _this.OneEvent(event);
          callBack(event, this, (_this.OnWheel(event) > 0), (_this.OnWheel(event) < 0));
        }, false);
      } else if ('onmousewheel' in d) {
        element.addEventListener("mousewheel", function(event) {
          _this.OneEvent(event);
          callBack(event, this, (_this.OnWheel(event) < 0), (_this.OnWheel(event) > 0));
        }, false);
      } else
        element.addEventListener("MozMousePixelScroll", function(event) {
          _this.OneEvent(event);
          callBack(event, this, (_this.OnWheel(event) > 0), (_this.OnWheel(event) < 0));
        }, false);
    } else
      element.attachEvent("onmousewheel", function(event) {
        _this.OneEvent(event);
        callBack(event, this, (_this.OnWheel(event) < 0), (_this.OnWheel(event) > 0));
      });
  };

  EventWheel.prototype.OnWheel = function(e) {
    e = e || w.event;
    var delta = e.deltaY || e.detail || e.wheelDelta;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    return delta
  };

  EventWheel.prototype.Timeout = function(dataControl) {
    setTimeout(function() {
      dataControl.flag = true;
    }, dataControl.delay);
  };

  EventWheel.prototype.CheckRange = function(dataControl, check) {

    if (!dataControl.range) return;

    var rangeText = dataControl.range + '';
    var cleanSpaces = rangeText.replace(/\s|[a-z]/g,'');
    var rangeFrom = parseInt(cleanSpaces.replace(/\((.*?)\)/,'$1'));
    var rangeTo   = parseInt(cleanSpaces.replace(/\((.*?)\)\((.*?)\)/,'$2'));

      if (check === 'bottom') {
        if (dataControl.counter <= (rangeTo)) {
          dataControl.counter = rangeTo;
          dataControl.stopEvenBottom = true;
        } else {

          if (dataControl.flagStart) {
            dataControl.counter = rangeFrom + dataControl.counter;
            dataControl.flagStart = false;
          }

          dataControl.stopEvenTop = false;
        }
      }

      if (check === 'top') {
        if (dataControl.range) {
          if (dataControl.counter >= (rangeFrom)) {
            dataControl.counter = rangeFrom;
            dataControl.stopEvenTop = true;
          } else
            dataControl.stopEvenBottom = false;

            dataControl.flagStart = false;
        }
      }

  };

  EventWheel.prototype.Change = function (elementInit, elementObj, value) {
    this.AllData[elementInit][elementObj].counter = value;
  };

  EventWheel.prototype.Start = function(object) {
    var _this        = this;

    _this.All(object, function(data) {
      _this.All(data, function(dataControl, indexControl) {

        dataControl.counter         = 0;
        dataControl.flag            = true;
        dataControl.flagStart       = true;
        dataControl.stopEventTop    = false;
        dataControl.stopEventBottom = false;

        _this.EventWeel(dataControl, function(event, element, checkBottom, checkTop) {

          if (checkBottom) {

            if (dataControl.stopEvenBottom) return;

            if (dataControl.wheelBottom) {
              if (dataControl.flag) {
                dataControl.flag = false;
                dataControl.counter--;

                _this.CheckRange(dataControl, 'bottom');

                dataControl.wheelBottom({
                  counter: dataControl.counter,
                });
                _this.Timeout(dataControl);
              }
            }
          } else if (checkTop) {

            if (dataControl.stopEvenTop) return;

            if (dataControl.wheelTop) {
              if (dataControl.flag) {
                dataControl.flag = false;
                dataControl.counter++;

                _this.CheckRange(dataControl, 'top');

                dataControl.wheelTop({
                  counter: dataControl.counter,
                });
                _this.Timeout(dataControl);
              }
            }
          }


        });

      });
    });

  };

  w._wheel = new EventWheel;

})(window, document);
