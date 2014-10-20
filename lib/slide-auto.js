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
