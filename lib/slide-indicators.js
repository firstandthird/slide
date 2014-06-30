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
