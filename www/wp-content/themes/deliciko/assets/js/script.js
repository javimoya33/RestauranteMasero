jQuery( document ).ready( function($){
   "use strict";



/**-------------------------------------------------
 *Fixed Header
*----------------------------------------------------**/
 $(window).on('scroll', function () {

      /**Fixed header**/
      if ($(window).scrollTop() > 250) {
      $('.navbar-sticky').addClass('sticky fade_down_effect');
      } else {
      $('.navbar-sticky').removeClass('sticky fade_down_effect');
      }
 });



 /* ----------------------------------------------------------- */
  /*  Mobile Menu
  /* ----------------------------------------------------------- */
  $('.dropdown > a').on('click', function(e) {
   e.preventDefault();
   if($(window).width() > 991)
   {
      location.href = this.href; 
   } 
   var dropdown = $(this).parent('.dropdown');
   dropdown.find('>.dropdown-menu').slideToggle('show');
   $(this).toggleClass('opened');
   return false;
 });



   /* ----------------------------------------------------------- */
   /*  Back to top
   /* ----------------------------------------------------------- */

   $(window).on('scroll', function () {
    if ($(window).scrollTop() > $(window).height()) {
       $(".BackTo").fadeIn('slow');
    } else {
       $(".BackTo").fadeOut('slow');
    }

    });
    $("body, html").on("click", ".BackTo", function (e) {
        e.preventDefault();
        $('html, body').animate({
          scrollTop: 0
        }, 800);
    });


        /*=============================
           review rating circle
        =============================== */
        $(function() {
         $('.review-chart').easyPieChart({
           scaleColor: "",
           lineWidth: 3,
           lineCap: 'butt',
           barColor: '#bc906b',
           trackColor:	"rgba(0,0,0, .30)",
           size: 35,
           animate: 35
         });
       });

       /*==========================
          Preloader
      ============================ */
      $(window).on('load', function () {
         
         setTimeout(() => {
            $('#preloader').addClass('loaded');
         }, 1000);
         
         });
         
      // preloader close
      $('.preloader-cancel-btn').on('click', function (e) {
         e.preventDefault();
         if (!($('#preloader').hasClass('loaded'))) {
            $('#preloader').addClass('loaded');
         }
      });

      
  /*=========================
      // instagram feed
      ============================ */
      if ($('#instafeed').length > 0) {
            var InstagramToken = $('#instafeed').data('token'), limit = $('#instafeed').data('media-count');
            var feed = new Instafeed({
                  accessToken: InstagramToken,
                  limit: Number(limit),
                  template: '<a href="{{link}}" target="_blank"><img title="{{caption}}" src="{{image}}" /></a>',
                  transform: function(item) {
                  var d = new Date(item.timestamp);
                  item.date = [d.getDate(), d.getMonth(), d.getYear()].join('/');
                  return item;
                  }
            });
         feed.run();
      }


} );