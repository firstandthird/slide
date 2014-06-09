
$.fn.slide.defaults.duration = 0;

suite('slide', function() {
  var slider1;
  var slider2;

  setup(function() {
    $('#fixture').empty().html($('#clone').clone());

    slider1 = $('#fixture .slider1');
    slider2 = $('#fixture .slider2');
  });

  suite('init', function() {

    test('$().slide exists', function() {
      assert.equal(typeof slider1.slide, 'function');
    });

    test('set initial page from options', function() {
      slider1.slide({ page: 2 });
      assert.equal(slider1.slide('getCurrentPage'), 2);
    });
  });

  suite('itemsPerPage', function() {

    test('pageCount with default settings', function() {

      var s = slider1.slide().data('slide');
      assert.equal(s.pageCount, 3);
    });

    test('pageCount with itemsPerPage = 2', function() {

      var s = slider1.slide({ itemsPerPage: 2}).data('slide');
      assert.equal(s.pageCount, 2);
    });

    test('pageWidth', function() {

      var s = slider1.slide().data('slide');
      assert.equal(s.pageWidth, 500);
    });

    test('pageWidth with itemsPerPage = 2', function() {

      var s = slider1.slide({ itemsPerPage: 2}).data('slide');
      assert.equal(s.pageWidth, 500);
    });

    test('set width of slider', function() {
      slider1.slide();
      assert.equal(slider1.width(), 500);
    });

    test('set width of slider with itemsPerPage = 2', function() {
      slider1.slide({ itemsPerPage: 2});
      assert.equal(slider1.width(), 500);
    });

  });

  suite('api', function() {

    test('current page', function() {
      slider1.slide();
      assert.equal(slider1.slide('getCurrentPage'), 1);
    });

    test('getPageCount', function() {
      slider1.slide();
      assert.equal(slider1.slide('getPageCount'), 3);
    });

    test('goNext', function() {
      slider1.slide();
      slider1.slide('goNext');
      assert.equal(slider1.slide('getCurrentPage'), 2);
    });

    test('goNext takes a callback', function(done) {
      slider1.slide();
      slider1.slide('goNext', function() {
        assert.equal(slider1.find('.slide-container').css('left'), "-500px");
        done();
      });
    });

    test('goNext past max pages', function(done) {
      slider1.slide();
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext', function() {
        assert.equal(slider1.slide('getCurrentPage'), 3);
        done();
      });
    });


    test('next past max pages with wrap', function(done) {
      slider1.slide({wrap: true});
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext');
      slider1.slide('goNext', function() {
        assert.equal(slider1.slide('getCurrentPage'), 1);
        done();
      });
    });

    test('previous', function(done) {
      slider1.slide();
      slider1.slide('goNext');
      slider1.slide('goPrevious', function() {
        assert.equal(slider1.find('.slide-container').css('left'), "0px");
        done();
      });
      assert.equal(slider1.slide('getCurrentPage'), 1);
    });

    test('previous if at first page', function() {
      slider1.slide();
      slider1.slide('goPrevious');
      assert.equal(slider1.slide('getCurrentPage'), 1);
    });


    test('previous if at first page with wrap', function() {
      slider1.slide({wrap: true});
      slider1.slide('goPrevious');
      assert.equal(slider1.slide('getCurrentPage'), 3);
    });

    test('go', function(done) {
      slider1.slide();
      slider1.slide('go', 2, function() {
        assert.equal(slider1.find('.slide-container').css('left'), "-500px");
        assert.equal(slider1.slide('getCurrentPage'), 2);
        done();
      });
    });

    test('go page that doesnt exist');

    test('first method goes to first slide', function(done) {
      slider1.slide();
      slider1.slide('goFirst', function() {
        assert.equal(slider1.slide('getCurrentPage'), 1);
        done();
      });
    });

    test('last method goes to last slide', function(done) {
      slider1.slide();
      slider1.slide('goLast', function() {
        assert.equal(slider1.slide('getCurrentPage'), 3);
        done();
      });
    });

  });

  suite('events', function() {

    test('event when about to slide', function(done) {
      slider1.slide();
      slider1.on('beforeSlide.slide', function(e, from, to) {
        assert.equal(slider1.find('.slide-container').css('left'), '0px');
        assert.equal(from, 1);
        assert.equal(to, 2);
        done();
      });
      slider1.slide('goNext');
    });

    test('event after sliding', function(done) {
      slider1.slide();
      slider1.on('slide.slide', function(e, pageNumber) {
        assert.equal(slider1.find('.slide-container').css('left'), '-500px');
        assert.equal(pageNumber, 2);
        done();
      });
      slider1.slide('goNext');
    });

    test('event when on first page', function(done) {
      slider1.slide();
      slider1.on('first.slide', function() {
        assert.ok(true);
        done();
      });
      slider1.slide('goFirst');
    });

    test('event when on the last page', function(done) {
      slider1.slide();
      slider1.on('last.slide', function() {
        assert.ok(true);
        done();
      });
      slider1.slide('goLast');
    });

    test('event when going next', function(done) {
      slider1.slide();
      slider1.on('next.slide', function(e, pageNumber) {
        assert.equal(pageNumber, 2);
        done();
      });
      slider1.slide('goNext');
    });

    test('event when going previous', function(done) {
      slider1.slide({wrap: false});
      slider1.on('previous.slide', function(e, pageNumber) {
        assert.equal(pageNumber, 1);
        done();
      });
      slider1.slide('goPrevious');
    });

  });

  suite('auto wrap', function() {
    test('should wrap inner content in container', function() {
      slider2.slide();

      assert.equal(slider2.find('.slide-container').length, 1);
    });
  });

});

