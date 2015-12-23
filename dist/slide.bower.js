/*!
 * slide - a generic slider
 * v0.17.0
 * https://github.com/firstandthird/slide/
 * copyright First+Third 2015
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
      wrap: false,
      defaultWidth: true
    },

    init: function() {

      this.el.css('position', 'relative');

      this.itemsUpdated();

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

      if (this.defaultWidth) {
        this.items.css({
          width: itemWidth,
          float: 'left'
        });
      } else {
        this.pageWidth = this.items.first().outerWidth() * this.itemsPerPage;
      }

      if (this.container) {
        this.container.css({
          width: this.pageWidth * this.items.length
        });
      }

    },

    itemsUpdated: function() {
      if (this.container) {
        this.items = this.container.children();
      } else {
        this.items = this.el.children();
      }

      this.pageCount = Math.ceil(this.items.length/this.itemsPerPage);

      this.updateWidth();
    },

    reset: function() {
      this.container.children().remove();
      this.currentPage = 1;
      this.pageCount = 1;
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
  $.declare('slideAuto', {

    defaults: {
      slideOnHover: false,
      delay: 5000
    },

    init: function() {
      if(!this.el.data('slide')) {
        throw new Error('slideAuto() must be called after slide()');
      }

      this.hovering = false;

      this.el.hover(this.proxy(function() {
        this.hovering = !this.hovering;
      }));

      this.timer = setInterval(this.proxy(this.loop), this.delay);
    },

    loop: function() {
      if(!this.slideOnHover && this.hovering) {
        return false;
      }

      this.el.slide('goNext');
    }

  });
}(jQuery));

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
  $.declare('slideLazyLoad', {

    init: function() {
      $(window).load(this.proxy(this.loadImages));
    },

    loadImages: function() {
      this.el.find('[data-src]').each(function() {
        var image = $(this);
        image.attr('src', image.data('src'));
      });
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

(function($) {
  $.declare('slideTouch', {

    init: function() {

      if (typeof Hammer === 'undefined') {
        throw new Error('You must load the Hammer library to use touch. http://hammerjs.github.io');
      }

      var slide = this.el.data('slide');
      this.animating = false;
      this.container = this.el.slide('getContainer');
      this.slides = this.container.children();

      this.pageWidth = slide.pageWidth;

      this.el.slide('setTransition', function(curr, prev, cb) {
        cb();
      });

      this.hammer = new Hammer(this.el[0]);

      this.hammer.on('panstart panend panleft panright', this.proxy(this.panHandler));
    },

    panHandler: function(e) {
       var offset = ((this.el.slide('getCurrentPage')-1) * -this.pageWidth) + e.deltaX;

      if (e.type === 'panstart') {
        this.container.removeClass('slide-animate');
      } else if (e.type === 'panend') {
        this.container.addClass('slide-animate');

        if (Math.abs(e.deltaX) >= this.pageWidth/3) {

          if (e.deltaX < 0) {
            this.el.slide('goNext');
          } else {
            this.el.slide('goPrevious');
          }
        }

        offset = -((this.el.slide('getCurrentPage')-1) * this.pageWidth);
      }

      this.container.css({
        left: offset
      });

    }
  });
})(jQuery);
