<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: banner
 */

 
$options = [
    'banner_setting' => [
        'title' => esc_html__('Banner Settings', 'deliciko'),

        'options' => [
            'page_banner_setting' => [
                'type'        => 'popup',
                'label'       => esc_html__('Page Banner settings', 'deliciko'),
                'popup-title' => esc_html__('Page banner settings', 'deliciko'),
                'button'      => esc_html__('Edit page Banner Button', 'deliciko'),
                'size'        => 'medium', // small, medium, large
                'popup-options' => [
                    'page_show_banner' => [
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show banner?', 'deliciko' ),
                        'desc'          => esc_html__('Show or hide the banner', 'deliciko'),
                        'value'         => 'yes',
                        'left-choice'	 => [
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ],
                        'right-choice'	 => [
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ],
                    ],
                    'page_show_breadcrumb' => [
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show Breadcrumb?', 'deliciko' ),
                        'desc'          => esc_html__('Show or hide the Breadcrumb', 'deliciko'),
                        'value'         => 'yes',
                        'left-choice'	 => [
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ],
                        'right-choice'	 => [
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ],
                    ],
                    'banner_page_title'	 => [
                        'type'	 => 'text',
                        'label'	 => esc_html__( 'Banner title', 'deliciko' ),
                        'value'  => esc_html__( '', 'deliciko' ),
                    ],

                    'banner_page_image'	 =>array(
                        'label'			 => esc_html__( 'Banner image', 'deliciko' ),
                        'type'			 => 'upload',
                        'images_only'	 => true,
                        'files_ext'		 => array( 'jpg', 'png', 'jpeg', 'gif', 'svg' ),
                              
                        )

                ],
            ], 
        
            'blog_banner_setting' => [
                'type'         => 'popup',
                'label'        => esc_html__('Blog Banner settings', 'deliciko'),
                'popup-title'  => esc_html__('Blog banner settings', 'deliciko'),
                'button'       => esc_html__('Edit Blog Banner Button', 'deliciko'),
                'size'         => 'medium', // small, medium, large
                'popup-options' => [
                    'blog_show_banner' => [
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show banner?', 'deliciko' ),
                        'desc'          => esc_html__('Show or hide the banner', 'deliciko'),
                        'value'         => 'yes',
                        'left-choice'	 => [
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ],
                        'right-choice'	 => [
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ],
                    ],
                    'blog_show_breadcrumb' => [
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show Breadcrumb?', 'deliciko' ),
                        'desc'          => esc_html__('Show or hide the Breadcrumb', 'deliciko'),
                        'value'         => 'yes',
                        'left-choice'	 => [
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ],
                        'right-choice'	 => [
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ],
                    ],
                    'banner_blog_title'	 => [
                        'type'	 => 'text',
                        'label'	 => esc_html__( 'Banner title', 'deliciko' ),
                    ],
                   
                    'banner_blog_image'	 =>array(
                        'type'  => 'upload',
                        'label' => esc_html__('Image', 'deliciko'),
                        'desc'  => esc_html__('Banner blog image', 'deliciko'),
                        'images_only' => true,
                        'files_ext' => array( 'PNG', 'JPEG', 'JPG','GIF'),
                              
                     
                    )

                ],
            ],
            'shop_banner_settings' => [
                'type' => 'popup',
                'label' => esc_html__('Shop banner settings', 'deliciko'),
                'popup-title' => esc_html__('Shop banner settings', 'deliciko'),
                'button' => esc_html__('Edit shop banner settings', 'deliciko'),
                'size' => 'small', // small, medium, large
                'popup-options' => array(
                    'show' => array(
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show banner?', 'deliciko' ),
                        'value' => 'yes',
                        'left-choice'	 => array(
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ),
                        'right-choice'	 => array(
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ),
                    ),
                    'show_breadcrumb' => array(
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show breadcrumb?', 'deliciko' ),
                        'value' => 'yes',
                        'left-choice'	 => array(
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ),
                        'right-choice'	 => array(
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ),
                    ),
                    'title'		 => array(
                        'label'	 => esc_html__( 'Shop Banner title', 'deliciko' ),
                        'type'	 => 'text',
                    ),
                    'single_title'		 => array(
                        'label'	 => esc_html__( 'Single Shop Banner title', 'deliciko' ),
                        'type'	 => 'text',
                    ),
                    'image'			 => array(
                        'label'			 => esc_html__( 'Banner image', 'deliciko' ),
                        'type'			 => 'upload',
                        'images_only'	 => true,
                        'files_ext'		 => array( 'jpg', 'png', 'jpeg', 'gif', 'svg' ),
                    ),
                ),
             ],
            'banner_style_settings' => [
                'type'         => 'popup',
                'label'        => esc_html__('Banner Title Style', 'deliciko'),
                'popup-title'  => esc_html__('banner settings', 'deliciko'),
                'button'       => esc_html__('Edit Banner Button', 'deliciko'),
                'size'         => 'medium', // small, medium, large
                'popup-options' => [
                     
                  'banner_overlay_color' => [
                    'label'	        => esc_html__( 'Banner Overlay color', 'deliciko' ),
                    'desc'	        => esc_html__( 'banner overlay  color.', 'deliciko' ),
                    'type'	        => 'rgba-color-picker',
                    ],

                    'banner_heading_font'	 => [
                        'type'		 => 'typography-v2',
                        'value'		 => [
                            'family'		 => 'ZCOOL XiaoWei',
                            'size'  => '',
                            'font-weight' => '400',
                        ],
                        'components' => [
                            'family'         => true,
                            'size'           => true,
                            'line-height'    => false,
                            'letter-spacing' => false,
                            'color'          => false,
                            'font-weight'    => true,
                        ],
                        'label'		 => esc_html__( 'Banner Heading', 'deliciko' ),
                        'desc'		    => esc_html__( 'This is for heading google fonts', 'deliciko' ),
                    ],

                  'banner_title_color' => [
                    'label'	        => esc_html__( 'Title color', 'deliciko' ),
                    'desc'	        => esc_html__( 'title color.', 'deliciko' ),
                    'type'	        => 'color-picker',
                    ],
                  'banner_heighlihgt_title_color' => [
                    'label'	        => esc_html__( 'Heiglight Title color', 'deliciko' ),
                    'desc'	        => esc_html__( ' Heiglight title color.', 'deliciko' ),
                    'type'	        => 'color-picker',
                    ],
                
              
                ],
            ],
      

        ],
    ],
];