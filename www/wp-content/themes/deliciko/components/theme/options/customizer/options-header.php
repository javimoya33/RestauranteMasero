<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: Header
 */

$options =[
    'header_settings' => [
        'title'		 => esc_html__( 'Header settings', 'deliciko' ),

        'options'	 => [

            'header_layout_style' => [
                'label'	        => esc_html__( 'Header style', 'deliciko' ),
                'desc'	        => esc_html__( 'This is the site\'s main header style.', 'deliciko' ),
                'type'	        => 'image-picker',
                'choices'       => [
                    'transparent'    => [
                        'small'     => DELICIKO_IMG . '/admin/header-style/style1.png',
                        'large'     => DELICIKO_IMG . '/admin/header-style/style1.png',
                    ],
                    'standard'    => [
                        'small'     => DELICIKO_IMG . '/admin/header-style/style2.png',
                        'large'     => DELICIKO_IMG . '/admin/header-style/style2.png',
                    ],
                    'transparent2'    => [
                        'small'     => DELICIKO_IMG . '/admin/header-style/style3.png',
                        'large'     => DELICIKO_IMG . '/admin/header-style/style3.png',
                    ],
                    'classic'    => [
                        'small'     => DELICIKO_IMG . '/admin/header-style/style4.png',
                        'large'     => DELICIKO_IMG . '/admin/header-style/style4.png',
                    ],
                ],
                'value'         => 'standard',
             ], //Header style

            //  nav sticky
            'header_nav_sticky' => [
                'type'			 => 'switch',
                'label'			 => esc_html__( 'Show nav sticky?', 'deliciko' ),
                'desc'          => esc_html__('Show or hide the header sticky', 'deliciko'),
                'value'         => 'no',
                'left-choice'	 => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko' ),
                ],
                'right-choice'	 => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko' ),
                ],
            ],
            'shop_btn_show' => [
                'type'			 => 'switch',
                'label'			 => esc_html__( 'Show cart button?', 'deliciko' ),
                'desc'          => esc_html__('Show or hide the header cart button', 'deliciko'),
                'value'         => 'no',
                'left-choice'	 => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko' ),
                ],
                'right-choice'	 => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko' ),
                ],
            ],
            
             'header_table_button_settings' => [
                'type'        => 'popup',
                'label'       => esc_html__('Header table button settings', 'deliciko'),
                'popup-title' => esc_html__('Header table button settings', 'deliciko'),
                'button'      => esc_html__('Edit header table button', 'deliciko'),
                'size'        => 'small', // small, medium, large
                'popup-options' => [
                
                    'header_btn_show' => [
                        'type'			 => 'switch',
                        'label'			 => esc_html__( 'Show button?', 'deliciko' ),
                        'desc'          => esc_html__('Show or hide the header button', 'deliciko'),
                        'value'         => 'no',
                        'left-choice'	 => [
                            'value'	 => 'yes',
                            'label'	 => esc_html__( 'Yes', 'deliciko' ),
                        ],
                        'right-choice'	 => [
                            'value'	 => 'no',
                            'label'	 => esc_html__( 'No', 'deliciko' ),
                        ],
                    ],
                
                    'header_btn_title'	 => [
                        'type'	 => 'text',
                        'label'	 => esc_html__( 'Button title', 'deliciko' ),
                        'value'   => esc_html__( 'Book a table', 'deliciko' ),
                    ],
                    'header_btn_url'	 => [
                        'type'	 => 'text',
                        'label'	 => esc_html__( 'Button Url', 'deliciko' ),
                        'desc'	 => esc_html__( 'Put the url of the button', 'deliciko' ),
                        'value'   => '#',
                    ],

                    'header_button_bg_color' =>[
                        'type' => 'color-picker',
                        'label' => esc_html__('Header Button BG color', 'deliciko'),
                        'desc'  => esc_html__('button bg color set', 'deliciko'),
                        'value' => '#bc906b',
                    ],
                    'header_button_text_color' =>[
                        'type' => 'color-picker',
                        'label' => esc_html__('Header Button text color', 'deliciko'),
                        'desc'  => esc_html__('button text color set', 'deliciko'),
                        'value' => '#fff',

                    ],

                ],
            ],

            'header_top_bar_settings' => [
               'type'        => 'popup',
               'label'       => esc_html__('Header top bar settings', 'deliciko'),
               'popup-title' => esc_html__('Header top bar settings', 'deliciko'),
               'button'      => esc_html__('Edit header topbar button', 'deliciko'),
               'size'        => 'small', // small, medium, large
               'popup-options' => [
                   
                   'header_topbar_show' => [
                       'type'			 => 'switch',
                       'label'			 => esc_html__( 'Show topbar?', 'deliciko' ),
                       'desc'          => esc_html__('Show or hide the header topbar', 'deliciko'),
                       'value'         => 'no',
                       'left-choice'	 => [
                           'value'	 => 'yes',
                           'label'	 => esc_html__( 'Yes', 'deliciko' ),
                       ],
                       'right-choice'	 => [
                           'value'	 => 'no',
                           'label'	 => esc_html__( 'No', 'deliciko' ),
                       ],
                   ],
                   'header_topbar_address'	 => [
                       'type'	 => 'text',
                       'label'	 => esc_html__( 'Address', 'deliciko' ),
                       'value'   => esc_html__( '85 Bay Meadows Drive, GA 30188, United States ', 'deliciko' ),
                       'desc'          => esc_html__('Put the contact address for header style 3', 'deliciko'),

                   ],
                   'header_topbar_contact'	 => [
                       'type'	 => 'text',
                       'label'	 => esc_html__( 'Contact number', 'deliciko' ),
                       'value'   => '+1 212-333-1220',
                       'desc'          => esc_html__('Put the contact number for header style 3', 'deliciko'),

                   ],

               ],
           ],

            'header_contact_show' => [
               'type'			 => 'switch',
               'label'			 => esc_html__( 'Show contact?', 'deliciko' ),
               'desc'          => esc_html__('Show or hide the header contact', 'deliciko'),
               'value'         => 'no',
               'left-choice'	 => [
                   'value'	 => 'yes',
                   'label'	 => esc_html__( 'Yes', 'deliciko' ),
               ],
               'right-choice'	 => [
                   'value'	 => 'no',
                   'label'	 => esc_html__( 'No', 'deliciko' ),
               ],
           ],
           'header_contact_title' => [
            'type'	 => 'text',
            'label'	 => esc_html__( 'Title', 'deliciko' ),
            'value'   => esc_html__( 'Contact us for reservation', 'deliciko' ),
            'desc'          => esc_html__('put contact address for header style 1', 'deliciko'),

           ], 
           'header_contact_number' => [
            'type'	 => 'text',
            'label'	 => esc_html__( 'Number', 'deliciko' ),
            'value'   => esc_html__( '+123-456 7899', 'deliciko' ),
            'desc'          => esc_html__('put contact address for header style 1', 'deliciko'),

           ], 
        ], //Options end
    ]
];