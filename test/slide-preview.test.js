
$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite('previews', function() {
  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  test('no previews by default', function() {
    var pages = slider1.find('img').length;
    slider1.slide();
    assert.equal(pages, slider1.find('img').length);
  });

  test('previews generated', function() {
    var pages = slider1.find('img').length;
    slider1.slide().slidePreview();
    assert.equal(pages +2, slider1.find('img').length);
  });

});
