(function($) {
  $.declare('slide', {
    defaults: {
      page: 1,
      itemsPerPage: 1,
      duration: 500,
      containerClass: 'slide-container',
      overrideTransition: false,
      wrapEl: 'div'
    },

    init: function() {

      this.items = this.el.children();
      this.pageCount = Math.ceil(this.items.length/this.itemsPerPage);

      this.updateWidth();

      this._createContainer();
      this.container.queue('fx');
      this.animating = false;


      this.go(this.page, 'first');
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
      this.el.children().wrapAll('<' + this.wrapEl + ' class="' + this.containerClass + '"/>');

      this.container = this.el.find('.' + this.containerClass);

      this.el.css('overflow', 'hidden');
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
        if (typeof callback === 'function') {
          callback();
        }
        return;
      }

      this.emit('beforeSlide.slide', this.currentPage);
      var self = this;
      this.currentPage = page;

      var transition = this.overrideTransition || this._slideTo;

      transition.call(this, this.currentPage, function() {
        self.emit('slide.slide', self.currentPage);
        if (self.currentPage == 1) {
          self.emit('first.slide');
        } else if (self.currentPage == this.pageCount) {
          self.emit('last.slide');
        }
        if (typeof callback === 'function') {
          callback(this.currentPage);
        }
      });
    },

    _slideTo: function(page, callback) {
      var width = '-'+this.pageWidth * (page - 1);
      this.container.animate({
        left: width
      }, this.duration, callback);
    }

  });
})(jQuery);
