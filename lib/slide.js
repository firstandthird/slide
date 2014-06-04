(function($) {
  $.declare('slide', {
    defaults: {
      page: 1,
      itemsPerPage: 1,
      duration: 500,
      containerClass: 'container',
      overrideTransition: false,
      wrapEl: 'div'
    },

    elements: {
      '[data-action=previous]': 'previousButton',
      '[data-action=next]': 'nextButton'
    },

    init: function() {
      this.container = this.find('.'+this.containerClass);

      if(!this.container.length) {
        // Since container class wasn't found lets create the shell.
        this.createContainer();
      }

      this.items = this.container.children();
      this.pageCount = Math.ceil(this.items.length/this.itemsPerPage);

      this.container.queue('fx');
      this.animating = false;

      this.updateWidth(this.items.first().outerWidth(true));

      this.go(this.page, 'first');
      this.emit('init.slide');
    },

    getCurrentPage: function() {
      return this.currentPage;
    },

    getPageCount: function() {
      return this.pageCount;
    },

    goNext: function(cb) {
      this.go(this.currentPage + 1, cb);
      this.emit('next.slide', this.currentPage);
    },

    goPrevious: function(cb) {
      this.go(this.currentPage - 1, cb);
      this.emit('previous.slide', this.currentPage);
    },

    go: function(page, cb) {
      if(this.animating) {
        return false;
      }

      if (page > this.pageCount || page < 1) {
        if (typeof cb === 'function') {
          cb();
        }
        return;
      }

      this.currentPage = page;
      var width = '-'+this.pageWidth * (page - 1);
      
      this._slide(width, cb);
    },

    first: function(cb) {
      this.go(1, cb);
      this.emit('first.slide');
    },

    last: function(cb) {
      this.go(this.pageCount, cb);
      this.emit('last.slide');
    },

    _slide: function(width, cb) {
      var self = this;
      this.cb = cb;
      this.emit('beforeSlide.slide', this.currentPage);

      if(typeof this.overrideTransition === 'function') {
        this.overrideTransition().call(this, cb);
        this.emit('slide.slide', this.currentPage);
      } else {
        this.container.animate({
          left: width
        }, self.duration, function() {
          self.emit('slide.slide', self.currentPage);
          if (typeof cb === 'function') {
            cb();
          }
        });
      }
    },

    updateWidth: function(width) {
      if(!width) {
        width = $(this.container).width();
      }

      this.pageWidth = width*this.itemsPerPage;

      this.el.css('width', this.pageWidth);

      this.container.css({
        left: '-' + ~~(this.pageWidth * ((this.currentPage === 0) ? 0 : this.currentPage - 1)) + 'px'
      });

      this.items.css('width', width);

      this.container.css('width', width * this.items.length);
    },

    createContainer: function() {
      this.el.children().wrapAll('<' + this.wrapEl + ' class="' + this.containerClass + '"/>');

      this.container = this.el.find('.' + this.containerClass);

      this.el.css('overflow', 'hidden');
      this.container.css('position', 'relative');
      this.container.children().css('float', 'left');
    }
  });
})(jQuery);
