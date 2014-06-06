(function($) {
  $.declare('slideCssAnimations', {

    defaults: {
      animationEndEvents: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
      animationBaseClass: 'item-animation'
    },

    events: {
      'beforeSlide.slide': 'updateCurrentSlide'
    },

    init: function() {

      // Check for css3 animation support
      if(this.el[0].style.animationName === undefined) {
        return false;
      }

      this.animating = false;
      this.container = this.el.slide('getContainer');
      this.slides = this.container.children();

      this.el.slide('setTransition', this.proxy(this.transition));
    },

    updateCurrentSlide: function() {
      this.currentSlide = this.el.slide('getCurrentPage');
    },

    transition: function(current, callback) {
      var self = this;
      var out = 0;
      var page = this.currentSlide;

      this.updateCurrentSlide();

      var direction = (this.currentSlide < page) ? 'next' : 'prev';

      if(page === 1 && this.currentSlide === this.slides.length) {
        direction = 'next';
      }

      if(page === this.slides.length && this.currentSlide === 1) {
        direction = 'prev';
      }

      this.animating = true;

      $(this.slides).one(this.animationEndEvents, function(){
        self.animating = false;
        self.container.find('.active').removeClass('active');
        $(self.slides[self.currentPage - 1]).removeClass(direction + '-' + self.animationBaseClass + '-in').addClass('active');
        $(self.slides[out]).removeClass(direction + '-' + self.animationBaseClass + '-out');

        $(self.slides).unbind(self.animationEndEvents);

      });

      if(direction === 'next') {
        out = this.currentSlide - 2;

        if(out < 0) {
          out = this.slides.length - 1;
        }
      } else {
        out = this.currentSlide;

        if(out >= this.slides.length) {
          out = 0;
        }
      }

      $(this.slides[out]).addClass(direction + '-' + this.animationBaseClass + '-out active');
      $(this.slides[this.currentSlide - 1]).addClass(direction + '-' + this.animationBaseClass + '-in active');

      callback();
    }
  });
})(jQuery);
