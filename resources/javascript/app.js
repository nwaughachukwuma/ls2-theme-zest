//
// Zurb Foundation stuff
//
;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
      Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).
  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);

//
// Theme scripts
//

(function ($) {
  // 
  // Automatically apply Foundation custom form styles when an AJAX request finishes
  //
  $(window).on('onAfterAjaxUpdate', function(){
    $(document).foundationCustomForms();
  });

  $(document).ready(function() {
    // 
    // Handle thumbnail clicks on the Product page
    //
    $('#product-page').on('click', 'div.item-images ul a', function(){
      $('div.big-image img', $(this).closest('.item-images')).attr('src', this.href);

      return false;
    })

    //Handle selecting product option
    $(document).on('change', 'select.product-option', function () {
      $(this).sendRequest('shop:product', {
          update: {'#product-page': 'shop-product'}
      });
    });

    //
    // Handle the Enter key in the Coupon field
    //
    $('#cart-content').on('keydown', 'input#coupon', function(ev) {
      if (ev.keyCode == 13) {
        $(this).sendRequest('shop:cart', {
          update: {'#cart-content': 'shop-cart-content', '#mini-cart': 'shop-minicart'},
          extraFields: {'set_coupon_code': 1}
        });
      }
    }) 

    //
    // Handle the Enter key in the Quantity field
    //
    $('#cart-content').on('keydown', 'input.quantity', function(ev) {
      if (ev.keyCode == 13) {
        $(this).sendRequest('shop:cart', {
          update: {'#cart-content': 'shop-cart-content', '#mini-cart': 'shop-minicart'}
        });
      }
    });

    //
    // Handle the shipping option radio button clicks
    //
    $('#checkout-page').on('change', '#shipping-methods input', function(){
      // When the shipping method is shipping we want to update the 
      // order totals area on the Checkout page. The native Checkout 
      // action does all the calculations.
      //
      $(this).sendRequest('shop:onCheckoutShippingMethod', {
        update: {'#checkout-totals': 'shop-checkout-totals'}
      })
    });

    //
    // Apply Foundation form customization to payment forms
    //
    function foundationCustomizePaymentForms() {
      $('#payment_form form').addClass('custom');
      $(document).foundationCustomForms();
      $('#payment_form form div.custom.dropdown').css('width', '100%');
      $('#payment_form form input[type=button], #payment_form form input[type=submit]').addClass('button');
    }

    if ($('#payment_form').length) {
      foundationCustomizePaymentForms();
    }

    $('#payment_method').change(function(){
      $(this).sendRequest('shop:on_updatePaymentMethod', {
        update: {'payment_form': 'shop-paymentform'},
        onAfterUpdate: foundationCustomizePaymentForms
      });
    })

    $(document).on('click', '#copy_billing_to_shipping', function (){
      //data-ajax-handler="shop:onCopyBillingToShipping" data-ajax-update="#checkout-page=shop-checkoutaddress"
      $(this).sendRequest('shop:onCheckoutBillingInfo', {
          onAfterUpdate: function() {
            $(this).sendRequest('shop:onCopyBillingToShipping', {
              update: {'#checkout-page' : 'shop-checkout-address'}
            });
          }
      });
    })

    // 
    // Automatically update state lists when a country is changed
    //
    $(document).on('change', '[data-state-selector2]', function(){
      var 
        stateSelectorId = $(this).data('state-selector2');
        updateList = {};
        
      updateList['#'+stateSelectorId] = 'shop-stateoptions';

      $(this).sendRequest('shop:onUpdateStateList', {
          extraFields: {
            country_id: $(this).val(),
            state_id: $(this).data('current-state')
          },
          update: updateList,
          onAfterUpdate: function() {
            $('#'+stateSelectorId).change(); // Forces Foundation to redraw the drop-down element
          }
      });
    });
  });

  $(document).on('change', '#payment_method', function() {
    $(this).sendRequest('shop:onUpdatePaymentMethod', {
        update: {'#payment_form' : 'shop-paymentform'},
        onAfterUpdate: function () { }
    });
  })
})(jQuery);