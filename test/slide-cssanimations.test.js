$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite.skip('css animations', function() {
  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  test('should have classes on slide next', function() {
    slider1.slide().slideCssAnimations();
    slider1.slide('goNext');
    assert.equal($('#fixture .next-item-animation-out').length, 1);
    assert.equal($('#fixture .next-item-animation-in').length, 1);
  });

  test('should have classes on slide prev', function() {
    slider1.slide().slideCssAnimations();
    slider1.slide('goPrevious');
    assert.equal($('#fixture .prev-item-animation-out').length, 1);
    assert.equal($('#fixture .prev-item-animation-in').length, 1);
  });

  test('custom class', function() {
    slider1.slide().slideCssAnimations({
      animationBaseClass: 'test-class'
    });
    slider1.slide('goNext');
    assert.equal($('#fixture .next-test-class-out').length, 1);
    assert.equal($('#fixture .next-test-class-in').length, 1);
  });

});
