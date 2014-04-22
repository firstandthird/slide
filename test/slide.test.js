
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

    test('set initial page from options', function() {
      slider1.slider({ page: 2 });
      assert.equal(slider1.slider('getCurrentPage'), 2);
    });

    test('no previews by default', function() {
      var pages = slider1.find('.item').length;
      slider1.slider();
      assert.equal(pages, slider1.find('.item').length);
    });

    test('previews generated', function() {
      var pages = slider1.find('.item').length;
      slider1.slider({ previews: true });
      assert.equal(pages +2, slider1.find('.item').length);
    });

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
      assert.equal(s.pageWidth, 270);
    });

    test('pageWidth with itemsPerPage = 2', function() {

      var s = slider1.slider({ itemsPerPage: 2}).data('slider');
      assert.equal(s.pageWidth, 540);
    });

    test('set width of slider', function() {
      slider1.slider();
      assert.equal(slider1.width(), 270);
    });

    test('set width of slider with itemsPerPage = 2', function() {
      slider1.slider({ itemsPerPage: 2});
      assert.equal(slider1.width(), 540);
    });

  });

  suite('api', function() {

    test('current page', function() {
      slider1.slider();
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('getPageCount', function() {
      slider1.slider();
      assert.equal(slider1.slider('getPageCount'), 4);
    });

    test('next', function() {
      slider1.slider();
      slider1.slider('next');
      assert.equal(slider1.slider('getCurrentPage'), 2);
    });

    test('next takes a callback', function(done) {
      slider1.slider();
      slider1.slider('next', function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -270);
        done();
      });
    });

    test('next past max pages', function(done) {
      slider1.slider({wrap: false});
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

    test('next past max pages with wrap', function(done) {
      slider1.slider({wrap: true});
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next');
      slider1.slider('next', function() {
        done();
      });
      assert.equal(slider1.slider('getCurrentPage'), 3);
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
      slider1.slider({wrap: false});
      slider1.slider('previous');
      assert.equal(slider1.slider('getCurrentPage'), 1);
    });

    test('previous if at first page with wrap', function() {
      slider1.slider({wrap: true});
      slider1.slider('previous');
      assert.equal(slider1.slider('getCurrentPage'), 4);
    });

    test('go', function(done) {
      slider1.slider();
      slider1.slider('go', 2, function() {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -270);
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
      slider1.slider({wrap:false});
      assert.equal($('#fixture [data-action=previous]').css('display'), 'none');
    });

    test('hide next when on last page', function() {
      slider1.slider({wrap: false});
      slider1.slider('last');
      assert.equal($('#fixture [data-action=next]').css('display'), 'none');
    });

    test('show both buttons when if on any other page', function() {
      slider1.slider();
      slider1.slider('next');
      assert.equal($('#fixture [data-action=previous]').css('display'), 'inline-block');
    });

    test('data-action=go to jump to a page', function() {
      slider1.slider();
      $('#fixture [data-action=go]').click();
      assert.equal(slider1.slider('getCurrentPage'), 3);
    });

    test('show both buttons if previews = true', function(){
      slider1.slider({ previews: true });
      assert.equal($('#fixture [data-action=previous]').css('display'), 'inline-block');
    });

  });

  suite('events', function() {

    test('event when about to slide', function(done) {
      slider1.slider();
      slider1.on('beforeSlide', function(e, pageNumber) {
        assert.equal(slider1.find('.container').css('left'), '0px');
        assert.equal(pageNumber, 2);
        done();
      });
      slider1.slider('next');
    });

    test('event after sliding', function(done) {
      slider1.slider();
      slider1.on('slide', function(e, pageNumber) {
        assert.equal(parseInt(slider1.find('.container').css('left'), 10), -270);
        assert.equal(pageNumber, 2);
        done();
      });
      slider1.slider('next');
    });

    test('event when on first page', function(done) {
      slider1.slider();
      slider1.on('first', function(e, pageNumber) {
        assert.equal(pageNumber, 1);
        done();
      });
      slider1.slider('first');
    });

    test('event when on the last page', function(done) {
      slider1.slider();
      slider1.on('last', function(e, pageNumber) {
        assert.equal(pageNumber, 4);
        done();
      });
      slider1.slider('last');
    });

    test('event when going next', function(done) {
      slider1.slider();
      slider1.on('next', function(e, pageNumber) {
        assert.equal(pageNumber, 2);
        done();
      });
      slider1.slider('next');
    });

    test('event when going previous', function(done) {
      slider1.slider({wrap: false});
      slider1.on('previous', function(e, pageNumber) {
        assert.equal(pageNumber, 1);
        done();
      });
      slider1.slider('previous');
    });

  });

  suite('auto', function() {

    test('auto slide', function(done) {
      slider1.slider({ auto: true, autoDelay: 10 });
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 2);
        setTimeout(function() {
          assert.equal(slider1.slider('getCurrentPage'), 3);
          done();
        }, 10);
      }, 15);
    });

    test('stop on hover', function(done) {
      slider1.slider({ auto: true, autoDelay: 10 });
      slider1.mouseover();
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      }, 15);
    });

    test('continue on mouse out', function(done) {
      slider1.slider({ auto: true, autoDelay: 10 });
      slider1.mouseover();
      setTimeout(function() {
        slider1.mouseout();
      }, 5);
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 2);
        done();
      }, 25);
    });

    test('auto: false to disable', function(done) {
      slider1.slider({ auto: false });
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      }, 15);
    });

    test.skip('wrap around automatically', function(done) {
      slider1.slider({ auto: true, autoDelay: 5 });
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      }, 5*5);
    });

    test.skip('disable wrap', function(done) {
      slider1.slider({ auto: true, autoDelay: 5, wrap: false });
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 4);
        done();
      }, 5*6);
    });

    test('method to stop', function(done) {
      slider1.slider({ auto: true, autoDelay: 5 });
      slider1.slider('stop');
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      }, 7);
    });

    test('method to start', function(done) {
      slider1.slider({ autoDelay: 5 });
      slider1.slider('start');
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 2);
        setTimeout(function() {
          assert.equal(slider1.slider('getCurrentPage'), 3);
          done();
        }, 7);
      }, 7);
    });

    test('call start method and mouse over', function(done) {
      slider1.slider({ autoDelay: 5 });
      slider1.slider('start');
      slider1.mouseover();
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        slider1.mouseout();
        setTimeout(function() {
          assert.equal(slider1.slider('getCurrentPage'), 2);
          done();
        }, 7);
      }, 7);
    });

    test('mouseout doesnt start auto', function(done) {
      slider1.slider({ autoDelay: 5 });
      slider1.mouseover();
      slider1.mouseout();
      setTimeout(function() {
        assert.equal(slider1.slider('getCurrentPage'), 1);
        done();
      }, 7);
    });



  });

  suite('indicators', function() {

    test('set initial indicator', function() {
      slider1.slider({ indicators: '.indicators li' });
      assert.equal(slider1.find('.indicators .active').length, 1);
      assert.equal(slider1.find('.indicators li:eq(0)').hasClass('active'), true);
    });

    test('update indicator on slide', function() {
      slider1.slider({ indicators: '.indicators li' });
      slider1.slider('next');
      assert.equal(slider1.find('.indicators .active').length, 1);
      assert.equal(slider1.find('.indicators li:eq(1)').hasClass('active'), true);
    });

    test('change indicator class', function() {
      slider1.slider({ indicators: '.indicators li', indicatorClass: 'selected' });
      assert.equal(slider1.find('.indicators .selected').length, 1);
      assert.equal(slider1.find('.indicators li:eq(0)').hasClass('selected'), true);
    });

    test('click on indicator', function() {
      slider1.slider({ indicators: '.indicators li', indicatorClass: 'selected', indicatorClick: true });

      slider1.find('.indicators li:eq(2)').click();

      assert.equal(slider1.slider('getCurrentPage'), 3);
    });

  });

  suite('resize', function() {

    test('updateWidth should update width', function() {
      slider1.slider();
      slider1.slider('updateWidth', 200);

      assert.equal(slider1.width(), 200);
    });

  });

  suite('css animations', function() {

    test('should have classes on slide next', function() {
      slider1.slider({
        cssAnimate: true
      });
      slider1.slider('next');
      assert.equal($('#fixture .nextItemAnimationOut').length, 1);
      assert.equal($('#fixture .nextItemAnimationIn').length, 1);
    });

    test('should have classes on slide prev', function() {
      slider1.slider({
        cssAnimate: true
      });
      slider1.slider('previous');
      assert.equal($('#fixture .prevItemAnimationOut').length, 1);
      assert.equal($('#fixture .prevItemAnimationIn').length, 1);
    });

    test('custom class', function() {
      slider1.slider({
        cssAnimate: true,
        animationBaseClass: 'TestClass'
      });
      slider1.slider('next');
      assert.equal($('#fixture .nextTestClassOut').length, 1);
      assert.equal($('#fixture .nextTestClassIn').length, 1);
    });

  });

});

