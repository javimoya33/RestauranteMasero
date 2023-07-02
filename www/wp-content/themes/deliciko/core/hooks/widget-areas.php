<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * register widget area
 */

      function deliciko_widget_init()
      {
         if (function_exists('register_sidebar')) {
            register_sidebar(
                  array(
                     'name' => esc_html__('Blog widget area', 'deliciko'),
                     'id' => 'sidebar-1',
                     'description' => esc_html__('Appears on posts.', 'deliciko'),
                     'before_widget' => '<div id="%1$s" class="widget %2$s">',
                     'after_widget' => '</div>',
                     'before_title' => '<h4 class="widget-title">',
                     'after_title' => '</h4>',
                  )
            );
         }
      }

     add_action('widgets_init', 'deliciko_widget_init');

   if(defined( 'FW' )):
      function footer_left_widgets_init(){
            if ( function_exists('register_sidebar') )
            register_sidebar(array(
            'name' => esc_html__('Footer Left','deliciko'),
            'id' => 'footer-left',
            'before_widget' => '<div class="footer-left-widget">',
            'after_widget' => '</div>',
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>',
            )
         );
         }
         add_action( 'widgets_init', 'footer_left_widgets_init' );

         function footer_center_widgets_init(){
         if ( function_exists('register_sidebar') )
         register_sidebar(array(
            'name' => esc_html__('Footer Center','deliciko'),
            'id' => 'footer-center',
            'before_widget' => '<div class="footer-widget footer-center-widget">',
            'after_widget' => '</div>',
            'before_title' => '<h3 class="widget-title">',
            'after_title' => '</h3>',
         )
         );
         }
         add_action( 'widgets_init', 'footer_center_widgets_init' );

         
   endif;
      
   if (function_exists('register_sidebar')) {
      register_sidebar(
        [
           'name'			 => esc_html__( 'Woocommerce sidebar Area', 'deliciko' ),
           'id'			 => 'sidebar-woo',
           'description'	 => esc_html__( 'Appears on posts and pages.', 'deliciko' ),
           'before_widget'	 => '<div id="%1$s" class="widgets %2$s">',
           'after_widget'	 => '</div> <!-- end widget -->',
           'before_title'	 => '<h4 class="widget-title">',
           'after_title'	 => '</h4>',
          ] 
      );
  }