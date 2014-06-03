(function($) {
  $.declare('slideIndicators', {

    defaults: {
      indicators: false,
      indicatorClass: 'active',
      indicatorClick: true
    },

    init: function() {
      console.log('slide indicators loaded');
      this.indicators = $(this.indicators);
      if(this.indicatorClick) {
        this.indicators.on('click', this.proxy(this.indicatorClicked));
      }

      $(window).on('slide next', this.proxy(function(e, currentPage){
        this.indicators.removeClass(this.indicatorClass);
        this.indicators.eq(currentPage - 1).addClass(this.indicatorClass);
      }));

    },

    indicatorClicked: function(e) {
      var index = this.el.find(this.indicators).index(e.currentTarget);
      this.emit('indicatorClicked', index+1);
    }

  });
})(jQuery);
