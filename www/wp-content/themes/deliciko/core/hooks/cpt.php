<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * hooks for wp blog part
 */

// if there is no excerpt, sets a defult placeholder
// ----------------------------------------------------------------------------------------

if ( class_exists( 'DelicikoCustomPost\Deliciko_CustomPost' ) ) {

    //food menu 
	$foodmenu = new DelicikoCustomPost\Deliciko_CustomPost( 'deliciko' );
	$foodmenu->xs_init( 'ts-foodmenu', 'Food menu', 'Food menu', array( 'menu_icon' => 'dashicons-calendar-alt',
		'supports'	 => array( 'title'),
		'rewrite'	 => array( 'slug' => 'foodmenu' ) ) );
	
   //chaf
   $chaf = new DelicikoCustomPost\Deliciko_CustomPost( 'deliciko' );
  	$chaf->xs_init( 'ts-chef', 'Chef', 'Chefs', array( 'menu_icon' => 'dashicons-admin-users',
		'supports'	 => array( 'title','thumbnail'),
		'rewrite'	 => array( 'slug' => 'chef' ),
		'exclude_from_search' => true,
    )
  );

}