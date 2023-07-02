<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * options for wp customizer
 * section name format: deliciko_section_{section name}
 */
$options = [
	'deliciko_section_theme_settings' => [
		'title'				 => esc_html__( 'Theme settings', 'deliciko' ),
		'options'			 => Deliciko_Theme_Includes::_customizer_options(),
		'wp-customizer-args' => [
			'priority' => 3,
		],
	],
];
