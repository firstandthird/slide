/*!
 * fidel-slider - a generic slider using fidel
 * v0.6.0
 * https://github.com/jgallen23/fidel-slider
 * copyright JGA 2013
 * MIT License
*/
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
      var items = this.find('.'+this.itemClass);
      this.pageCount = Math.ceil(items.length/this.itemsPerPage);
      this.pageWidth = items.outerWidth(true)*this.itemsPerPage;
      this.container = this.find('.'+this.containerClass);
      this.container.queue('fx');

      if(!this.previews) {
        this.el.css('width', this.pageWidth);
      } else {
        this.el.css('width', this.pageWidth * 2);
        this.el.find('.wrapper').css('margin-left', '-' + (this.pageWidth / 2) + 'px');
      }

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
    }
  });
})(jQuery);
