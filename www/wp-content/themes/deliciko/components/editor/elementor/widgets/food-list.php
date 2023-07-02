<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;


class Deliciko_food_list_Widget extends Widget_Base {


      public $base;

      public function get_name() {
         return 'delicios-food-list';
      }

      public function get_title() {
         return esc_html__( 'Food list', 'deliciko' );
      }

      public function get_icon() { 
         return 'eicon-checkbox';
      }

      public function get_categories() {
         return [ 'deliciko-elements' ];
      }

      protected function register_controls() {
     
         $this->start_controls_section('section_tab',
         [
             'label' => esc_html__('Food list settings', 'deliciko'),
         ]
      );

         $this->add_control(
            'food_menu_style',
            [
               'label' => esc_html__( 'Food list Style', 'deliciko' ),
               'type' => Custom_Controls_Manager::IMAGECHOOSE,
               'default' => 'style1',
               'options' => [
                  'style1'  => [
                     'title' => esc_html__( 'Style 1', 'deliciko' ),
                           'imagelarge' => DELICIKO_IMG. '/admin/food-list/style2.png',
                           'imagesmall' => DELICIKO_IMG. '/admin/food-list/style2.png',
                           'width' => '30%',
                  ],
                  'style2'  => [
                     'title' => esc_html__( 'Style 2', 'deliciko' ),
                           'imagelarge' => DELICIKO_IMG. '/admin/food-list/style1.png',
                           'imagesmall' => DELICIKO_IMG. '/admin/food-list/style1.png',
                           'width' => '30%',
                  ],
               
               
            
               ],
            ]
         );

      
      
         $this->add_control(
            'food_currency',
            [
               'label' => esc_html__( 'Currency ', 'deliciko' ),
               'type'  => \Elementor\Controls_Manager::TEXT,
               'default' => esc_html__('$', 'deliciko'),
               
         
            ]
         );

      
      

         $this->add_control(
            'food_menu_type',
            [
               'label' => esc_html__( 'Food Type', 'deliciko' ),
               'type' => Controls_Manager::SELECT2,
               'multiple' => true,
               'default' => [],
               'options' => $this->getFoodMenu(),
                  
            ]
         );

         $this->add_control(
            'food_menu_item_number',
            [
               'label' => esc_html__( ' Number of food items', 'deliciko' ),
               'type' => \Elementor\Controls_Manager::NUMBER,
               'min' => 1,
               'max' => 100,
               'step' => 1,
               'default' => 5,
               'condition' => [
                  'food_menu_style' => ['style1','style2']
               ]
            ]
         );

         $this->add_control(
            'food_order',
            [
               'label' => esc_html__( 'Food order', 'deliciko' ),
               'type' => Controls_Manager::SELECT,
               'default' => 'ASC',
               'options' => [
                     'ASC'  => esc_html__( 'ASC', 'deliciko' ),
                     'DESC'  => esc_html__( 'DESC', 'deliciko' ),
                  ],
                  
            ]
         );

         $this->add_control(
            'show_item_status',
            [
               'label' => __( 'Show Item Status', 'deliciko' ),
               'type' => \Elementor\Controls_Manager::SWITCHER,
               'label_on' => __( 'Show', 'deliciko' ),
               'label_off' => __( 'Hide', 'deliciko' ),
               'return_value' => 'yes',
               'default' => 'yes',
            ]
         );
         
      
      $this->end_controls_section();

      $this->start_controls_section('style_title_section',
            [
               'label' => esc_html__( 'Title', 'deliciko' ),
               'tab' => Controls_Manager::TAB_STYLE,
            ]
      ); 

      $this->add_control('food_text_color',
         [
               'label' => esc_html__('Title color', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}}  .menu-block .inner-box .info a' => 'color: {{VALUE}};',
                  '{{WRAPPER}}  .menu-block .inner-box .info:before' => 'border-color: {{VALUE}};',
                  '{{WRAPPER}}  .feature-tab-post-wrapper .feature-content h3' => 'color: {{VALUE}};',
                   '{{WRAPPER}} .menu-block .inner-box .info .post-title' => 'color: {{VALUE}};',
                  
               ],
         ]
      );

      $this->add_control('food_title_bg_color',
         [
               'label' => esc_html__('Title BG color', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}}  .menu-block .inner-box .info .post-title' => 'background-color: {{VALUE}};',
                  '{{WRAPPER}}  .menu-block .inner-box .info .price' => 'background-color: {{VALUE}};',
                  
               ],
         ]
      );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'food_title_typography',
         'selector'	 => '{{WRAPPER}} .menu-block .inner-box .info .post-title',
         ]
      );

      $this->end_controls_section();

      $this->start_controls_section('style_currency_section',
         [
            'label' => esc_html__( 'Currency ', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
         ]
      ); 

      $this->add_control('food_currency_color',
      [
            'label' => esc_html__('Currency color', 'deliciko'),
            'type' => Controls_Manager::COLOR,
            'default' => '',
            'selectors' => [
               '{{WRAPPER}} .menu-block .inner-box .info h3 > i' => 'color: {{VALUE}};',
               '{{WRAPPER}} .feature-tab-post-wrapper .feature-image .feature-price > i' => 'color: {{VALUE}};',
               
               
            ],
      ]
      );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'food_currency_typography',
         'selector'	 => '{{WRAPPER}} .menu-block .inner-box .info h3 > i,{{WRAPPER}} .feature-tab-post-wrapper .feature-image .feature-price > i',
         ]
      );
      
      $this->end_controls_section();

      $this->start_controls_section('style_price_section',
         [
            'label' => esc_html__( 'Price ', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
         ]
      ); 

      $this->add_control('food_price_color',
         [
               'label' => esc_html__('Price color', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}} .menu-block .inner-box .info .price' => 'color: {{VALUE}};',
                  '{{WRAPPER}} .feature-tab-post-wrapper .feature-image .feature-price' => 'color: {{VALUE}};',
               ],
         ]
      );
      $this->add_control('food_price_bg_color',
      [
            'label' => esc_html__('Price bg color', 'deliciko'),
            'type' => Controls_Manager::COLOR,
          
            'default' => '',
            'selectors' => [
               
               '{{WRAPPER}} .feature-tab-post-wrapper .feature-image .feature-price' => 'background: {{VALUE}};',
               
               
            ],
         ]
      );
      $this->add_group_control(
         Group_Control_Border::get_type(),
         [
            'name' => 'border',
            'label' => esc_html__( 'Border', 'deliciko' ),
            'selector' => '{{WRAPPER}} .feature-tab-post-wrapper .feature-image .feature-price',
         
         ]
      );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'food_price_typography',
         'selector'	 => '{{WRAPPER}} .menu-block .inner-box .info h3.price',
         ]
      );
      
      $this->end_controls_section();

      $this->start_controls_section('style_ingredient_section',
         [
            'label' => esc_html__( 'Ingredient ', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
         ]
      ); 

      $this->add_control('food_ingredient_color',
         [
               'label' => esc_html__('Ingredient color', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}} .menu-block .inner-box .text' => 'color: {{VALUE}};',
                  '{{WRAPPER}} .feature-tab-post-wrapper .feature-content p' => 'color: {{VALUE}};',
                  
                  
               ],
         ]
      );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'food_ingredient_typography',
         'selector'	 => '{{WRAPPER}} .menu-block .inner-box .text,{{WRAPPER}} .feature-tab-post-wrapper .feature-content p',
         ]
      );
      
      $this->end_controls_section();

      $this->start_controls_section('style_food_status_section',
         [
            'label' => esc_html__( 'Item Status ', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
         ]
      );

      $this->add_control('food_status_color',
         [
               'label' => esc_html__('Status color', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}} .menu-block .inner-box .menu-tag a' => 'color: {{VALUE}};',
                  '{{WRAPPER}} .feature-tab-post-wrapper .feature-status' => 'color: {{VALUE}};',
                     
               ],
         ]
      );

      $this->add_control('food_status_background',
         [
               'label' => esc_html__('Status background', 'deliciko'),
               'type' => Controls_Manager::COLOR,
               'default' => '',
               'selectors' => [
                  '{{WRAPPER}} .menu-block .inner-box .menu-tag' => 'background: {{VALUE}};',
                  '{{WRAPPER}} .feature-tab-post-wrapper .feature-status' => 'background: {{VALUE}};',
                     
               ],
         ]
      );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'food_status_typography',
         'selector'	 => '{{WRAPPER}} .menu-block .inner-box .menu-tag,{{WRAPPER}} .feature-tab-post-wrapper .feature-status',
         ]
      );

      $this->end_controls_section();

      $this->start_controls_section('style_advance',
         [
            'label' => esc_html__( 'Advance ', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
         ]
      );

      $this->add_responsive_control(
			'content_margin',
			[
				'label' => esc_html__( 'Content Margin', 'deliciko' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em' ],
				'selectors' => [
					'{{WRAPPER}} .menu-list-item .menu-block' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
      );
      $this->add_responsive_control(
			'content_padding',
			[
				'label' => esc_html__( 'Content Padding', 'deliciko' ),
				'type' => Controls_Manager::DIMENSIONS,
				'size_units' => [ 'px', '%', 'em' ],
				'selectors' => [
					'{{WRAPPER}} .menu-list-item .menu-block' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				],
			]
      );
      $this->add_group_control(
         Group_Control_Border::get_type(),
         [
            'name' => 'content_border',
            'label' => esc_html__( 'Border', 'deliciko' ),
            'selector' => '{{WRAPPER}} .menu-list-item .menu-block',
         
         ]
      );
      $this->end_controls_section();


      }
      protected function render( ) { 
         $settings           = $this->get_settings();
         $food_currency      = $settings['food_currency'];
         $food_order         = $settings['food_order'];
         $food_menu_type     = $settings['food_menu_type'];
         $food_menu_style    = $settings['food_menu_style'];
         $show_item_status    = $settings['show_item_status'];
         
         $food_menu_item_number    = $settings['food_menu_item_number'];
     
         $menu = [];
         $food_list = [];
         global $post;
         $args = array(
            'post_type' 			   => 'ts-foodmenu',
      
            'post__in'              => $food_menu_type,
            'order' 				      => $food_order,
         );
     
      
         if(is_array($food_menu_type) && count($food_menu_type) ):
            $food_list = get_posts($args);
         endif;   
         
         foreach($food_list as $value){
            $menu = array_merge($menu,deliciko_meta_option($value->ID,'delicios_food_pop_up',[]));
          } 
         ?>
          <?php if($food_menu_style=='style1'): ?>
          <div class="menu-list-item"> 
               <?php foreach($menu as $key=>$style1_food): ?>
                  <div class="menu-block media"> 
                     <div class="post-thumb">
                         <?php if(count($style1_food['item_image'])): ?>
                              <img src="<?php echo esc_url($style1_food['item_image']['url']); ?>" class="img-fluid" alt=' <?php echo esc_attr($style1_food['item_title']); ?> ' />
                           <?php endif; ?>
                     </div>
                     <div class="inner-box"> 
                        <?php if(isset($style1_food['item_status']) &&  $show_item_status =='yes'): ?>
                           <span class="menu-tag">
                              <?php echo esc_html($style1_food['item_status']); ?>
                           </span>
                        <?php endif; ?>
                        <div class="info clearfix">
                              <h3 class="post-title pull-left">
                                 <?php echo esc_html($style1_food['item_title']); ?>
                              </h3> 
                              <h3 class="price pull-right"><i><?php echo esc_html($food_currency); ?> </i> <?php echo esc_html($style1_food['item_price']); ?></h3>

                        </div>
                        <div class="text"> 
                           <?php echo esc_html($style1_food['item_ingredient']); ?>
                        </div>
                     </div>
                  </div>
                  <?php ++$key; if($food_menu_item_number==$key){ break; } ?>
               <?php endforeach; ?>
            </div>
          <?php elseif($food_menu_style=='style2'): ?>
          <div class="menu-list-item menu-list-style2"> 
               <?php foreach($menu as $key=>$style1_food): ?>
                  <div class="menu-block media"> 
                     <div class="post-thumb">
                         <?php if(count($style1_food['item_image'])): ?>
                              <img src="<?php echo esc_url($style1_food['item_image']['url']); ?>" class="img-fluid" alt=' <?php echo esc_attr($style1_food['item_title']); ?> ' />
                           <?php endif; ?>
                     </div>
                     <div class="inner-box"> 
                        <?php if(isset($style1_food['item_status']) &&  $show_item_status =='yes'): ?>
                           <span class="menu-tag">
                              <?php echo esc_html($style1_food['item_status']); ?>
                           </span>
                        <?php endif; ?>
                         <div class="info clearfix">
                              <h3 class="post-title pull-left">
                                 <?php echo esc_html($style1_food['item_title']); ?>
                              </h3> 
                              <h3 class="price pull-right"><i><?php echo esc_html($food_currency); ?> </i> <?php echo esc_html($style1_food['item_price']); ?></h3>
                                 
                        </div>
                        <div class="text"> 
                           <?php echo esc_html($style1_food['item_ingredient']); ?>
                        </div>
                     </div>
                  </div>
                  <?php ++$key; if($food_menu_item_number==$key){ break; } ?>
               <?php endforeach; ?>
            </div>
         <?php endif; ?>
         <?php  
      }

      public function getFoodMenu(){
         $food_menu = [];  
         $food_list = [];
         global $post;
         $args = array(
            'post_type' 			   => 'ts-foodmenu',
            'suppress_filters' 		=> false,
            'posts_per_page' 		   => -1,
           
         );
      
         $food_list = get_posts($args);
   
         foreach($food_list as $item){
            $food_menu[$item->ID] = $item->post_title;
         }
         return $food_menu;
        }
   }  