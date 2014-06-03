(function($) {
  $.declare('slide', {
    defaults: {
      page: 1,
      itemsPerPage: 1,
      duration: 500,
      containerClass: 'container',
      wrap: true,
      responsive: false,
      ease: 'swing',
      wrapEl: 'div',
      prevButtonSelector: false,
      nextButtonSelector: false
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

      if(!this.prevButtonSelector || !this.nextButtonSelector) {
        this.previousButton = this.el.find('[data-action=previous]');
        this.nextButton = this.el.find('[data-action=next]');
      } else {
        this.previousButton = $(this.prevButtonSelector);
        this.nextButton = $(this.nextButtonSelector);
      }

      this.go(this.page, 'first');

      if(this.responsive) {
        $(window).on('resize', this.proxy(function(){
          this.updateWidth();
        })).trigger('resize');
      }
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
        if(this.wrap) {
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
      
      this._slide(width, cb);
    },

    first: function(cb) {
      this.go(1, cb);
    },

    last: function(cb) {
      this.go(this.pageCount, cb);
    },

    _slide: function(width, cb) {
      var self = this;
      this.cb = cb;
      this.emit('beforeSlide', this.currentPage);

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

    updateWidth: function(width) {
      if(!width) {
        width = $(window).width();
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
