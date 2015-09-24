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
