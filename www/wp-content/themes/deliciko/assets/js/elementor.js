( function ($, elementor) {
	"use strict";


    var DELICIKO = {

        init: function () {
            
            var widgets = {
				'delicios-testimonial.default': DELICIKO.Testimonial,
				'delicios-slider.default': DELICIKO.Main_Slider,
				'delicios-chef-slider.default': DELICIKO.Deliciko_chef_slider,
				'delicios-food-menu.default': DELICIKO.Food_Tab_slider,
				'deliciko-vertical-grid-slider.default': DELICIKO.vertical_grid_slider,
				'deliciko-vertical-feature-slider.default': DELICIKO.vertical_feature_slider,
            
            };
            $.each(widgets, function (widget, callback) {
                elementor.hooks.addAction('frontend/element_ready/' + widget, callback);
            });
           
		},
	   /*==========================================================
        Testimonial slider Classic
      ============================================================*/
		Testimonial: function ($scope) {
         var $container = $scope.find('.testimonial-carousel');
         if ($container.length > 0) {
         var controls = null;
         var nav = true;
         var dot = true;
         var auto_play = true;
         var auto_loop = true;

         controls = JSON.parse($container.attr('data-controls'));
         nav       = Boolean(controls.nav=='yes'?true:false);
         dot       = Boolean(controls.dot=='yes'?true:false);
         auto_play = Boolean(controls.auto_play=='yes'?true:false);
         auto_loop = Boolean(controls.auto_loop=='yes'?true:false);

         $container.owlCarousel({

            loop: auto_loop,
            autoplay: auto_play,
            autoplayHoverPause: true,
            nav: nav,
            dots: dot,
            mouseDrag: true,
            touchDrag: true,
            smartSpeed: 1100,
            navText: ['<i class="icon icon-chevron-left">', '<i class="icon icon-chevron-right">'],
            items: 1,
            responsive: {
               0: {
                  nav: false,
               },
               600: {
                  nav: nav,
               },
               1000: {
                  nav: nav,
               }
            }
         });
        
      }																						
		
      },
      // team / chef
	   Deliciko_chef_slider:function ($scope){
         var $container = $scope.find('.chef-slider');
         var controls= JSON.parse($container.attr('data-controls'));
              
         var navShow = Boolean(controls.show_nav?true:false);
         var autoslide = Boolean(controls.auto_nav_slide?true:false);
         var dot_nav = Boolean(controls.dot_nav_show?true:false);
         var item_count = parseInt( controls.item_count );
     
         if ($container.length > 0) {
            $container.owlCarousel({
               items: item_count,
               loop: true,
               autoplay: autoslide,
               nav: navShow,
               dots: dot_nav,
               autoplayTimeout: 8000,
               autoplayHoverPause: true,
               mouseDrag: true,
               smartSpeed: 1100,
               margin:30,
               navText: ['<i class="icon icon-left-arrow2">', '<i class="icon icon-right-arrow2">'],
               responsive: {
                  0: {
                     items: 1,
                  },
                  600: {
                     items: 2,
                  },
                  1000: {
                     items: item_count,
                  }
               }
         
            });
         }
      },
		// Main Slider
		Main_Slider: function ($scope) {
         
         var $container = $scope.find('.hero-area');

         var controls= JSON.parse($container.attr('data-controls'));
              
         var navShow = Boolean(controls.show_nav?true:false);
         var autoslide = Boolean(controls.auto_nav_slide?true:false);
         var dot_nav = Boolean(controls.dot_nav_show?true:false);
          console.log("main");
         if ($container.length > 0) {
            $container.owlCarousel({
               items: 1,
               loop: true,
               autoplay: autoslide,
               nav: navShow,
               dots: dot_nav,
               autoplayTimeout: 8000,
               autoplayHoverPause: false,
               mouseDrag: false,
               smartSpeed: 1100,
               navText: ['<i class="icon icon-chevron-left">', '<i class="icon icon-chevron-right">'],
               responsive: {
                  0: {
                     items: 1,
                     nav: false,
                     mouseDrag: false,

                  },
                  600: {
                     items: 1,
                     nav: false,
                     mouseDrag: true,

                  },
                  1000: {
                     nav: navShow,
                     mouseDrag: true,

                  }
               }
         
            });
         }
		
		},
		// Main Slider
		Food_Tab_slider: function ($scope) {
         
         var $container = $scope.find('.feature-tab-slider');
        
         if ($container.length > 0) {
            $container.owlCarousel({
               items: 3,
               loop: true,
               autoplay: false,
               nav: true,
               dots: false,
               autoplayTimeout: 8000,
               autoplayHoverPause: true,
               mouseDrag: true,
               smartSpeed: 1100,
               margin: 30,
               navText: ['<i class="icon icon-chevron-left">', '<i class="icon icon-chevron-right">'],
               responsive: {
                  0: {
                     items: 1,
                     nav: false,
                     mouseDrag: false,

                  },
                  600: {
                     items: 2,
                     nav: false,
                  },
                  1000: {
                     items: 3,
                  }
               }
         
            });
         }
         // owl trigger
         $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            e.target // newly activated tab
            e.relatedTarget // previous active tab
            $(".owl-carousel").trigger('refresh.owl.carousel');
          });
		
      },
      
      // vertical grid slider
      vertical_grid_slider:function ($scope){
         var $container = $scope.find('.vertical-grid-slider');
        
         if ($container.length > 0) {
            var controls= JSON.parse($container.attr('data-controls'));
              
            var navShow = Boolean(controls.show_nav?true:false);
            var autoslide = Boolean(controls.auto_nav_slide?true:false);
            var item_count = parseInt( controls.item_count );
            var slider_margin = parseInt( controls.slider_margin );

            $container.owlCarousel({
               items: item_count,
               loop: true,
               autoplay: autoslide,
               nav: navShow,
               dots: false,
               autoplayTimeout: 8000,
               autoplayHoverPause: true,
               mouseDrag: true,
               smartSpeed: 1100,
               margin:slider_margin,
               navText: ['<i class="icon icon-chevron-left">', '<i class="icon icon-chevron-right">'],
               responsive: {
                  0: {
                     items: 1,
                  },
                  600: {
                     items: 2,
                  },
                  1000: {
                     items: item_count,
                  }
               }
         
            });
         }
      
      },

      // vertical feature slider
      vertical_feature_slider:function ($scope){
         var $container = $scope.find('.verticale-feature-post');
        
         if ($container.length > 0) {
            var controls= JSON.parse($container.attr('data-controls'));
              
            var navShow = Boolean(controls.show_nav?true:false);
            var autoslide = Boolean(controls.auto_nav_slide?true:false);

            $container.owlCarousel({
               items: 1,
               loop: false,
               autoplay: autoslide,
               nav: navShow,
               dots: false,
               autoplayTimeout: 8000,
               autoplayHoverPause: true,
               mouseDrag: true,
               smartSpeed: 1100,
               navText: ['<i class="icon icon-chevron-left">', '<i class="icon icon-chevron-right">'],
         
            });
         }
      
      },

    };
    $(window).on('elementor/frontend/init', DELICIKO.init);
}(jQuery, window.elementorFrontend) ); 

