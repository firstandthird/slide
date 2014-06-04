$.fn.slide.defaults.duration = 0;
var testx = function() {};

suite('indicators', function() {

  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  // test('set initial indicator', function() {
  //   slider1.slide({ indicators: '.indicators li' });
  //   assert.equal(slider1.find('.indicators .active').length, 1);
  //   assert.equal(slider1.find('.indicators li:eq(0)').hasClass('active'), true);
  // });

  // test('update indicator on slide', function() {
  //   slider1.slide({ indicators: '.indicators li' });
  //   slider1.slide('next');
  //   assert.equal(slider1.find('.indicators .active').length, 1);
  //   assert.equal(slider1.find('.indicators li:eq(1)').hasClass('active'), true);
  // });

  // test('change indicator class', function() {
  //   slider1.slide({ indicators: '.indicators li', indicatorClass: 'selected' });
  //   assert.equal(slider1.find('.indicators .selected').length, 1);
  //   assert.equal(slider1.find('.indicators li:eq(0)').hasClass('selected'), true);
  // });

  // test('click on indicator', function() {
  //   slider1.slide({ indicators: '.indicators li', indicatorClass: 'selected', indicatorClick: true });

  //   slider1.find('.indicators li:eq(2)').click();

  //   assert.equal(slider1.slide('getCurrentPage'), 3);
  // });

});
