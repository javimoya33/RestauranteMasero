<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * enqueue all theme scripts and styles
 */


// stylesheets
// ----------------------------------------------------------------------------------------
if ( !is_admin() ) {
	// wp_enqueue_style() $handle, $src, $deps, $version

	// 3rd party css
	wp_enqueue_style( 'deliciko-fonts', deliciko_google_fonts_url(['Cookie:300,300i,400,400i,500,600,700', 'Open Sans:400,500,700', 'ZCOOL XiaoWei: 400']), null, DELICIKO_VERSION );
	if( is_rtl() ){
		wp_enqueue_style( 'bootstrap-rtl', DELICIKO_CSS . '/bootstrap.min-rtl.css', null, DELICIKO_VERSION );
	}else{
		wp_enqueue_style( 'bootstrap', DELICIKO_CSS . '/bootstrap.min.css', null, DELICIKO_VERSION );

	}
	wp_enqueue_style( 'font-awesome', DELICIKO_CSS . '/font-awesome.css', null, DELICIKO_VERSION );
	wp_enqueue_style( 'iconfont', DELICIKO_CSS . '/iconfont.css', null, DELICIKO_VERSION );
	wp_enqueue_style( 'magnific-popup', DELICIKO_CSS . '/magnific-popup.css', null, DELICIKO_VERSION );
	wp_enqueue_style( 'owl-carousel', DELICIKO_CSS . '/owl.carousel.min.css', null, DELICIKO_VERSION );
	wp_enqueue_style( 'deliciko-woocommerce', DELICIKO_CSS . '/woocommerce.css', null, DELICIKO_VERSION );
  // gutenberg css
	wp_enqueue_style( 'deliciko-gutenberg-custom', DELICIKO_CSS . '/gutenberg-custom.css', null, DELICIKO_VERSION );
	// theme css
	wp_enqueue_style( 'deliciko-style', DELICIKO_CSS . '/master.css', null, DELICIKO_VERSION );
	if ( is_rtl() ) {
		wp_enqueue_style( 'deliciko-rtl', DELICIKO_THEME_URI . '/rtl.css', null, DELICIKO_VERSION );
	}
}

// javascripts
// ----------------------------------------------------------------------------------------
if ( !is_admin() ) {

	// 3rd party scripts
	if ( is_rtl() ) {
		wp_enqueue_script( 'bootstrap-rtl', DELICIKO_JS . '/bootstrap.min-rtl.js', array( 'jquery' ), DELICIKO_VERSION, true );
	}else{
		wp_enqueue_script( 'bootstrap', DELICIKO_JS . '/bootstrap.min.js', array( 'jquery' ), DELICIKO_VERSION, true );
	}

	wp_enqueue_script( 'popper', DELICIKO_JS . '/popper.min.js', array( 'jquery' ), DELICIKO_VERSION, true );
	wp_enqueue_script( 'magnific-popup', DELICIKO_JS . '/jquery.magnific-popup.min.js', array( 'jquery' ), DELICIKO_VERSION, true );
	wp_enqueue_script( 'instafeed-js', DELICIKO_JS . '/instafeed.min.js', array( 'jquery' ), DELICIKO_VERSION, true );

	wp_enqueue_script( 'owl-carousel', DELICIKO_JS . '/owl.carousel.min.js', array( 'jquery' ), DELICIKO_VERSION, true );
	wp_enqueue_script( 'jquery-easypiechart', DELICIKO_JS . '/jquery.easypiechart.min.js', array( 'jquery' ), DELICIKO_VERSION, true );

	// theme scripts
	wp_enqueue_script( 'deliciko-script', DELICIKO_JS . '/script.js', array( 'jquery' ), DELICIKO_VERSION, true );
	
	// Load WordPress Comment js
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}


