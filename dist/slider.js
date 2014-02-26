/*!
 * fidel-slider - a generic slider using fidel
 * v0.6.0
 * https://github.com/jgallen23/fidel-slider
 * copyright JGA 2014
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
  $.declare('slider', {
    defaults: {
      page: 1,
      itemsPerPage: 1,
      duration: 500,
      itemClass: 'item',
      containerClass: 'container',
      auto: false,
      autoDelay: 5000,
      indicators: false,
      indicatorClass: 'active',
      indicatorClick: true,
      wrap: true,
      previews: false
    },

    events: {
      'mouseover': 'stop',
      'mouseout': 'start'
    },

    elements: {
      '[data-action=previous]': 'previousButton',
      '[data-action=next]': 'nextButton'
    },

    init: function() {
      this.items = this.find('.'+this.itemClass);
      this.pageCount = Math.ceil(this.items.length/this.itemsPerPage);
      this.container = this.find('.'+this.containerClass);
      this.container.queue('fx');

      this.updateWidth(this.items.first().outerWidth(true));

      this.go(this.page);
      if (this.auto) {
        this.start();
      }

      this.updatePreview();
    },

    getCurrentPage: function() {
      return this.currentPage;
    },

    getPageCount: function() {
      return this.pageCount;
    },

    next: function(cb) {
      this.go(this.currentPage + 1, cb);
      this.emit('next', this.currentPage);
    },

    previous: function(cb) {
      this.go(this.currentPage - 1, cb);
      this.emit('previous', this.currentPage);
    },

    go: function(page, cb) {
      //check if click from data-action
      if (typeof page === 'object')  {
        page = $(page.target).data('page');
      }

      if (page > this.pageCount || page < 1) {
        if(this.previews) {
          if(page < 1) {
            this.go(this.pageCount, cb);
          } else {
            this.go(1, cb);
          }
        } else {
          if (typeof cb == 'function') {
            cb();
          }
        }
        return;
      }
      this.currentPage = page;
      var width = '-'+this.pageWidth * (page - 1);
      this._slide(width, cb);
      if (this.indicators) {
        var indicators = this.el.find(this.indicators);
        indicators.removeClass(this.indicatorClass);
        indicators.eq(this.currentPage - 1).addClass(this.indicatorClass);
        if (this.indicatorClick) {
          indicators.on('click', this.proxy(this.indicatorClicked));
        }
      }
    },

    first: function(cb) {
      this.go(1, cb);
    },

    last: function(cb) {
      this.go(this.pageCount, cb);
    },

    _slide: function(width, cb) {
      var self = this;
      this.emit('beforeSlide', this.currentPage);
      this.updateButtons();
      this.container.animate({
        left: width
      }, self.duration, function() {
        self.emit('slide', self.currentPage);
        if (typeof cb == 'function') {
          cb();
        }
      });
    },

    updateButtons: function() {
      if (this.currentPage == 1 && !this.previews) {
        this.previousButton.hide();
        this.emit('first', this.currentPage);
      } else {
        this.previousButton.show();
      }
      if (this.currentPage == this.pageCount  && !this.previews) {
        this.nextButton.hide();
        this.emit('last', this.currentPage);
      } else {
        this.nextButton.show();
      }
    },

    updatePreview: function() {
      if(!this.previews) return;

      var items = this.find('.'+this.itemClass);
      var first = items.first().clone();
      var last = items.last().clone();

      last.insertBefore(items.first());
      first.insertAfter(items.last());
    },

    start: function(e) {
      if (e && !this.auto) {
        return;
      }
      this.auto = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      var self = this;
      this.timeout = setTimeout(function() {
        if (self.wrap && self.currentPage == self.pageCount) {
          self.currentPage = 0;
        }
        self.next();
        self.start();
      }, this.autoDelay);
    },

    stop: function() {
      if (!this.auto) {
        return;
      }
      clearTimeout(this.timeout);
    },

    indicatorClicked: function(e) {
      var index = this.el.find(this.indicators).index(e.currentTarget);
      this.go(index+1);
    },

    updateWidth: function(width) {
      if(!width) {
        width = $(window).width();
      }

      this.pageWidth = width*this.itemsPerPage;

      if(!this.previews) {
        this.el.css('width', this.pageWidth);
      } else {
        this.el.css('width', width * 2);
        this.el.find('.wrapper').css('margin-left', '-' + (width / 2) + 'px');
      }

      this.container.css({
        left: '-'+this.pageWidth * ((this.currentPage === 0) ? 0 : this.currentPage - 1)
      });

      this.items.css('width', width);
    }
  });
})(jQuery);
