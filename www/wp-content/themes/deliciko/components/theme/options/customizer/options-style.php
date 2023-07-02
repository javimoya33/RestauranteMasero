<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: general
 */
$options =[
    'style_settings' => [
            'title'		 => esc_html__( 'Style settings', 'deliciko' ),
            'options'	 => [
                'style_body_bg' => [
                    'label'	        => esc_html__( 'Body background', 'deliciko' ),
                    'desc'	           => esc_html__( 'Site\'s main background color.', 'deliciko' ),
                    'type'	           => 'color-picker',
                 ],

                'style_primary' => [
                    'label'	        => esc_html__( 'Primary color', 'deliciko' ),
                    'desc'	           => esc_html__( 'Site\'s main color.', 'deliciko' ),
                    'type'	           => 'color-picker',
                ],
                
                'title_color' => [
                'label'	        => esc_html__( 'Title color', 'deliciko' ),
                'desc'	        => esc_html__( 'title color.', 'deliciko' ),
                'type'	        => 'color-picker',
                ],
           
                'body_font'    => array(
                    'type' => 'typography-v2',
                    'label' => esc_html__('Body Font', 'deliciko'),
                    'desc'  => esc_html__('Choose the typography for the title', 'deliciko'),
                    'value' => array(
                        'family' => 'Open Sans',
                        'size'  => '16',
                        'font-weight' => '400',
                    ),
                    'components' => array(
                        'family'         => true,
                        'size'           => true,
                        'line-height'    => false,
                        'letter-spacing' => false,
                        'color'          => false,
                    
                    ),
                ),
                
                'heading_font_one'	 => [
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
                    'label'		 => esc_html__( 'Heading H1 and H2 Fonts', 'deliciko' ),
                    'desc'		    => esc_html__( 'This is for heading google fonts', 'deliciko' ),
                ],

                'heading_font_two'	 => [
                    'type'		    => 'typography-v2',
                    'value'		 => [
                        'family'		  => 'ZCOOL XiaoWei',
                        'size'        => '',
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
                    'label'		 => esc_html__( 'Heading H3 Fonts', 'deliciko' ),
                    'desc'		    => esc_html__( 'This is for heading google fonts', 'deliciko' ),
                ],

                'heading_font_three'	 => [
                    'type'		    => 'typography-v2',
                    'value'		 => [
                        'family'		  => 'ZCOOL XiaoWei',
                        'size'        => '',
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
                    'label'		 => esc_html__( 'Heading H4 Fonts', 'deliciko' ),
                    'desc'		    => esc_html__( 'This is for heading google fonts', 'deliciko' ),
                ],

            
            
            ],
        ],
    ];