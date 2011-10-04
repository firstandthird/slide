/*!
  * Fidel Slider 
  * v0.0.1
  * https://github.com/jgallen23/fidel-slider
  * copyright JGA 2011
  * MIT License
  */

Fidel.Slider = Fidel.ViewController.extend({
  defaults: {
    itemsPerPage: 1,
    duration: 500
  },
  init: function() {
    this._currentPage = 0;
    var items = this.find('li');
    this._pageCount = Math.ceil(items.length/this.itemsPerPage);
    this._pageWidth = items.width()*this.itemsPerPage;
    this._animating = false;
    this._updateButtons();
  },
  next: function() {
    this._slide('-='+this._pageWidth, 1);
  },
  prev: function() {
    this._slide('+='+this._pageWidth, -1);
  },
  _slide: function(width, offset) {
    var self = this;
    if (self._animating)
      return;
    self._animating = true;
    this.container.animate({
      left: width 
    }, self.duration, function() {
      self._animating = false;
      self._currentPage += offset; 
      self.trigger('slide');
      self._updateButtons();
    });
  },
  _updateButtons: function() {
    if (this._currentPage === 0) {//hide prev
      this.prevButton.hide();
      this.trigger('first');
    } else {
      this.prevButton.show();
    }
    if (this._currentPage == this._pageCount - 1) {
      this.nextButton.hide();
      this.trigger('last');
    } else {
      this.nextButton.show();
    }
  }
});
