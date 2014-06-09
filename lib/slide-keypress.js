(function($) {
  $.declare('slideKeypress', {

    init: function() {
      $(document).keydown(this.proxy(function(e){
        if (e.which == 37) { 
          if (this.isElementInViewport(this.el)) {
            this.goPreviousKey(e);
          }
        }
        if (e.which == 39) { 
          if (this.isElementInViewport(this.el)) {
            this.goNextKey(e);
          }
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
