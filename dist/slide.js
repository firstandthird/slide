/*!
 * slide - a generic slider
 * v0.14.1
 * https://github.com/firstandthird/slide/
 * copyright First+Third 2014
 * MIT License
*/
/*!
 * fidel - a ui view controller
 * v2.2.5
 * https://github.com/jgallen23/fidel
 * copyright Greg Allen 2014
 * MIT License
*/
(function(w, $) {
  var _id = 0;
  var Fidel = function(obj) {
    this.obj = obj;
  };

  Fidel.prototype.__init = function(options) {
    $.extend(this, this.obj);
    this.id = _id++;
    this.namespace = '.fidel' + this.id;
    this.obj.defaults = this.obj.defaults || {};
    $.extend(this, this.obj.defaults, options);
    $('body').trigger('FidelPreInit', this);
    this.setElement(this.el || $('<div/>'));
    if (this.init) {
      this.init();
    }
    $('body').trigger('FidelPostInit', this);
  };
  Fidel.prototype.eventSplitter = /^(\w+)\s*(.*)$/;

  Fidel.prototype.setElement = function(el) {
    this.el = el;
    this.getElements();
    this.dataElements();
    this.delegateEvents();
    this.delegateActions();
  };

  Fidel.prototype.find = function(selector) {
    return this.el.find(selector);
  };

  Fidel.prototype.proxy = function(func) {
    return $.proxy(func, this);
  };

  Fidel.prototype.getElements = function() {
    if (!this.elements)
      return;

    for (var selector in this.elements) {
      var elemName = this.elements[selector];
      this[elemName] = this.find(selector);
    }
  };

  Fidel.prototype.dataElements = function() {
    var self = this;
    this.find('[data-element]').each(function(index, item) {
      var el = $(item);
      var name = el.data('element');
      self[name] = el;
    });
  };

  Fidel.prototype.delegateEvents = function() {
    if (!this.events)
      return;
    for (var key in this.events) {
      var methodName = this.events[key];
      var match = key.match(this.eventSplitter);
      var eventName = match[1], selector = match[2];

      var method = this.proxy(this[methodName]);

      if (selector === '') {
        this.el.on(eventName + this.namespace, method);
      } else {
        if (this[selector] && typeof this[selector] != 'function') {
          this[selector].on(eventName + this.namespace, method);
        } else {
          this.el.on(eventName + this.namespace, selector, method);
        }
      }
    }
  };

  Fidel.prototype.delegateActions = function() {
    var self = this;
    self.el.on('click'+this.namespace, '[data-action]', function(e) {
      var el = $(this);
      var action = el.attr('data-action');
      if (self[action]) {
        self[action](e, el);
      }
    });
  };

  Fidel.prototype.on = function(eventName, cb) {
    this.el.on(eventName+this.namespace, cb);
  };

  Fidel.prototype.one = function(eventName, cb) {
    this.el.one(eventName+this.namespace, cb);
  };

  Fidel.prototype.emit = function(eventName, data, namespaced) {
    var ns = (namespaced) ? this.namespace : '';
    this.el.trigger(eventName+ns, data);
  };

  Fidel.prototype.hide = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].hide();
      }
    }
    this.el.hide();
  };
  Fidel.prototype.show = function() {
    if (this.views) {
      for (var key in this.views) {
        this.views[key].show();
      }
    }
    this.el.show();
  };

  Fidel.prototype.destroy = function() {
    this.el.empty();
    this.emit('destroy');
    this.el.unbind(this.namespace);
  };

  Fidel.declare = function(obj) {
    var FidelModule = function(el, options) {
      this.__init(el, options);
    };
    FidelModule.prototype = new Fidel(obj);
    return FidelModule;
  };

  //for plugins
  Fidel.onPreInit = function(fn) {
    $('body').on('FidelPreInit', function(e, obj) {
      fn.call(obj);
    });
  };
  Fidel.onPostInit = function(fn) {
    $('body').on('FidelPostInit', function(e, obj) {
      fn.call(obj);
    });
  };
  w.Fidel = Fidel;
})(window, window.jQuery || window.Zepto);

(function($) {
  $.declare = function(name, obj) {

    $.fn[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var options = args.shift();
      var methodValue;
      var els;

      els = this.each(function() {
        var $this = $(this);

        var data = $this.data(name);

        if (!data) {
          var View = Fidel.declare(obj);
          var opts = $.extend({}, options, { el: $this });
          data = new View(opts);
          $this.data(name, data); 
        }
        if (typeof options === 'string') {
          methodValue = data[options].apply(data, args);
        }
      });

      return (typeof methodValue !== 'undefined') ? methodValue : els;
    };

    $.fn[name].defaults = obj.defaults || {};

  };

  $.Fidel = window.Fidel;

})(jQuery);

(function($) {
  $.declare('slide', {
    defaults: {
      page: 1,
      itemsPerPage: 1,
      duration: 500,
      containerClass: 'slide-container',
      overrideTransition: false,
      wrap: false
    },

    init: function() {

      this.el.css('position', 'relative');
      this.items = this.el.children();
      this.pageCount = Math.ceil(this.items.length/this.itemsPerPage);

      this.updateWidth();

      this._createContainer();
      this.container.queue('fx');
      this.animating = false;


      this.go(this.page);
      this.emit('init.slide');

    },

    updateWidth: function() {
      var width = this.el.width();
      this.pageWidth = width;
      var itemWidth = width / this.itemsPerPage;
      this.items.css({
        width: itemWidth,
        float: 'left'
      });

    },

    _createContainer: function() {
      this.el.children().wrapAll('<div class="' + this.containerClass + '"/>');

      this.container = this.el.find('.' + this.containerClass);

      var wrapper = $('<div/>').css({
        overflow: 'hidden',
        position: 'relative'
      });
      this.container.wrap(wrapper);

      this.container.css({
        position: 'relative',
        width: this.pageWidth * this.items.length
      });
    },

    getCurrentPage: function() {
      return this.currentPage;
    },

    getPageCount: function() {
      return this.pageCount;
    },

    getContainer: function() {
      return this.container;
    },

    setTransition: function(callback) {
      this.overrideTransition = callback;
    },

    goNext: function(callback) {
      var self = this;
      this.go(this.currentPage + 1, function() {
        self.emit('next.slide', self.currentPage);
        if (callback) {
          callback();
        }
      });
    },

    goPrevious: function(callback) {
      var self = this;
      this.go(this.currentPage - 1, function() {
        self.emit('previous.slide', self.currentPage);
        if (callback) {
          callback();
        }
      });
    },

    goFirst: function(callback) {
      this.go(1, callback);
    },

    goLast: function(callback) {
      this.go(this.pageCount, callback);
    },

    go: function(page, callback) {
      var self = this;
      if(self.animating) {
        return false;
      }

      if (page > this.pageCount || page < 1) {
        if(this.wrap) {
          if(page < 1) {
            page = this.pageCount;
          } else {
            page = 1;
          }
        } else {
          if (typeof callback === 'function') {
            callback();
          }
          return;
        }
      }

      var previousPage = this.currentPage || 1;
      this.emit('beforeSlide.slide', [previousPage, page]);
      this.currentPage = page;

      var transition = this.overrideTransition || this._slideTo;
      self.animating = true;
      transition.call(this, this.currentPage, previousPage, function() {
        self.emit('slide.slide', self.currentPage);
        if (self.currentPage == 1) {
          self.emit('first.slide');
        } else if (self.currentPage == self.pageCount) {
          self.emit('last.slide');
        }
        if (typeof callback === 'function') {
          callback(self.currentPage);
        }
        self.animating = false;
      });
    },

    _slideTo: function(page, previousPage, callback) {
      var width = '-'+this.pageWidth * (page - 1);
      this.container.animate({
        left: width
      }, this.duration, callback);
    }

  });
})(jQuery);

(function($) {
  $.declare('slideButtons', {

    defaults: {
      previousText: 'Previous',
      previousClass: 'slide-previous',
      nextText: 'Next',
      nextClass: 'slide-next',
      offsetX: 10,
      offsetY: 0,
      autoHide: false
    },

    init: function() {
      this.setupButtons();

      if (!this.el.data('slide').wrap) {
        this.el.on('first.slide', this.proxy(this.hidePreviousButton));
        this.el.on('last.slide', this.proxy(this.hideNextButton));
        this.el.on('slide.slide', this.proxy(this.showButtons));
      }
    },

    setupButtons: function() {

      this.prevButton =
        $('<button/>')
          .addClass(this.previousClass)
          .text(this.previousText)
          .css({
            'display': (this.autoHide)?'none':'block',
            'position': 'absolute',
            'top': 50 - this.offsetY +'%',
            'left': this.offsetX,
            'zIndex': 1100
          })
          .on('click', this.proxy(this.prev))
          .appendTo(this.el);

      this.nextButton =
        $('<button/>')
          .addClass(this.nextClass)
          .text(this.nextText)
          .css({
            'display': (this.autoHide)?'none':'block',
            'position': 'absolute',
            'top': 50 - this.offsetY +'%',
            'right': this.offsetX,
            'zIndex': 1100
          })
          .on('click', this.proxy(this.next))
          .appendTo(this.el);

      if (this.autoHide) {
        var self = this;
        this.el.hover(function() {
          self.nextButton.fadeIn();
          self.prevButton.fadeIn();
        }, function(){
          self.nextButton.fadeOut();
          self.prevButton.fadeOut();
        });
      }
    },

    prev: function() {
      this.el.slide('goPrevious');
    },

    next: function() {
      this.el.slide('goNext');
    },

    hidePreviousButton: function() {
      this.prevButton.css('visibility', 'hidden');
    },

    hideNextButton: function() {
      this.nextButton.css('visibility', 'hidden');
    },

    showButtons: function() {
      this.nextButton.css('visibility', 'visible');
      this.prevButton.css('visibility', 'visible');
    }

  });
})(jQuery);

(function($) {
  $.declare('slideCssAnimations', {

    defaults: {
      animationEndEvents: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
      animationBaseClass: 'slide-transition',
      itemActiveClass: 'slide-active'
    },

    init: function() {

      if (!this.animationSupport()) {
        return false;
      }
      var slide = this.el.data('slide');
      this.animating = false;
      this.container = this.el.slide('getContainer');
      this.slides = this.container.children();

      var pageWidth = slide.pageWidth;

      this.slides.each(function(index, el) {
        $(this).css({
          left: '-'+(index*pageWidth)+'px'
        });
      });
      this.el.slide('setTransition', this.proxy(this.transition));
      this.slides.eq(0)
        .addClass(this.itemActiveClass);

    },

    animationSupport: function(){
      var animationstring = 'animation';
      var keyframeprefix = '';
      var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
      var pfx  = '';

      if (this.el[0].style.animationName !== undefined) { return true; }    

      for( var i = 0, k = domPrefixes.length; i < k; i++ ) {
        if( this.el[0].style[domPrefixes[i] + 'AnimationName'] !== undefined ) {
          pfx = domPrefixes[ i ];
          animationstring = pfx + 'Animation';
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          return true;
        }
      }
    },

    transition: function(current, previous, callback) {
      var self = this;
      var out = 0;

      var direction = (previous < current) ? 'next' : 'prev';

      this.animating = true;
      $(this.slides).one(this.animationEndEvents, function(){
        self.animating = false;
        self.container.find('.'+self.itemActiveClass).removeClass(self.itemActiveClass);
        //previous slide
        $(self.slides[previous - 1]).removeClass(self.animationBaseClass + '-' + direction + '-out');
        //current slide
        $(self.slides[current - 1]).removeClass(self.animationBaseClass + '-' + direction + '-in').addClass(self.itemActiveClass);

        $(self.slides).unbind(self.animationEndEvents);

        if (callback) {
          callback();
        }

      });

      //previous slide
      $(this.slides[previous - 1]).addClass(this.animationBaseClass + '-' + direction + '-out ' + this.itemActiveClass);
      //current slide
      $(this.slides[current - 1]).addClass(this.animationBaseClass + '-' + direction + '-in ' + this.itemActiveClass);

    }
  });
})(jQuery);

(function($) {
  $.declare('slideIndicators', {

    defaults: {
      element: '<div/>',
      activeClass: 'slide-indicator-active',
      itemClass: 'slide-indicator',
      containerClass: 'slide-indicators',
      offsetY: 0,
      allowClick: true
    },

    init: function() {
      this.sliderContainer = this.el.slide('getContainer');
      this.pageCount = this.el.slide('getPageCount');

      this.indicatorContainer =
        $(this.element)
          .addClass(this.containerClass)
          .css({
            'position':'absolute',
            'bottom': (this.offsetY < 0) ? (this.offsetY*-1) : 0,
            'width': '100%',
            'overflow':'hidden',
            'text-align':'center',
            'clear':'both'
          })
          .appendTo(this.el);

      if (this.offsetY > 0) {
        this.indicatorContainer.css({
          'position': 'static',
          'marginTop': this.offsetY
        });
      }


      this.createIndicators();

      if (this.allowClick) {
        this.indicators.bind('click', this.proxy(this.indicatorClicked));
      }

      var self = this;
      this.el.on('beforeSlide.slide', function(e, from, to){
        self.setIndicators(to);
      });

      self.setIndicators(this.el.slide('getCurrentPage'));

    },

    setIndicators: function(page) {
      this.indicators.removeClass(this.activeClass);
      this.indicators.eq(page - 1).addClass(this.activeClass);
    },

    createIndicators: function() {
      var indicator;
      var indicators = [];

      for (var i=1, j = this.pageCount; i<=j; i++) {
        indicator = '<span class="'+this.itemClass+'" data-slide-index="'+i+'"></span>';
        indicators.push(indicator);
      }
      this.indicatorContainer
        .append(indicators);

      this.indicators = this.indicatorContainer.children();
    },

    indicatorClicked: function(e) {
      var index = $(e.currentTarget).data('slide-index');
      this.el.slide('go', index);
    }

  });
})(jQuery);

(function($) {
  $.declare('slideKeypress', {

    init: function() {

      this.keyEvents = {
        37: 'goPrevious',
        39: 'goNext'
      };

      $(document).keydown(this.proxy(function(e){
        if (this.keyEvents[e.which] && this.isElementInViewport(this.el)) {
          this.el.slide(this.keyEvents[e.which]);
        }
      }));
    },

    isElementInViewport: function(el) {
      el = el[0];
      var rect = el.getBoundingClientRect();
      return (
        rect.top > 0 &&
        rect.bottom < (window.innerHeight || document.documentElement.clientHeight)
      );
    },

    goPreviousKey: function(e) {
      this.el.slide('goPrevious');
    },

    goNextKey: function(e) {
      this.el.slide('goNext');
    }

  });
})(jQuery);

(function($) {
  $.declare('slidePreview', {
    init: function() {
      this.slide = this.el.data('slide');

      if(!this.slide) {
        throw new Error('slidePreview() must be called after slide()');
      }

      var items = this.slide.items;
      var first = items.first().clone();
      var last = items.last().clone();

      // Duplicate first and last so wrapping looks good
      last.insertBefore(items.first());
      first.insertAfter(items.last());

      // Recalc container width (there's two new elements now)
      this.slide.items = this.slide.container.children();
      this.slide.container.css('width', (this.slide.pageWidth * this.slide.items.length));

      // Offsets container to partially hide previews
      this.slide.container.css('marginLeft', (this.slide.pageWidth / 2) * -1);
      this.el.css('width', '+=' + this.slide.pageWidth);
    }
  });
}(jQuery));
