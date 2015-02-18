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
