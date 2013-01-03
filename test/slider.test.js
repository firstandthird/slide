
$.fn.slider.defaults.duration = 0;
var testx = function() {};

suite('fidel-slider', function() {
  var slider1;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
  });

  suite('init', function() {

    test('$().slider exists', function() {

      assert.equal(typeof slider1.slider, 'function');
    });

    test('set initial page from options');

  });


  suite('itemsPerPage', function() {

    test('pageCount with default settings', function() {

      var s = slider1.slider().data('slider');
      assert.equal(s.pageCount, 4);
    });

    test('pageCount with itemsPerPage = 2', function() {

      var s = slider1.slider({ itemsPerPage: 2}).data('slider');
      assert.equal(s.pageCount, 2);
    });

    test('pageWidth', function() {

      var s = slider1.slider().data('slider');
      assert.equal(s.pageWidth, 250);
    });

    test('pageWidth with itemsPerPage = 2', function() {

      var s = slider1.slider({ itemsPerPage: 2}).data('slider');
      assert.equal(s.pageWidth, 500);
    });

    test('set width of slider', function() {
      slider1.slider();
      assert.equal(slider1.width(), 250);
    });

    test('set width of slider with itemsPerPage = 2', function() {
      slider1.slider({ itemsPerPage: 2});
      assert.equal(slider1.width(), 500);
    });

  });

  suite('api', function() {

    test('current page', function() {
      slider1.slider();
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('next', function() {
      slider1.slider();
      slider1.slider('next');
      assert.equal(slider1.slider('getCurrentPage'), 2);
    });

    test('next takes a callback', function(done) {
      slider1.slider();
      slider1.slider('next', function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -250);
        done();
      });
    });

    test('next past max pages', function(done) {
      slider1.slider();
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next', function() {
        done();
      });
      assert.equal(slider1.slider('getCurrentPage'), 4);
    });

    test('previous', function(done) {
      slider1.slider();
      slider1.slider('next');
      slider1.slider('previous', function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), 0);
        done();
      });
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('previous if at first page', function() {
      slider1.slider();
      slider1.slider('previous');
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('go', function(done) {
      slider1.slider();
      slider1.slider('go', 2, function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -250);
        assert.equal(slider1.slider('getCurrentPage'), 2);
        done();
      });
    });

    test('go page that doesnt exist');

    test('first method goes to first slide', function(done) {
      slider1.slider();
      slider1.slider('first', function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      });
    });

    test('last method goes to last slide', function(done) {
      slider1.slider();
      slider1.slider('last', function() {
        assert.equal(slider1.slider('getCurrentPage'), 4);
        done();
      });
    });

  });

  suite('buttons', function() {

    test('click to go next', function() {
      console.log('next');
      slider1.slider();
      $('#fixture [data-action=next]').click();
      assert.equal(slider1.slider('getCurrentPage'), 2);
    });

    test('click to go prev', function() {
      slider1.slider();
      $('#fixture [data-action=next]').click();
      $('#fixture [data-action=previous]').click();
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('hide previous when on first page', function() {
      slider1.slider();
      assert.equal($('#fixture [data-action=previous]').css('display'), 'none');
    });

    test('hide next when on last page', function() {
      slider1.slider();
      slider1.slider('last');
      assert.equal($('#fixture [data-action=next]').css('display'), 'none');
    });

    test('show both buttons when if on any other page', function() {
      slider1.slider();
      slider1.slider('next');
      assert.equal($('#fixture [data-action=previous]').css('display'), 'inline-block');
    });


  });

  suite('events', function() {

    test('event when about to slide', function(done) {
      slider1.slider();
      slider1.on('beforeSlide', function() {
        assert.equal(slider1.find('.container').css('left'), 'auto');
        done();
      });
      slider1.slider('next');
    });

    test('event after sliding', function(done) {
      slider1.slider();
      slider1.on('slide', function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -250);
        done();
      });
      slider1.slider('next');
    });

    test('event when on first page', function(done) {
      slider1.slider();
      slider1.on('first', function() {
        done();
      });
      slider1.slider('first');
    });

    test('event when on the last page', function(done) {
      slider1.slider();
      slider1.on('last', function() {
        done();
      });
      slider1.slider('last');
    });

    test('event when going next', function(done) {
      slider1.slider();
      slider1.on('next', function() {
        done();
      });
      slider1.slider('next');
    });

    test('event when going previous', function(done) {
      slider1.slider();
      slider1.on('previous', function() {
        done();
      });
      slider1.slider('previous');
    });

  });

  suite('auto', function() {

    test('auto slide');

    test('set delay');

    test('stop on hover');

  });

});

