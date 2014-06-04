(function($) {
  $.declare('slideIndicators', {

    defaults: {
      element: '<div/>',
      activeClass: 'slide-indicator-active',
      itemClass: 'slide-indicator',
      offsetY: '-10px',
      allowClick: true
    },

    init: function() {
      this.sliderContainer = $('.'+this.el.slide('getContainer'));
      this.pageCount = this.el.slide('getPageCount');

      this.sliderContainer.after($(this.element).addClass('indicators'));

      $('.indicators').css({
        'clear':'both',
        'overflow':'hidden',
        'text-align':'center'
      });

      this.createIndicators();
      this.indicators = $('.'+this.itemClass);

      if (this.allowClick) {
        this.indicators.bind('click', this.proxy(function(e){this.indicatorClicked(e);}));
      }

      $(window).on('slide.slide', this.proxy(function(e, currentPage){
        this.indicators.removeClass(this.activeClass);
        this.indicators.eq(currentPage - 1).addClass(this.activeClass);
      }));

    },

    createIndicators: function() {
      var indicator;
      for (var i=1; i<=this.pageCount; i++) {
        indicator = '<span class="'+this.itemClass+'">'+i+'</span>';
        this.el.find('.indicators').append(indicator);
      }

    },

    indicatorClicked: function(e) {
      var index = $(this.indicators).index(e.currentTarget)+1;
      this.el.slide('go', index);
      //this.emit('indicatorClicked', index+1);
    }

  });
})(jQuery);
