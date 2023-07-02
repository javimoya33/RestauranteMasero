<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * metabox options for pages
 */

$options = array(
	'settings-page' => array(
		'title'		 => esc_html__( 'Chef settings', 'deliciko' ),
		'type'		 => 'box',
		'priority'	 => 'high',
		'options'	 => array(
			  'member_designation' => array(
            'type'  => 'text',
            'value' => '',
            'label' => esc_html__('Designation', 'deliciko'),
        
           ),
           'member_social' => array(
            'type' => 'addable-popup',
            'label' => esc_html__('Social', 'deliciko'),
            'template' => '{{- social_title }}',
            'size' => 'small', 
            'limit' => 0, 
            'add-button-text' => esc_html__('Add', 'deliciko'),
            'sortable' => true,
            'popup-options' => array(
                'social_title' => array(
                    'label' => esc_html__('Title', 'deliciko'),
                    'type' => 'text',
                    ),
                    'social_url' => array(
                     'label' => esc_html__('Link', 'deliciko'),
                     'value' =>  esc_html__('#','deliciko'),
                     'type' => 'text',
                    ),
                     'social_icon'	 => array(
                        'type'  => 'new-icon',
                        'label' => esc_html__('Social Icon', 'deliciko'),
                    
                     ),
               ),
              
            ),
                
         ),
      )
  
);