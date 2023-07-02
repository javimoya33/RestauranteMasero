<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;


class Deliciko_chef_Widget extends Widget_Base {


    public $base;

    public function get_name() {
        return 'delicios-chef';
    }

    public function get_title() {
        return esc_html__( 'Deliciko chef', 'deliciko' );
    }

    public function get_icon() { 
        return 'eicon-lock-user';
    }

    public function get_categories() {
        return [ 'deliciko-elements' ];
    }

    protected function register_controls() {

      $this->start_controls_section(
         'section_tab',
         [
             'label' => esc_html__('Chef settings', 'deliciko'),
         ]
      );

      $this->add_control(
         'chef_style',
         [
            'label' => esc_html__( 'Chef style', 'deliciko' ),
            'type' => \Elementor\Controls_Manager::SELECT,
            'default' => 'style1',
            'options' => [
               'style1'  => esc_html__( 'Style 1', 'deliciko' ),
               'style2' =>  esc_html__( 'Style 2', 'deliciko' ),
               'style3' =>  esc_html__( 'Style 3', 'deliciko' ),
           
            ],
         ]
      );

      $this->add_control('chef_member',
         [
            'label'     => esc_html__( 'Select chef member', 'deliciko' ),
            'type'      => \Elementor\Controls_Manager::SELECT2,
            'multiple' => false,
            'options'   => $this->getChef(),
         
         ]
      ); 


      $this->add_control(
         'show_title',
         [
             'label'     => esc_html__('Show name', 'deliciko'),
             'type' => \Elementor\Controls_Manager::SELECT,
             'default' => 'block',
             'options' => [
                'block'  => esc_html__( 'Show', 'deliciko' ),
                'none'   => esc_html__( 'Hide', 'deliciko' ),
             ],
            'selectors' => [
                '{{WRAPPER}} .chef-area .team-details .team-name' => 'display: {{VALUE}};',
             ],
            
         ]
      );
  
      $this->add_control(
         'show_designation',
         [
             'label'     => esc_html__('Show designation', 'deliciko'),
             'type' => \Elementor\Controls_Manager::SELECT,
             'default' => 'block',
             'options' => [
                'block'  => esc_html__( 'Show', 'deliciko' ),
                'none'   => esc_html__( 'Hide', 'deliciko' ),
             ],
            'selectors' => [
                '{{WRAPPER}} .chef-area .team-details .team-designation' => 'display: {{VALUE}};',
             ],
            
         ]
      );

      $this->add_control(
         'show_social',
         [
             'label'     => esc_html__('Show social', 'deliciko'),
             'type' => \Elementor\Controls_Manager::SELECT,
             'default' => 'block',
             'options' => [
                'block'  => esc_html__( 'Show', 'deliciko' ),
                'none'   => esc_html__( 'Hide', 'deliciko' ),
             ],
            'selectors' => [
                '{{WRAPPER}} .chef-area .team-content .social-postion' => 'display: {{VALUE}};',
             ],
            
         ]
      );
      
      $this->add_responsive_control(
			'content_align', [
				'label'			 => esc_html__( 'Text alignment', 'deliciko' ),
				'type'			 => Controls_Manager::CHOOSE,
				'options'		 => [

               'left'		 => [
                  
                  'title'	 => esc_html__( 'Left', 'deliciko' ),
						'icon'	 => 'fa fa-align-left',
               
               ],
					'center'	     => [
                  
                  'title'	 => esc_html__( 'Center', 'deliciko' ),
						'icon'	 => 'fa fa-align-center',
               
               ],
					'right'		 => [

						'title'	 => esc_html__( 'Right', 'deliciko' ),
                  'icon'	 => 'fa fa-align-right',
                  
					],
					'justify'	 => [

						'title'	 => esc_html__( 'Justified', 'deliciko' ),
                  'icon'	 => 'fa fa-align-justify',
                  
					],
				],
            'default'		 => 'center',
            'selectors' => [
               '{{WRAPPER}} .chef-area' => 'text-align: {{VALUE}};',
                          
                
            ],
          
			]
        );//Responsive control end

      $this->end_controls_section();

         //Title Style Section
		$this->start_controls_section(
			'section_title', [
				'label'	 => esc_html__( 'Title', 'deliciko' ),
				'tab'	    => Controls_Manager::TAB_STYLE,
			  ]
      );  

      $this->add_control(
			'title_color', [

				'label'		 => esc_html__( 'Title color', 'deliciko' ),
				'type'		 => Controls_Manager::COLOR,
				'selectors'	 => [
               '{{WRAPPER}} .chef-area .team-details .team-name' => 'color: {{VALUE}};',
               
				],
			]
      );

      $this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'name_typography',
				'label' => esc_html__( 'Name typography', 'deliciko' ),
				'scheme' => Core\Schemes\Typography::TYPOGRAPHY_1,
            'selector' => '{{WRAPPER}} .chef-area .team-details .team-name',
			]
      );


      $this->end_controls_section();

      $this->start_controls_section(
			'section_designation', [
				'label'	 => esc_html__( 'Designation', 'deliciko' ),
				'tab'	    => Controls_Manager::TAB_STYLE,
			  ]
      ); 
  
      $this->add_control(
         'designation_color', [
         'label'		 => esc_html__( 'Designation color', 'deliciko' ),
         'type'		 => Controls_Manager::COLOR,
         'selectors'	 => [
           '{{WRAPPER}} .chef-area .team-details .team-designation' => 'color: {{VALUE}};',
         ],
      ]
      );

      $this->add_group_control(
			Group_Control_Typography::get_type(),
			[
				'name' => 'designation_typography',
				'label' => esc_html__( 'Designation typography', 'deliciko' ),
				'scheme' => Core\Schemes\Typography::TYPOGRAPHY_1,
            'selector' => '{{WRAPPER}} .chef-area .team-details .team-designation',
			]
      );


      $this->end_controls_section();
       
		$this->start_controls_section(
			'section_style', [
				'label'	 => esc_html__( 'Social', 'deliciko' ),
				'tab'	    => Controls_Manager::TAB_STYLE,
			  ]
      );

      
    
      $this->add_control(
         'social_color', [
   
            'label'		 => esc_html__( 'Social color', 'deliciko' ),
            'type'		 => Controls_Manager::COLOR,
            'selectors'	 => [
   
               '{{WRAPPER}} .chef-area .social-postion li a i' => 'color: {{VALUE}};',
              
               
            ],
          ]
     );

     $this->add_responsive_control(
      'social_margin',
      [
         'label' => esc_html__( 'Social Margin', 'deliciko' ),
         'type' => Controls_Manager::DIMENSIONS,
         'size_units' => [ 'px', '%', 'em' ],
         'selectors' => [
            '{{WRAPPER}} .chef-area .social-postion' => 'margin: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
         ],
      ]
     );
   
      $this->end_controls_section();

      $this->start_controls_section(
			'section_advanced_postion', [
				'label'	 => esc_html__( 'Advanced Style', 'deliciko' ),
				'tab'	    => Controls_Manager::TAB_STYLE,
			  ]
      );
      
      
      $this->add_control(
			'more_options',
			[
				'label' => esc_html__( 'Chef info', 'deliciko' ),
				'type' => \Elementor\Controls_Manager::HEADING,
				'separator' => 'before',
			]
      );
      
      $this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'border',
            'label' => esc_html__( 'Chef Content Border', 'deliciko' ),
            'show_label' => true,
            'label_block' => true,
				'selector' => '{{WRAPPER}} .chef-area .team-content',
			]
      );
      
      $this->add_control(
         'cnt-wrapper_hover_color', [
   
            'label'		 => esc_html__( 'Content hover bgcolor', 'deliciko' ),
            'type'		 => Controls_Manager::COLOR,
            'selectors'	 => [
                  '{{WRAPPER}} .chef-area .team-content:hover' => 'background: {{VALUE}};',
            ],
            'condition' => [
               'chef_style' => ['style3']
            ]
         ]
      );

      $this->add_control(
         'cnt-wrapper_bg_color', [
   
            'label'		 => esc_html__( 'Content bgcolor', 'deliciko' ),
            'type'		 => Controls_Manager::COLOR,
            'selectors'	 => [
                  '{{WRAPPER}} .chef-area .team-content' => 'background: {{VALUE}};',
            ],
         ]
      );

      $this->add_control(
			'chef_content_options',
			[
				'label' => esc_html__( 'Chef border', 'deliciko' ),
				'type' => \Elementor\Controls_Manager::HEADING,
            'separator' => 'before',
            
			]
      );
      
      $this->add_group_control(
			Group_Control_Border::get_type(),
			[
				'name' => 'chef_content_border',
            'label' => esc_html__( 'Chef Border', 'deliciko' ),
            'show_label' => true,
            'label_block' => true,
            'selector' => '{{WRAPPER}} .chef-area .ts-team-info',
            
			]
      );

      $this->end_controls_section();

    }

    protected function render( ) { 

      $settings         = $this->get_settings();
      $chef_member_id   = $settings['chef_member'];
      $chef_style     = $settings['chef_style'];
      $ts_team_class = 'ts-team';
      $chef         = get_post($chef_member_id);
      $image_url    = wp_get_attachment_url( get_post_thumbnail_id($chef->ID), 'full' );
      $designation  = deliciko_meta_option($chef->ID,'member_designation',''); 
      $socials      = deliciko_meta_option($chef->ID,'member_social',[]); 

      if($chef_style == 'style1'):
         $ts_team_class = 'ts-team';   
      elseif($chef_style == 'style2'):
         $ts_team_class = 'ts-team-classic';   
      elseif($chef_style == 'style3'):
         $ts_team_class = 'ts-team-standard';
      endif;         

        
      ?>
    
         <div class="<?php echo esc_attr($ts_team_class); ?> chef-area">
            <div class="ts-team-info">
               <?php if($image_url!=''): ?>
                  <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($chef->post_title); ?>" class="img-fluid">
               <?php endif; ?>
               <div class="team-content">
                  <div class="team-details">
                     <span class="team-name">
                        <?php echo esc_html($chef->post_title); ?>
                     </span>
                     <p class='team-designation'> <?php echo esc_html($designation); ?> </p>
                  </div>
                  <ul class="team-social unstyled social-postion">
                    <?php foreach($socials as $social): ?> 
                      <li>
                         <a href="<?php echo esc_url($social['social_url']); ?>">
                           <i class="<?php echo esc_attr($social['social_icon']); ?>">
                           </i>
                         </a>
                      </li>
                    <?php endforeach; ?>
                  </ul>
               </div> <!-- Post Body End -->
            </div>
         </div>

     
      <?php
    
    }
    
    protected function content_template() { }

    public function getChef(){
      
      $chef_list = [];

      $args = array(
         'numberposts'      => -1,
         'orderby'          => 'post_date',
         'order'            => 'DESC',
         'post_type'        => 'ts-chef',
         'post_status'      => 'publish',
         'suppress_filters' => true
      );

      $chefs = get_posts($args);
 
      if($chefs):
       // Loop the posts
         foreach ($chefs as $chef):
           $chef_list[$chef->ID]= $chef->post_title; 
         endforeach;
      endif;
      return $chef_list;

  }
}