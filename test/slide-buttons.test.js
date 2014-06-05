$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite('buttons', function() {

  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  test('buttons created', function() {
    slider1.slide().slideButtons();
    assert.ok(slider1.find('button').length);
  });
  test('click prev button', function() {
    slider1.slide().slideButtons();
    $('#fixture .slide-next').click();
    $('#fixture .slide-previous').click();
    assert.equal(slider1.slide('getCurrentPage'), 1);
  });
  test('click next button', function() {
    slider1.slide().slideButtons();
    $('#fixture .slide-next').click();
    assert.equal(slider1.slide('getCurrentPage'), 2);
  });

});
