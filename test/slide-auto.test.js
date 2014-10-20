$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite('auto', function() {
  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  test('auto slides', function(done) {
    slider1.slide().slideAuto({
      delay: 200
    });

    setTimeout(function() {
      assert.equal(slider1.slide('getCurrentPage'), 2);
      done();
    }, 300);
  });

  test('don\'t slide on hover', function(done) {
    slider1.slide().slideAuto({
      delay: 200
    });

    slider1.trigger('mouseover');

    setTimeout(function() {
      assert.equal(slider1.slide('getCurrentPage'), 1);
      done();
    }, 300);
  });

  test('should resume sliding when mouseout', function(done) {
    slider1.slide().slideAuto({
      delay: 200
    });

    slider1.trigger('mouseenter');
    slider1.trigger('mouseleave');

    setTimeout(function() {
      assert.equal(slider1.slide('getCurrentPage'), 2);
      done();
    }, 300);
  });

  test('should slide on hover when slideOnHover = true', function(done) {
    slider1.slide().slideAuto({
      slideOnHover: true,
      delay: 200
    });

    slider1.trigger('mouseover');

    setTimeout(function() {
      assert.equal(slider1.slide('getCurrentPage'), 2);
      done();
    }, 300);
  });

});
