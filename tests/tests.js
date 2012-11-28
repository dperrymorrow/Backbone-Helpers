/*global equal:true, test:true, jQuery:true, Backbone:true, JST:true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: true, indent: 2*/

var helper = new Backbone.ViewHelper($('#element'));
// testing the selecting of appropriate item in select box

test("selects the active item", function () {
  helper.selectOption($('select'), 4);
  equal($('select').val(), '4');
});

test("does not pick one if it doesnt match, and approximate is set to false", function () {
  helper.selectOption($('select'), 4.3);
  equal($('select').val(), '0.01');
});

test("rounds down correctly", function () {
  helper.selectOption($('select'), 4.1, {approximate: true, roundDir: 'down'});
  equal($('select').val(), '4');
});

test("rounds up correctly", function () {
  helper.selectOption($('select'), 4.1, {approximate: true, roundDir: 'up'});
  equal($('select').val(), '5');

  helper.selectOption($('select'), 0.2288061745925431, {approximate: true, roundDir: 'up'});
  equal($('select').val(), '1');

  helper.selectOption($('select'), 1.1440308729627156, {approximate: true, roundDir: 'up'});
  equal($('select').val(), '2');
});

test("does not round if value is present", function () {
  helper.selectOption($('select'), 4, {approximate: true, roundDir: 'up'});
  equal($('select').val(), '4');
});

// showing error messages
test("finds human name from data attr", function () {
  helper.displayErrors('donkey', [['invalidInput', 'validation Error']]);
  equal(helper.errorMessages, ['foobar validation Error']);
});

test("defaults to rails fieldname (and uppercases the first letter) if no data-validation_label present", function () {
  helper.displayErrors('donkey', [['invalidInputNoData', 'validation Error']]);
  equal(helper.errorMessages, ['InvalidInputNoData validation Error']);
});

test("finds human name from data attr", function () {
  helper.displayErrors('invalidSelection', [['base', 'validation Error']]);
  equal(helper.errorMessages, ['The Invalid Selection validation Error']);
});
