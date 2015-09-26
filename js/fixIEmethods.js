(function(w,d){
  var check=(!w.getComputedStyle||!d.getElementsByClassName);
    if (check) {
        //getElementsByClassName
        d.getElementsByClassName =
        Element.prototype.getElementsByClassName = function(class_names) {
            class_names = (' ' + class_names)
                .replace(/\s*(\s|$)/g, '$1').replace(/\s/g, '.');
            return this.querySelectorAll(class_names);
        };
        //getComputedStyle
        w.getComputedStyle = function(el, pseudo) {
            this.el = el;
            this.getPropertyValue = function(prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop == 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return this;
        }
    }
})(window,document);
