(function (d, w) {
  w.Router = function () {};
  Router.prototype.AllData = [];
  Router.prototype.All = function (data, callBack) {
    if(data.forEach) data.forEach(callBack);
    else {
      for(var i = 0; i < data.length; i++) callBack(data[i], i);
    }
  };
  Router.prototype.ChangeUrl = function (url) {
    var _this = this;
    var checkUrls = 0;
    _this.All(_this.AllData, function (data) {
      _this.All(data, function (dataControl, indexControl) {
        var arrayUrl = url.split('/');
        var arrayId = dataControl.adressURL.split(':');
        var contextUrl = arrayUrl[1];
        var contextId = arrayId[0];
        var id = arrayUrl[arrayUrl.length - 1];
        if(url === dataControl.adressURL && !/:/.test(dataControl.adressURL)) {
          dataControl.callBack(url);
        } else if(/:/.test(dataControl.adressURL) && contextId === contextUrl) {
          dataControl.callBack(id);
        } else {
          checkUrls++;
          if(data.length === checkUrls) {
            if(dataControl.adressURL === '*')
              dataControl.callBack(url);
          }
        }
      });
    });
  };
  Router.prototype.Events = function (element, event, anons) {
    var _this = this
    if(element.addEventListener) element.addEventListener(event, anons, false);
    else element.attachEvent(event, anons);
    return _this
  };
  Router.prototype.Initialize = function (data) {
    this.AllData.push(data(this));
  };
  Router.prototype.Start = function (object) {
    var _this = this;
    _this.ChangeUrl(w.location.hash.substring(1));
    _this.Events(window, 'hashchange', function () {
      _this.ChangeUrl(w.location.hash.substring(1));
    });
  };
  w._router = new Router;
}(document, window));