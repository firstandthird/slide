//init sliders
$('#slider1')
  .slide({
  });
$('#slider2')
  .slide({
    itemsPerPage: 2,
  });
$('#slider3')
  .slide({
    wrap: true
  }).slidePreview();
$('#slider4')
  .slide({
  }).slideIndicators({
  });
$('#slider5')
  .slide({
  }).slideButtons({
    autoHide: true
  });

//watch events
$('.slide')
  .on('next.slide', function(e, page) {
    console.log('next', page);
  })
  .on('previous.slide', function(e, page) {
    console.log('previous', page);
  })
  .on('beforeSlide.slide', function(e, page) {
    console.log('before slide', page);
  })
  .on('slide.slide', function(e, page) {
    console.log('slide', page);
  })
  .on('first.slide', function() {
    console.log('first');
  })
  .on('last.slide', function() {
    console.log('last');
  });

$('[data-action="first"]').on('click', function() {
  $('.slide').slide('goFirst');
});
$('[data-action="previous"]').on('click', function() {
  $('.slide').slide('goPrevious');
});
$('[data-action="next"]').on('click', function() {
  $('.slide').slide('goNext');
});
$('[data-action="last"]').on('click', function() {
  $('.slide').slide('goLast');
});
if (window.location.search == '?css=1') {
  $('.slide')
    .addClass('css')
    .slideCssAnimations({
    });
  $('#slider3')
    .prev()
      .remove()
      .end()
    .remove();
}
