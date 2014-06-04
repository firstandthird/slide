$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite('buttons', function() {

  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  // test('click to go next', function() {
  //   slider1.slide();
  //   $('#fixture [data-action=goNext]').click();
  //   assert.equal(slider1.slide('getCurrentPage'), 2);
  // });

  // test('click to go prev', function() {
  //   slider1.slide();
  //   $('#fixture [data-action=goNext]').click();
  //   $('#fixture [data-action=goPrevious]').click();
  //   assert.equal(slider1.slide('getCurrentPage'), 1);
  // });

  /*
  test('hide previous when on first page', function() {
    slider1.slide({wrap:false});
    assert.equal($('#fixture [data-action=previous]').css('display'), 'none');
  });

  test('hide next when on last page', function() {
    slider1.slide({wrap: false});
    slider1.slide('last');
    assert.equal($('#fixture [data-action=next]').css('display'), 'none');
  });

  test('show both buttons when if on any other page', function() {
    slider1.slide();
    slider1.slide('goNext');
    assert.equal($('#fixture [data-action=previous]').css('display'), 'inline-block');
  });

  test('data-action=go to jump to a page', function() {
    slider1.slide();
    $('#fixture [data-action=go]').click();
    assert.equal(slider1.slide('getCurrentPage'), 3);
  });

  test('show both buttons if previews = true', function(){
    slider1.slide({ previews: true });
    assert.equal($('#fixture [data-action=goPrevious]').css('display'), 'inline-block');
  });
  */

});
