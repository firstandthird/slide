(function($) {
  $.declare('slideButtons', {

    defaults: {
      previousText: 'Previous',
      previousClass: 'slide-previous',
      nextText: 'Next',
      nextClass: 'slide-next',
      offsetX: 10,
      offsetY: 0,
      autoHide: false
    },

    init: function() {
      this.setupButtons();

      if (!this.el.data('slide').wrap) {
        this.el.on('first.slide', this.proxy(this.hidePreviousButton));
        this.el.on('last.slide', this.proxy(this.hideNextButton));
        this.el.on('slide.slide', this.proxy(this.showButtons));
      }

      this.el.on('reset.slide', this.proxy(this.hidePreviousButton));
      this.el.on('reset.slide', this.proxy(this.hideNextButton));
    },

    setupButtons: function() {

      this.prevButton =
        $('<button/>')
          .addClass(this.previousClass)
          .text(this.previousText)
          .css({
            'display': (this.autoHide)?'none':'block',
            'position': 'absolute',
            'top': 50 - this.offsetY +'%',
            'left': this.offsetX,
            'zIndex': 1100
          })
          .on('click', this.proxy(this.prev))
          .appendTo(this.el);

      this.nextButton =
        $('<button/>')
          .addClass(this.nextClass)
          .text(this.nextText)
          .css({
            'display': (this.autoHide)?'none':'block',
            'position': 'absolute',
            'top': 50 - this.offsetY +'%',
            'right': this.offsetX,
            'zIndex': 1100
          })
          .on('click', this.proxy(this.next))
          .appendTo(this.el);

      if (this.autoHide) {
        var self = this;
        this.el.hover(function() {
          self.nextButton.fadeIn();
          self.prevButton.fadeIn();
        }, function(){
          self.nextButton.fadeOut();
          self.prevButton.fadeOut();
        });
      }
    },

    prev: function() {
      this.el.slide('goPrevious');
    },

    next: function() {
      this.el.slide('goNext');
    },

    hidePreviousButton: function() {
      this.prevButton.css('visibility', 'hidden');
    },

    hideNextButton: function() {
      this.nextButton.css('visibility', 'hidden');
    },

    showButtons: function() {
      this.nextButton.css('visibility', 'visible');
      this.prevButton.css('visibility', 'visible');
    }

  });
})(jQuery);
