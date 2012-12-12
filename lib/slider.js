$.declare('slider', {
  defaults: {
    itemsPerPage: 1,
    duration: 500
  },
  elements: {
    '[data-element=container]': 'container',
    '[data-element=prevButton]': 'prev',
    '[data-element=nextButton]': 'next'
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
    this.els.container.animate({
      left: width 
    }, self.duration, function() {
      self._animating = false;
      self._currentPage += offset; 
      self.emit('slide');
      self._updateButtons();
    });
  },
  _updateButtons: function() {
    //hide prev
    if (this._currentPage === 0) {
      this.els.prev.hide();
      this.emit('first');
    } else {
      this.els.prev.show();
    }
    if (this._currentPage == this._pageCount - 1) {
      this.els.next.hide();
      this.emit('last');
    } else {
      this.els.next.show();
    }
  }
});
