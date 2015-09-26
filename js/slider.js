(function (d, w) {
  w.Slider = function (array) {
    var _this = this;
    var allSliders = d.getElementsByClassName(array[0].sliderContainer).length;
    if(allSliders > 1 && array.length === 1) {
      for(var i = 0; i < (allSliders - 1); i++) array.push(array[i]);
    }
    _this.All(array, function (slider, indexSlider) {
      var container = d.getElementsByClassName(slider.sliderContainer)[indexSlider];
      var containerSlides = d.getElementsByClassName(slider.allSlidesList)[indexSlider];
      var controls = slider.controls;
      var slides = containerSlides.children;
      var numberSlides = slides.length + 2;
      var counter = 1;
      containerSlides.style.width = (100 * numberSlides) + '%';
      _this.All(slides, function (slide, indexSlide) {
        slide.style.width = (100 / numberSlides) + '%';
      });
      _this.Translate3d().start({
        element: containerSlides,
        speed: 0,
        x: '-' + (100 / numberSlides) + '%'
      });
      if(_this.CheckWorkTranslate3d(containerSlides)) {
        _this.CloneAfter(slides[0], containerSlides);
        _this.CloneBefore(slides[numberSlides - 3], containerSlides);
      }
      var dataCallBack = function (indexSlider) {
        return {
          elementContainer: container,
          allSlides: slides,
          elementSlide: slides[_this.DataSliders[indexSlider].valueCounter],
        };
      };
      _this.DataSliders.push({
        container: containerSlides,
        valueCounter: counter,
        valueNumberSlides: numberSlides,
        data: slider
      });
      if(slider.startSlide)
        slider.startSlide(dataCallBack(indexSlider));
      if(slider.endSlide)
        _this.Translate3d().end(containerSlides, function () {
          slider.endSlide(dataCallBack(indexSlider));
        });
      if(controls.arrowsNavigation && _this.ShowButtons)
        _this.ShowButtons(container, indexSlider, controls.arrowsNavigation);
      if(controls.dotsNavigation && _this.ShowDots)
        _this.ShowDots(container, indexSlider, controls.dotsNavigation);
      if(controls.boxMenu && _this.ShowBox)
        _this.ShowBox(container, indexSlider, controls.boxMenu);
      if(slider.autoplay && _this.Interval)
        _this.Interval(container, indexSlider, (slider.timeout + slider.speed));
    });
  }
  Slider.prototype.DataSliders = [];
  Slider.prototype.CloneAfter = function (element, block) {
    block.appendChild(element.cloneNode(true));
  };
  Slider.prototype.CloneBefore = function (element, block) {
    block.insertBefore(element.cloneNode(true), block.childNodes[0]);
  };
  Slider.prototype.CheckMobileDevice = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|ZuneWP7/i
      .test(navigator.userAgent || navigator.vendor || window.opera)
  };
  Slider.prototype.CheckWorkTranslate3d = function (element) {
    return /transition/.test('' + element.getAttribute('style'));
  };
  Slider.prototype.All = function (data, callBack) {
    if(data.forEach) data.forEach(callBack);
    else {
      for(var i = 0; i < data.length; i++) callBack(data[i], i);
    }
  };
  Slider.prototype.AddRemClass = function (element, name, value) {
    var regVar = function (p) {
      return new RegExp('(^|\\s)' + p + '(\\s|$)', 'g');
    };
    switch(value) {
    case 'add':
      if(element.classList !== undefined) element.classList.add(name);
      else {
        if(!regVar(name).test(element.className)) element.className += ' ' + name;
      }
      break;
    case 'rem':
      if(element.classList !== undefined) element.classList.remove(name);
      else {
        if(regVar(name).test(element.className)) element.className = element.className.replace(regVar(name), ' ');
      }
      break;
    default:
      return;
    };
  };
  Slider.prototype.AddLastElement = function (object) {
    var create = d.createElement(object.tag);
    if(object.nameId) create.id = object.nameId + '';
    if(object.nameClass) create.className = object.nameClass;
    if(object.attr && object.valAttr) create.setAttribute(object.attr, object.valAttr);
    object.element.appendChild(create);
  };
  Slider.prototype.Events = function (element, value, anons) {
    if(element.addEventListener) element.addEventListener(value, anons, false);
    else if(element.attachEvent() !== false) element.attachEvent(value, anons)
    else element.onclick = anons;
  };
  Slider.prototype.Buttons = function (value, index, thisSlide) {
    var _this = this;
    var valueSlider = _this.DataSliders[index];
    var controls = valueSlider.data.controls;
    var step = 30;
    var callBackData = function (slide) {
      return {
        allSlides: valueSlider.container.children,
        elementSlide: valueSlider.container.children[slide]
      };
    };
    var positionSlide = function (speedAnimation) {
      _this.Translate3d().start({
        element: valueSlider.container,
        speed: speedAnimation,
        typeAnimation: valueSlider.data.typeAnimation,
        x: '-' + ((100 / valueSlider.valueNumberSlides) * valueSlider.valueCounter) + '%',
        notWork: function (element) {
          var posSlide = (100 * (valueSlider.valueCounter - 1));
          if(/MSIE 8/i.test(navigator.userAgent) || !w.$) {
            if(posSlide < 0) posSlide = 0;
            element.style.marginLeft = '-' + posSlide + '%';
            if(valueSlider.data.endSlide)
              valueSlider.data.endSlide(callBackData(valueSlider.valueCounter - 1));
          } else if(w.$) {
            $(element).animate({
                'margin-left': '-' + posSlide + '%'
              }, speedAnimation,
              function () {
                if(valueSlider.data.endSlide)
                  valueSlider.data.endSlide(callBackData(valueSlider.valueCounter - 1));
              });
          }
        }
      });
    };
    switch(value) {
    case 'next':
      valueSlider.valueCounter++;
      if(valueSlider.valueCounter === (valueSlider.valueNumberSlides - 1)) {
        valueSlider.valueCounter = 0;
        positionSlide(0);
        setTimeout(function () {
          valueSlider.valueCounter = 1;
          positionSlide(valueSlider.data.speed);
        }, step);
      } else positionSlide(valueSlider.data.speed);
      if(valueSlider.valueCounter < 1) valueSlider.valueCounter = 1;
      if(valueSlider.data.startSlide)
        valueSlider.data.startSlide(callBackData(valueSlider.valueCounter));
      break;
    case 'prev':
      valueSlider.valueCounter--;
      if(valueSlider.valueCounter === 0) {
        if(_this.CheckWorkTranslate3d(valueSlider.container)) {
          valueSlider.valueCounter = valueSlider.valueNumberSlides - 1;
          positionSlide(0);
          setTimeout(function () {
            valueSlider.valueCounter = valueSlider.valueNumberSlides - 2;
            positionSlide(valueSlider.data.speed);
          }, step);
        } else {
          valueSlider.valueCounter = valueSlider.valueNumberSlides - 2;
          positionSlide(valueSlider.data.speed);
        }
      } else positionSlide(valueSlider.data.speed);
      if(valueSlider.valueCounter > (valueSlider.valueNumberSlides - 2))
        valueSlider.valueCounter = valueSlider.valueNumberSlides - 2;
      if(valueSlider.data.startSlide)
        valueSlider.data.startSlide(callBackData(valueSlider.valueCounter));
      break;
    case 'this-slide':
      if(thisSlide >= 1 && thisSlide <= (valueSlider.valueNumberSlides - 2)) {
        valueSlider.valueCounter = thisSlide;
        positionSlide(valueSlider.data.speed);
      }
      break;
    default:
      return;
    }
    if(controls.dotsNavigation && _this.ShowDots)
      _this.ActiveClass(controls.dotsNavigation.classNameDots, controls.dotsNavigation, index);
    if(controls.boxMenu && _this.ShowBox)
      _this.ActiveClass(controls.boxMenu.classNameBox, controls.boxMenu, index);
  };
  Slider.prototype.ActiveClass = function (container, navigation, index) {
    var _this = this;
    var valueSlider = _this.DataSliders[index];
    if(navigation) {
      var block = (typeof container === 'string' ? d.getElementById(container + index) : container);
      var counter = valueSlider.valueCounter - 1;
      _this.All(block.children, function (element, indexDots) {
        _this.AddRemClass(element, navigation.classNameActive, 'rem');
      });
      if(counter === (-1))
        counter = 0;
      if(counter === (valueSlider.valueNumberSlides - 2))
        counter = valueSlider.valueNumberSlides - 3;
      _this.AddRemClass(block.children[counter], navigation.classNameActive, 'add');
    }
  };
  Slider.prototype.ShowButtons = function (containerSlider, index, object) {
    var _this = this;
    var checkEvent = false;
    var nameTag = 'DIV';
    _this.AddLastElement({
      element: containerSlider,
      tag: nameTag,
      nameId: 'next-btn' + index,
      nameClass: object.classNameBtnNext
    });
    _this.AddLastElement({
      element: containerSlider,
      tag: nameTag,
      nameId: 'prev-btn' + index,
      nameClass: object.classNameBtnPrev
    });
    if(!_this.CheckMobileDevice())
      checkEvent = 'click';
    else
      checkEvent = 'touchstart';
    _this.Events(d.getElementById('next-btn' + '' + index), checkEvent, function () {
      _this.Buttons('next', index);
    });
    _this.Events(d.getElementById('prev-btn' + '' + index), checkEvent, function () {
      _this.Buttons('prev', index);
    });
  };
  Slider.prototype.ShowDots = function (containerSlider, index, object) {
    var _this = this;
    var valueSlider = _this.DataSliders[index];
    var allDots = '';
    var checkEvent = false;
    var controls = valueSlider.data.controls;
    var classDots = controls.dotsNavigation.classNameDots;
    _this.AddLastElement({
      element: containerSlider,
      tag: 'UL',
      nameId: classDots + index,
      nameClass: object.classNameDots
    });
    var dots = d.getElementById(classDots + index);
    for(var i = 0; i < (valueSlider.valueNumberSlides - 2); i++)
      allDots += '<li></li>';
    dots.innerHTML = allDots;
    if(!_this.CheckMobileDevice())
      checkEvent = 'click';
    else
      checkEvent = 'touchstart';
    _this.All(dots.children, function (element, indexDots) {
      _this.Events(element, checkEvent, function () {
        if(valueSlider.data.startSlide)
          valueSlider.data.startSlide({
            allSlides: valueSlider.container.children,
            elementSlide: valueSlider.container.children[indexDots + 1]
          });
        _this.All(dots.children, function (element, indexDots) {
          _this.AddRemClass(element, object.classNameActive, 'rem');
        });
        _this.AddRemClass(this, object.classNameActive, 'add');
        _this.Buttons('this-slide', index, (indexDots + 1));
      });
    });
    if(_this.ShowDots)
      _this.ActiveClass(classDots, controls.dotsNavigation, index);
  };
  Slider.prototype.ShowBox = function (containerSlider, index, object) {
    var _this = this;
    var valueSlider = _this.DataSliders[index];
    var allDots = '';
    var checkEvent = false;
    var controls = valueSlider.data.controls;
    var classBox = controls.boxMenu.classNameBox;
    var box = classBox;
    if(!_this.CheckMobileDevice())
      checkEvent = 'click';
    else
      checkEvent = 'touchstart';
    _this.All(box.children, function (element, indexBox) {
      _this.Events(element, checkEvent, function () {
        if(valueSlider.data.startSlide)
          valueSlider.data.startSlide({
            allSlides: valueSlider.container.children,
            elementSlide: valueSlider.container.children[indexBox + 1]
          });
        _this.All(box.children, function (element, indexBox) {
          _this.AddRemClass(element, object.classNameActive, 'rem');
        });
        _this.AddRemClass(this, object.classNameActive, 'add');
        _this.Buttons('this-slide', index, (indexBox + 1));
      });
    });
    if(_this.ShowBox)
      _this.ActiveClass(classBox, controls.boxMenu, index);
  };
  Slider.prototype.Interval = function (container, indexSlider, timeout) {
    var _this = this;
    var interval = function () {
      var startInterval;
      startInterval = setInterval(function () {
        _this.Buttons('next', indexSlider);
      }, timeout);
    };
    interval();
    container.onmouseover = function () {
      clearInterval(startInterval);
    };
    container.onmouseout = interval;
  };
  Slider.prototype.Translate3d = function () {
    var _this = this;
    var transform = [
      'WebkitTransform',
      'MozTransform',
      'OTransform',
      'msTransform'
    ];
    var transition = [
      'WebkitTransition',
      'MozTransition',
      'OTransition',
      'msTransition'
    ];
    var transitionEnd = [
      'webkitTransitionEnd',
      'oTransitionEnd',
      'otransitionend',
      'transitionend'
    ];
    return {
      start: function (object) {
        _this.All(transition, function (value, i) {
          object.element.style[value] = 'all ' + (object.speed / 1000 || 0) + 's' + ' ' + (object.typeAnimation || 'linear')
        });
        _this.All(transform, function (value, i) {
          object.element.style[value] = 'translate3d(' + (object.x || 0) + ', ' + (object.y || 0) + ', ' + (object.z || 0) + ')'
        });
        if(object.notWork && !_this.CheckWorkTranslate3d(object.element))
          object.notWork(object.element)
      },
      end: function (element, callBack) {
        _this.All(transitionEnd, function (value) {
          _this.Events(element, value, callBack)
        });
      }
    };
  };
})(document, window);