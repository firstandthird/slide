(function($) {
  $.declare('slidePreview', {
    init: function() {
      this.slide = this.el.data('slide');

      if(!this.slide) {
        throw new Error('slidePreview() must be called after slide()');
      }

      var items = this.slide.items;
      var first = items.first().clone();
      var last = items.last().clone();

      // Duplicate first and last so wrapping looks good
      last.insertBefore(items.first());
      first.insertAfter(items.last());

      // Recalc container width (there's two new elements now)
      this.slide.items = this.slide.container.children();
      this.slide.container.css('width', (this.slide.pageWidth * this.slide.items.length));

      // Offsets container to partially hide previews
      this.slide.container.css('marginLeft', (this.slide.pageWidth / 2) * -1);
      this.el.css('width', '+=' + this.slide.pageWidth);
    }
  });
}(jQuery));
