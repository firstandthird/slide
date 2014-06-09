(function($) {
  $.declare('slideKeypress', {

    init: function() {

      this.keyEvents = {
        37: 'goPrevious',
        39: 'goNext'
      };

      $(document).keydown(this.proxy(function(e){
        if (e.which in this.keyEvents && this.isElementInViewport(this.el)) {
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
