<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * register required plugins
 */

function deliciko_register_required_plugins() {
	$plugins	 = array(
		array(
			'name'		 => esc_html__( 'Unyson', 'deliciko' ),
			'slug'		 => 'unyson',
			'required'	 => true,
			'source'	 =>  'https://demo.themewinter.com/wp/plugins/online/unyson.zip', // The plugin source.
		), 
 
		array(
			'name'		 => esc_html__( 'Elementor', 'deliciko' ),
			'slug'		 => 'elementor',
			'required'	 => true,
	  ),
	  array(
		'name'		 => esc_html__( 'WPCafe', 'deliciko' ),
		'slug'		 => 'wp-cafe',
		'required'	 => true,
  	),
      array(
			'name'		 => esc_html__( 'Mailchimp ', 'deliciko' ),
			'slug'		 => 'mailchimp-for-wp',
			'required'	 => true,
		),
      array(
			'name'		 => esc_html__( 'Contact Form 7 ', 'deliciko' ),
			'slug'		 => 'contact-form-7',
			'required'	 => true,
		),
		array(
			'name'		 => esc_html__( 'Deliciko Essentials', 'deliciko' ),
			'slug'		 => 'deliciko-essential',
			'required'	 => true,
			'version'    => '1.3',
			'source'     => 'https://demo.themewinter.com/wp/plugins/deliciko/deliciko-essential.zip', // The plugin source.
		),	
		array(
			'name'		 => esc_html__( 'WP Ultimate Review', 'deliciko' ),
			'slug'		 => 'wp-ultimate-review',
			'required'	 => true,
		),	
	);


	$config = array(
		'id'			 => 'deliciko', // Unique ID for hashing notices for multiple instances of TGMPA.
		'default_path'	 => '', // Default absolute path to bundled plugins.
		'menu'			 => 'deliciko-install-plugins', // Menu slug.
		'parent_slug'	 => 'themes.php', // Parent menu slug.
		'capability'	 => 'edit_theme_options', // Capability needed to view plugin install page, should be a capability associated with the parent menu used.
		'has_notices'	 => true, // Show admin notices or not.
		'dismissable'	 => true, // If false, a user cannot dismiss the nag message.
		'dismiss_msg'	 => '', // If 'dismissable' is false, this message will be output at top of nag.
		'is_automatic'	 => true, // Automatically activate plugins after installation or not.
		'message'		 => '', // Message to output right before the plugins table.
	);

	tgmpa( $plugins, $config );
}

add_action( 'tgmpa_register', 'deliciko_register_required_plugins' );