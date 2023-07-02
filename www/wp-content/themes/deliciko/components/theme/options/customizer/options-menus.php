<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * customizer option: menus
 */

$options =[
   'menu_settings' => [
       'title'		 => esc_html__( 'Menu settings', 'deliciko' ),

       'options'	 => [
         'top_menu_color' => [
            'label'	        => esc_html__( 'Top Menu Color', 'deliciko' ),
            'desc'	        => esc_html__( 'This is the site\'s Top menu  color.', 'deliciko' ),
            'type'	        => 'color-picker',

         ], //menu style
         'top_social_color' => [
            'label'	        => esc_html__( 'Top Social Color', 'deliciko' ),
            'desc'	        => esc_html__( 'This is the site\'s Top menu  color.', 'deliciko' ),
            'type'	        => 'color-picker',

         ], //menu style

           'menu_color' => [
               'label'	        => esc_html__( 'Menu Color', 'deliciko' ),
               'desc'	        => esc_html__( 'This is the site\'s main menu  color.', 'deliciko' ),
               'type'	        => 'color-picker',

            ], //menu style
           'menu_hover_color' => [
               'label'	        => esc_html__( 'Menu Hover Color', 'deliciko' ),
               'desc'	        => esc_html__( 'This is the site\'s main menu hover color.', 'deliciko' ),
               'type'	        => 'color-picker',

            ], //menu style

           'dropdown_menu_color' => [
               'label'	        => esc_html__( 'Dropdown Menu Color', 'deliciko' ),
               'desc'	        => esc_html__( 'This is the site\'s main dropdown menu color.', 'deliciko' ),
               'type'	        => 'color-picker',

            ], //menu style
           'dropdown_menu_hover_color' => [
               'label'	        => esc_html__( 'Dropdown Menu Hover Color', 'deliciko' ),
               'desc'	        => esc_html__( 'This is the site\'s main dropdown menu Hover color.', 'deliciko' ),
               'type'	        => 'color-picker',

            ], //menu style

            'menu_font'    => array(
               'type' => 'typography-v2',
               'label' => esc_html__('Menu Font', 'deliciko'),
               'desc'  => esc_html__('Choose the typography for the menu', 'deliciko'),
               'value' => array(
                   'family' => 'Open Sans',
                   'size'  => '14',
               ),
               'components' => array(
                   'family'         => true,
                   'size'           => true,
                   'line-height'    => false,
                   'letter-spacing' => false,
                   'color'          => false,
                   'font-weight'    => true,
               ),
           ),
   
       ], //Options end
   ]
];