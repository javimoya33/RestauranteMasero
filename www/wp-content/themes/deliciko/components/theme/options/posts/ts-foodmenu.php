<?php if ( !defined( 'FW' ) ) {	die( 'Forbidden' ); }

$options = array(
     
      'menu_nav_icon' => array(
         'type'  => 'new-icon',
         'value' => '',
         'label' => esc_html__('Menu Icon', 'deliciko'),
      
      ),

      'food_menu_image' =>  array(
         'type'  => 'upload',
         'value' => array(
         
         ),
         'label' => esc_html__('Food Category Image', 'deliciko'),
         'images_only' => true,
      
      ),
     
    'delicios_food_pop_up' =>array(
        'type' => 'addable-popup',
        'value' => array(
            array(
                'item_title' => '',
               
            ),
        ),
        'label' => esc_html__('All food', 'deliciko'),
        'desc'  => esc_html__('Add your food item', 'deliciko'),
        'template' => '{{- item_title }}',
        'popup-title' => 'Food ',
        'size' => 'small', // small, medium, large
        'limit' => 0, // limit the number of popup`s that can be added
        'add-button-text' => esc_html__('Add', 'deliciko'),
        'sortable' => true,
        'popup-options' => array(
         
            'item_image' =>  array(
               'type'  => 'upload',
               'value' => array(
               
               ),
               'label' => esc_html__('Image', 'deliciko'),
               'images_only' => true,
             ), 
            'item_title' => array(
                'type'  => 'text',
                'value' => '',
                'label' => esc_html__('Item Title', 'deliciko'),
              
            ),
            'item_price' => array(
                'type'  => 'text',
                'value' => '',
                'label' => esc_html__('Item price', 'deliciko'),
              
            ),
            'item_ingredient' => array(
               'type'  => 'textarea',
               'value' => '',
               'label' => esc_html__('Item ingredient', 'deliciko'),
             
            ),
            'item_order_label' => array(
               'type'  => 'text',
               'value' => '',
               'label' => esc_html__('Order label', 'deliciko'),
             
            ),
            'item_order' => array(
               'type'  => 'text',
               'value' => '',
               'label' => esc_html__('Order url', 'deliciko'),
            ),
            
            'item_status' => array(
               'type'  => 'text',
               'value' => '',
               'label' => esc_html__('Item Status', 'deliciko'),
             
           ),
        ),
    )

);
