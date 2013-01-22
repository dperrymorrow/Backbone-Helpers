/*global _:true, RPM:true, jQuery:true, Backbone: true, JST: true, $:true*/
/*jslint browser: true, white: false, vars: true, devel: true, bitwise: true, debug: true, nomen: true, sloppy: false, indent: 2*/

window.Backbone = window.Backbone || {};
window.Backbone.ViewHelper = (function () {
  "use strict";

  function ViewHelper($element) {
    this.$el = $element;
    this.errorMessages = [];
  }

  ViewHelper.prototype.setElement = function ($element) {
    this.$el = $element;
  };

  ViewHelper.prototype.clearErrors = function () {
    this.errorMessages = [];
    this.$el.find('*').removeClass('error');
  };

  // rails 2 style....
  ViewHelper.prototype.handleErrors = function (xhr, flashTarget) {
    this.clearErrors();
    flashTarget = flashTarget || '#primary_content';
    var responseObj = $.parseJSON(xhr.responseText);

    if (responseObj.errors) {

      if (_.isArray(responseObj.errors)) {
        this.displayErrors('Base', responseObj.errors);

      } else {
        _.each(_.keys(responseObj.errors), function (key) {
          this.displayErrors(key, responseObj.errors[key]);
        }, this);
      }
      // needs made more generic, should create a flash msg method that takes options
      RPM.add_flash_message('error', 'validation_error', JST['shared/_validation_errors.haml']({errors: this.errorMessages}), true, false, flashTarget);

    } else {
      // same as above
      RPM.add_flash_message('error', 'ajax_error', RPM.GENERIC_AJAX_ERROR, true);
    }
  };

  ViewHelper.prototype.displayErrors = function (key, errors) {
    _.each(errors, function (error) {
      var field = error[0];
      if (field === 'base') {field = key; }
      this.highlightError(field);
      this.errorMessages.push(this.humanFieldName(field) + " " + error[1]);
    }, this);
  };

  ViewHelper.prototype.humanFieldName = function (field) {
    var humanized = this.fieldElement(field).data('validation_label');
    if (!humanized) {
      humanized = field.replace(/_/g, ' ');
      humanized = humanized.charAt(0).toUpperCase() + humanized.substring(1);
    }
    return humanized;
  };

  ViewHelper.prototype.fieldElement = function (fieldName) {
    return this.$el.find('*[name="' + fieldName + '"], .' + fieldName);
  };

  ViewHelper.prototype.highlightError = function (fieldName) {
    this.fieldElement(fieldName).addClass('error');
  };
  
  ViewHelper.prototype.gatherForm = function (model, $form) {
    $form = $form || this.$el.find('form').first();
    _.each(_.keys(model.attributes), function (key) {
      var $elem = $form.find('*[name="' + key + '"]').first();
      if ($elem.length > 0) {
        model.set(key, $elem.val());
      }
    });
  };
  
  ViewHelper.prototype.selectOption = function ($select, value, options) {
    var values = [], selectedValue = null, i = 0, $chosenOption = {};
    options = options || {};
    options.approximate = options.approximate || false;
    options.roundDir = options.roundDir || 'down';
    $chosenOption = $select.find('option[value="' + value + '"]');

    if (options.approximate && $chosenOption.length === 0) {
      $select.find('option').each(function (option) { values.push($(this).attr('value')); });

      values.sort(function (a, b) {return a - b; });

      for (i = 0; i <= values.length; i += 1) {
        if (value > values[i] && value < values[i + 1]) {
          selectedValue = (options.roundDir === 'up') ? values[i + 1] : values[i];
          break;
        }
      }
      $chosenOption = $select.find('option[value="' + selectedValue + '"]');
    }

    if ($chosenOption.length > 0) {
      $select.find('option').removeAttr('selected');
      $chosenOption.attr('selected', true);
    }
  };

  return ViewHelper;
}());
