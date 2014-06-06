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
      if(this.animating) {
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
      var self = this;
      this.currentPage = page;

      var transition = this.overrideTransition || this._slideTo;

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
