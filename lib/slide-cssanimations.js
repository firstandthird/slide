(function($) {
  $.declare('slideCssAnimations', {

    defaults: {
      animationEndEvents: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
      animationBaseClass: 'slide-transition',
      itemActiveClass: 'slide-active'
    },

    init: function() {

      // Check for css3 animation support
      if(this.el[0].style.animationName === undefined) {
        //return false;
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
      this.slides.eq(0)
        .addClass(this.itemActiveClass);

      this.el.slide('setTransition', this.proxy(this.transition));

    },

    transition: function(current, previous, callback) {
      var self = this;
      var out = 0;

      console.log(current, previous);
      var direction = (previous < current) ? 'next' : 'prev';

      /*
      if(page === 1 && this.currentSlide === this.slides.length) {
        direction = 'next';
      }

      if(page === this.slides.length && this.currentSlide === 1) {
        direction = 'prev';
      }
     */

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
