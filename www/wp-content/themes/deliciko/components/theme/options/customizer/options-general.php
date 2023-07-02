<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: general
 */

$options =[
    'general_settings' => [
            'title'		 => esc_html__( 'General settings', 'deliciko' ),
            'options'	 => [
                'preloader_show' => [
                    'type'			 => 'switch',
                    'label'		    => esc_html__( 'Preloader show', 'deliciko' ),
                    'desc'			 => esc_html__( 'Do you want to show preloader on your site ?', 'deliciko' ),
                    'value'         => 'no',
                    'left-choice'	 => [
                       'value'     => 'yes',
                       'label'	   => esc_html__( 'Yes', 'deliciko' ),
                    ],
                    'right-choice'	 => [
                       'value'	 => 'no',
                       'label'	 => esc_html__( 'No', 'deliciko' ),
                    ],
                  ],
                  'preloader_logo' => [
                    'label'	        => esc_html__( 'Preloader logo', 'deliciko' ),
                    'desc'	           => esc_html__( 'When you enable preloader then you can set preloader image otherwise default color preloader you will see', 'deliciko' ),
                    'type'	           => 'upload',
                    'image_only'      => true,
                 ],
              
                 
                'general_main_logo' => [
                    'label'	        => esc_html__( 'Main logo', 'deliciko' ),
                    'desc'	           => esc_html__( 'It\'s the main logo, mostly it will be shown on "dark or coloreful" type area.', 'deliciko' ),
                    'type'	           => 'upload',
                    'image_only'      => true,
                 ],
                'general_dark_logo' => [
                    'label'	        => esc_html__( 'Dark logo', 'deliciko' ),
                    'desc'	           => esc_html__( 'It will be shown on any "light background" type area.', 'deliciko' ),
                    'type'	           => 'upload',
                    'image_only'      => true,
                 ],
                 'general_sticky_sidebar' => [
                    'type'			    => 'switch',
                    'label'			 => esc_html__( 'Sticky sidebar', 'deliciko' ),
                    'desc'			    => esc_html__( 'Use sticky sidebar?', 'deliciko' ),
                    'value'          => 'yes',
                    'left-choice' => [
                        'value'	 => 'yes',
                        'label'	 => esc_html__( 'Yes', 'deliciko' ),
                    ],
                    'right-choice' => [
                        'value'	 => 'no',
                        'label'	 => esc_html__( 'No', 'deliciko' ),
                    ],
               ],
               'blog_breadcrumb_show' => [
                    'type'			    => 'switch',
                    'label'			 => esc_html__( 'Breadcrumb', 'deliciko' ),
                    'desc'			    => esc_html__( 'Do you want to show breadcrumb?', 'deliciko' ),
                    'value'          => 'yes',
                    'left-choice'	 => [
                        'value'	 => 'yes',
                        'label'	 => esc_html__('Yes', 'deliciko'),
                    ],
                    'right-choice'	 => [
                        'value'	 => 'no',
                        'label'	 => esc_html__('No', 'deliciko'),
                    ],
                ],
                'blog_breadcrumb_length' => [
                    'type'			    => 'text',
                    'label'			 => esc_html__( 'Breadcrumb word length', 'deliciko' ),
                    'desc'			    => esc_html__( 'The length of the breadcumb text.', 'deliciko' ),
                    'value'          => '3',
                ],
                'general_social_links' => [
                    'type'          => 'addable-popup',
                    'template'      => '{{- title }}',
                    'popup-title'   => null,
                    'label' => esc_html__( 'Social links', 'deliciko' ),
                    'desc'  => esc_html__( 'Add social links and it\'s icon class bellow. These are all fontaweseome-4.7 icons.', 'deliciko' ),
                    'add-button-text' => esc_html__( 'Add new', 'deliciko' ),
                    'popup-options' => [
                        'title' => [ 
                            'type' => 'text',
                            'label'=> esc_html__( 'Title', 'deliciko' ),
                        ],
                        'icon_class' => [ 
                            'type' => 'new-icon',
                            'label'=> esc_html__( 'Social icon', 'deliciko' ),
                        ],
                        'url' => [ 
                            'type' => 'text',
                            'label'=> esc_html__( 'Social link', 'deliciko' ),
                        ],
                    ],
                   
                ],
            ],
        ],
    ];
