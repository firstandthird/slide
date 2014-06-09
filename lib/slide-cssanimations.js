(function($) {
  $.declare('slideCssAnimations', {

    defaults: {
      animationEndEvents: 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd',
      animationBaseClass: 'slide-transition',
      itemActiveClass: 'slide-active'
    },

    init: function() {

      var slide = this.el.data('slide');
      this.animating = false;
      this.container = this.el.slide('getContainer');
      this.slides = this.container.children();

      var pageWidth = slide.pageWidth;
      if (this.animationSupport()) {
        this.slides.each(function(index, el) {
          $(this).css({
            left: '-'+(index*pageWidth)+'px'
          });
        });
        this.el.slide('setTransition', this.proxy(this.transition));
        this.slides.eq(0)
          .addClass(this.itemActiveClass);
      }


    },

    animationSupport: function(){
      var animation = false;
      var animationstring = 'animation';
      var keyframeprefix = '';
      var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
      var pfx  = '';

      if (this.el[0].style.animationName !== undefined) { animation = true; }    

      if (!animation) {
        for( var i = 0, k = domPrefixes.length; i < k; i++ ) {
          if( this.el[0].style[domPrefixes[i] + 'AnimationName'] !== undefined ) {
            pfx = domPrefixes[ i ];
            animationstring = pfx + 'Animation';
            keyframeprefix = '-' + pfx.toLowerCase() + '-';
            animation = true;
            return true;
          }
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
