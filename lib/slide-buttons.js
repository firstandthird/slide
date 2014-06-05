(function($) {
  $.declare('slideButtons', {

    defaults: {
      previousText: 'Previous',
      previousClass: 'slide-previous',
      previousOffsetX: 10,
      previousOffsetY: 0,
      nextText: 'Next',
      nextClass: 'slide-next',
      nextOffsetX: 10,
      nextOffsetY: 0,
      showOnHover: false
    },

    init: function() {
      this.el.css({ 'position': 'relative' });
      
      this.createButtons();
      this.prevButton.bind('click', this.proxy(this.prev));
      this.nextButton.bind('click', this.proxy(this.next));
    },
    
    createButtons: function() {
      this.prevButton = $('<button class="'+this.previousClass+'" type="button">'+this.previousText+'</button>').appendTo(this.el);
      this.nextButton = $('<button class="'+this.nextClass+'" type="button">'+this.nextText+'</button>').appendTo(this.el);
      var buttons = this.el.find('button');
      var buttonHeight = buttons.height();

      this.prevButton.css({
        'display': (this.showOnHover)?'none':'block',
        'position': 'absolute',
        'top': 50 - this.previousOffsetY +'%',
        'left': this.previousOffsetX,
        'margin-top': -buttonHeight/2
      });
      this.nextButton.css({
        'display': (this.showOnHover)?'none':'block',
        'position': 'absolute',
        'top': 50 - this.nextOffsetY +'%',
        'right': this.nextOffsetX,
        'margin-top': -buttonHeight/2
      });

      if (this.showOnHover) {
        this.el.hover(function() {
          buttons.fadeIn();
        }, function(){
          buttons.fadeOut();
        });
      }
    },

    prev: function(e) {
      this.el.slide('goPrevious');
    },
    next: function(e) {
      this.el.slide('goNext');
    }

  });
})(jQuery);
