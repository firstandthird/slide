(function($) {
  $.declare('slideIndicators', {

    defaults: {
      element: '<div/>',
      activeClass: 'slide-indicator-active',
      itemClass: 'slide-indicator',
      containerClass: 'slide-indicators',
      offsetY: -10,
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
            'bottom': (this.offsetY < 0) ? -this.offsetY : 0,
            'width': '100%',
            'overflow':'hidden',
            'text-align':'center',
            'clear':'both'
          })
          .appendTo(this.el);


      this.createIndicators();
      this.indicators = $('.'+this.itemClass);

      if (this.allowClick) {
        this.indicators.bind('click', this.proxy(this.indicatorClicked));
      }

      this.el.on('slide.slide', this.proxy(function(e, currentPage){
        this.indicators.removeClass(this.activeClass);
        this.indicators.eq(currentPage - 1).addClass(this.activeClass);
      }));

    },

    createIndicators: function() {
      var indicator;
      var indicators = [];

      for (var i=1, j = this.pageCount; i<=j; i++) {
        indicator = '<span class="'+this.itemClass+'" data-slide-index="'+i+'"></span>';
        indicators.push(indicator);
      }
      this.indicatorContainer.append(indicators);

      $(this.el).css({
        'padding-bottom': (this.offsetY > 0) ? this.offsetY : 0
      });
    },

    indicatorClicked: function(e) {
      var index = $(e.currentTarget).data('slide-index');
      this.el.slide('go', index);
    }

  });
})(jQuery);
