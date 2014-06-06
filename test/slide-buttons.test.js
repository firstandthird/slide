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

  test('hide previous button on first page', function() {
    slider1.slide().slideButtons();
    assert.equal($('#fixture .slide-previous').css('visibility'), 'hidden');
  });

  test('hide next button on last page', function(done) {
    slider1.slide().slideButtons();
    slider1.slide('goLast', function() {
      assert.equal($('#fixture .slide-next').css('visibility'), 'hidden');
      done();
    });
  });

  test('show previous button on 2nd page', function(done) {
    slider1.slide().slideButtons();
    slider1.slide('goNext', function() {
      assert.equal($('#fixture .slide-previous').css('visibility'), 'visible');
      done();
    });
  });

  test('show previous on first page if wrap enabled', function() {
    $('#fixture,#clone').css('visibility', 'visible');
    slider1.slide({ wrap: true }).slideButtons();
    assert.equal($('#fixture .slide-previous').css('visibility'), 'visible');
    $('#fixture,#clone').css('visibility', 'hidden');
  });

  test('show next on last page if wrap enabled', function(done) {
    $('#fixture,#clone').css('visibility', 'visible');
    slider1.slide({ wrap: true }).slideButtons();
    slider1.slide('goLast', function() {
      assert.equal($('#fixture .slide-next').css('visibility'), 'visible');
      $('#fixture,#clone').css('visibility', 'hidden');
      done();
    });
  });

});
