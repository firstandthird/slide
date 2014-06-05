/*!
 * slide - a generic slider
 * v0.13.1
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
      containerClass: 'slide-container',
      overrideTransition: false,
      wrapEl: 'div',
      wrap: false
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

    getContainer: function() {
      return this.container;
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

      this.emit('beforeSlide.slide', this.currentPage);
      var self = this;
      this.currentPage = page;

      var transition = this.overrideTransition || this._slideTo;

      transition.call(this, this.currentPage, function() {
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

    _slideTo: function(page, callback) {
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
      previousOffsetX: 10,
      previousOffsetY: 0,
      nextText: 'Next',
      nextClass: 'slide-next',
      nextOffsetX: 10,
      nextOffsetY: 0,
      autoHide: false
    },

    init: function() {
      this.el.css({ 'position': 'relative' });
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
            'top': 50 - this.previousOffsetY +'%',
            'left': this.previousOffsetX
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
            'top': 50 - this.nextOffsetY +'%',
            'right': this.nextOffsetX
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
  $.declare('slideIndicators', {

    defaults: {
      element: '<div/>',
      activeClass: 'slide-indicator-active',
      itemClass: 'slide-indicator',
      offsetY: -10,
      allowClick: true
    },

    init: function() {
      this.sliderContainer = this.el.slide('getContainer');
      this.pageCount = this.el.slide('getPageCount');

      this.indicatorContainer = $(this.element).css({
        'position':'absolute',
        'bottom': (this.offsetY < 0) ? -this.offsetY : 0,
        'width': '100%',
        'overflow':'hidden',
        'text-align':'center',
        'clear':'both'
      }).appendTo(this.el);


      this.createIndicators();
      this.indicators = $('.'+this.itemClass);

      if (this.allowClick) {
        this.indicators.bind('click', this.proxy(this.indicatorClicked));
      }

      this.el.on('slide.slide', this.proxy(function(e, currentPage){
        this.indicators.removeClass(this.activeClass);
        this.indicators.eq(currentPage - 1).addClass(this.activeClass);
      }));

    },

    createIndicators: function() {
      var indicator;
      var indicators = [];

      for (var i=1, j = this.pageCount; i<=j; i++) {
        indicator = '<span class="'+this.itemClass+'" data-slide-index="'+i+'"></span>';
        indicators.push(indicator);
      }
      this.indicatorContainer.append(indicators);

      $(this.el).css({
        'position': 'relative',
        'padding-bottom': (this.offsetY > 0) ? this.offsetY : 0
      });
    },

    indicatorClicked: function(e) {
      var index = $(e.currentTarget).data('slide-index');
      this.el.slide('go', index);
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
