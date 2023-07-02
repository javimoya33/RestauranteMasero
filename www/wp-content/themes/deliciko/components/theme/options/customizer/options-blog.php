<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: blog
 */

$options =[
    'blog_settings' => [
        'title'		 => esc_html__( 'Blog settings', 'deliciko' ),

        'options'	 => [
            'blog_sidebar' =>[
                'type'  => 'select',
                              
                'label' => esc_html__('Sidebar', 'deliciko'),
                'desc'  => esc_html__('Description', 'deliciko'),
                'help'  => esc_html__('Help tip', 'deliciko'),
                'choices' => array(
                    '1' => esc_html__('No sidebar','deliciko'),
                    '2' => esc_html__('Left Sidebar', 'deliciko'),
                    '3' => esc_html__('Right Sidebar', 'deliciko'),
                 
                 ),
              
                'no-validate' => false,
            ],   
            'blog_title' => [
                'label'	 => esc_html__( 'Global blog title', 'deliciko' ),
                'type'	 => 'text',
            ],
            'blog_header_image' => [
                'label'	 => esc_html__( 'Global header background image', 'deliciko' ),
                'type'	 => 'upload',
             ],
            'blog_breadcrumb' => [
                'type'			 => 'switch',
                'label'			 => esc_html__( 'Breadcrumb', 'deliciko' ),
                'desc'			 => esc_html__( 'Do you want to show breadcrumb?', 'deliciko' ),
                'value'          => 'yes',
                'left-choice'	 => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko' ),
                ],
                'right-choice'	 => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko' ),
                ],
            ],
            'blog_author' => [
                'type'			 => 'switch',
                'label'			 => esc_html__( 'Blog author', 'deliciko' ),
                'desc'			 => esc_html__( 'Do you want to show blog author?', 'deliciko' ),
                'value'          => 'no',
                'left-choice' => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko' ),
                ],
                'right-choice' => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko' ),
                ],
           ],
            'blog_social_share' => [
                'type'			 => 'switch',
                'label'			 => esc_html__( 'Social share', 'deliciko' ),
                'desc'			 => esc_html__( 'Do you want to show social share buttons?', 'deliciko' ),
                'value'          => 'no',
                'left-choice' => [
                    'value'	 => 'yes',
                    'label'	 => esc_html__( 'Yes', 'deliciko' ),
                ],
                'right-choice' => [
                    'value'	 => 'no',
                    'label'	 => esc_html__( 'No', 'deliciko' ),
                ],
           ],
        ],
            
        ]
    ];