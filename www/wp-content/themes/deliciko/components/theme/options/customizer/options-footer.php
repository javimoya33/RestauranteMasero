<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: general
 */

$options =[
    'footer_settings' => [
        'title'		 => esc_html__( 'Footer settings', 'deliciko' ),

        'options'	 => [

            'footer_style' => array(
                'type'         => 'multi-picker',
                'label'        => false,
                'desc'         => false,
                'picker'       => array(
                    'style' => array(
                        'label'   => esc_html__( 'Select Style', 'deliciko' ),
                        'type'    => 'image-picker',
                        'choices'	 => [
                            'style-1' => [
                                'small'	 => [
                                    'height' => 30,
                                    'src'	 => DELICIKO_IMG. '/admin/footer/style1.png'
                                ],
                                'large'	 => [
                                    'width'	 => 370,
                                    'src'	 => DELICIKO_IMG. '/admin/footer/style1.png'
                                ],
                            ],
                            'style-2' => [
                                'small'	 => [
                                    'height' => 30,
                                    'src'	 => DELICIKO_IMG. '/admin/footer/style2.png'
                                ],
                                'large'	 => [
                                    'width'	 => 370,
                                    'src'	 => DELICIKO_IMG. '/admin/footer/style2.png'
                                ],
                            ],
                         
                        ],
                      
                    )
                ),
               
                'show_borders' => false,
            ), 
           
            'footer_mailchimp' => [
               'label'	 => esc_html__( 'Mailchimp Shortcode', 'deliciko'),
               'type'	 => 'text',
               
           ],

            'footer_bg_color' => [
                'label'	 => esc_html__( 'Footer Background color', 'deliciko'),
                'type'	 => 'color-picker',
                'desc'	 => esc_html__( 'You can change the footer\'s background color with rgba color or solid color', 'deliciko'),
            ],
            'footer_copyright_color' => [
                'label'	 => esc_html__( 'Footer Copyright color', 'deliciko'),
                'type'	 => 'color-picker',
                'desc'	 => esc_html__( 'You can change the footer\'s background color with rgba color or solid color', 'deliciko'),
            ],
            'footer_social_links' => [
                'type'  => 'addable-popup',
                'template' => '{{- title }}',
                'popup-title' => null,
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
                'value' => [
                   
                ],
            ],
           
            'footer_mailchimp' => [
               'label'	 => esc_html__( 'MailChimp Shortcode', 'deliciko'),
               'type'	 => 'text',
               
            ],
            'footer_copyright'	 => [
                'type'	 => 'textarea',
                'value'  => '&copy; '. date('Y') . ', deliciko. All rights reserved',
                'label'	 => esc_html__( 'Copyright text', 'deliciko' ),
                'desc'	 => esc_html__( 'This text will be shown at the footer of all pages.', 'deliciko' ),
            ],

            'footer_padding_top' => [
                'label'	        => esc_html__( 'Footer Padding Top', 'deliciko' ),
                'desc'	        => esc_html__( 'Use Footer Padding Top', 'deliciko' ),
                'type'	        => 'text',
                'value'         => '50px',
             ],
             'footer_padding_bottom' => [
               'label'	        => esc_html__( 'Footer Padding Bottom', 'deliciko' ),
               'desc'	        => esc_html__( 'Use Footer Padding Bottom', 'deliciko' ),
               'type'	        => 'text',
               'value'         => '0px',
            ],
             'back_to_top'				 => [
                'type'			 => 'switch',
                'value'			 => '',
                'label'			 => esc_html__( 'Back to top', 'deliciko'),
                'left-choice'	 => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko'),
                ],
                'right-choice'	 => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko'),
                ],
            ],
            
        ],
            
        ]
    ];