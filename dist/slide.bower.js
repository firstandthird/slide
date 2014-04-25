/*!
 * slide - a generic slider
 * v0.12.0
 * https://github.com/firstandthird/slide/
 * copyright First+Third 2014
 * MIT License
*/
(function($) {
  $.declare('slide', {
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
      previews: false,
      cssAnimate: false,
      responsive: false,
      ease: 'swing',
      animationEndEvents: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
      animationBaseClass: 'item-animation'
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
      this.animating = false;

      this.updateWidth(this.items.first().outerWidth(true));

      this.go(this.page, 'first');
      if (this.auto) {
        this.start();
      }

      if (this.indicators && this.indicatorClick) {
        this.el.find(this.indicators).on('click', this.proxy(this.indicatorClicked));
      }

      if(this.responsive) {
        $(window).on('resize', this.proxy(function(){
          this.updateWidth();
        })).trigger('resize');
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
      if(this.animating) {
        return false;
      }

      //check if click from data-action
      if (typeof page === 'object')  {
        page = $(page.target).data('page');
      }

      if (page > this.pageCount || page < 1) {
        if(this.previews || this.wrap) {
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
      var direction = (this.currentPage < page) ? 'next' : 'prev';
      
      if(page === 1 && this.currentPage === this.items.length) {
        direction = 'next';
      }

      if(page === this.items.length && this.currentPage === 1) {
        direction = 'prev';
      }

      this.currentPage = page;
      var width = '-'+this.pageWidth * (page - 1);
      
      if(this.cssAnimate) {
        this._slideCSS(direction, cb);
      } else {
        this._slide(width, cb);
      }
      
      if (this.indicators) {
        var indicators = this.el.find(this.indicators);
        indicators.removeClass(this.indicatorClass);
        indicators.eq(this.currentPage - 1).addClass(this.indicatorClass);
      }
    },

    first: function(cb) {
      this.go(1, cb);
    },

    last: function(cb) {
      this.go(this.pageCount, cb);
    },

    _slideCSS: function(direction, cb) {
      var self = this;
      var out = 0;

      if(cb === 'first') {
        $(this.items[this.currentPage - 1]).addClass('active');
        return;
      }

      this.animating = true;

      $(self.items).one(this.animationEndEvents, function(){
        self.animating = false;
        self.container.find('.active').removeClass('active');
        $(self.items[self.currentPage - 1]).removeClass(direction + '-' + self.animationBaseClass + '-in').addClass('active');
        $(self.items[out]).removeClass(direction + '-' + self.animationBaseClass + '-out');

        $(self.items).unbind(self.animationEndEvents);

        self.emit('slide', self.currentPage);
        if (typeof cb == 'function') {
          cb();
        }
      });

      if(direction === 'next') {
        out = this.currentPage - 2;

        if(out < 0) {
          out = this.items.length - 1;
        }
      } else {
        out = this.currentPage;

        if(out >= this.items.length) {
          out = 0;
        }
      }

      $(this.items[out]).addClass(direction + '-' + this.animationBaseClass + '-out active');
      $(this.items[this.currentPage - 1]).addClass(direction + '-' + this.animationBaseClass + '-in active');
    },

    _slide: function(width, cb) {
      var self = this;
      this.cb = cb;
      this.emit('beforeSlide', this.currentPage);
      this.updateButtons();

      if(cb === 'first') {
        this.container.css({
          left: width
        });
      } else {
        this.container.animate({
          left: width
        }, self.duration, this.ease, function() {
          self.emit('slide', self.currentPage);
          if (typeof cb == 'function') {
            cb();
          }
        });
      }
    },

    updateButtons: function() {
      if (this.currentPage === 1) {
        this.emit('first', this.currentPage);
      }

      if (this.currentPage === this.pageCount) {
        this.emit('last', this.currentPage);
      }

      if (this.currentPage == 1 && !this.previews && !this.wrap) {
        this.previousButton.hide();
      } else {
        this.previousButton.show();
      }
      if (this.currentPage == this.pageCount  && !this.previews && !this.wrap) {
        this.nextButton.hide();
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
        if (!this.cssAnimate) {
          this.el.find('.wrapper').css('margin-left', '-' + (width / 2) + 'px');
        }
      }

      if (!this.cssAnimate) {
        this.container.css({
          left: '-' + ~~(this.pageWidth * ((this.currentPage === 0) ? 0 : this.currentPage - 1)) + 'px'
        });
      }

      this.items.css('width', width);
    }
  });
})(jQuery);
