<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;


class Deliciko_Event_Widget extends Widget_Base {


    public $base;

    public function get_name() {
        return 'delicios-event';
    }

    public function get_title() {
        return esc_html__( 'Event reservation', 'deliciko' );
    }

    public function get_icon() { 
        return 'eicon-info-box';
    }

    public function get_categories() {
        return [ 'deliciko-elements' ];
    }

    protected function register_controls() {

        $this->start_controls_section(
            'section_tab',
            [
                'label' => esc_html__('Deliciko Event', 'deliciko'),
            ]
		);
    

        $this->add_control(
			'title', [
				'label'			=> esc_html__( 'Title', 'deliciko' ),
				'type'			=> Controls_Manager::TEXT,
				'label_block'	=> true,
				'placeholder'	=> esc_html__( 'Best food quality', 'deliciko' ),
				'default'	    => esc_html__( 'Good time for barbecue', 'deliciko' ),
			]
		);

        $this->add_control(
			'desc', [
			'label'			=> esc_html__( 'Content', 'deliciko' ),
			'type'			=> Controls_Manager::TEXTAREA,
			'label_block'	=> true,
			'placeholder'	=> esc_html__( 'At Bagatelle we are committed to provide excellent service', 'deliciko' ),
  
           
			]
      );

      $this->add_control(
			'image',
			[
				'label' => esc_html__( 'Choose Image', 'deliciko' ),
				'type' => \Elementor\Controls_Manager::MEDIA,
				'default' => [
					'url' => \Elementor\Utils::get_placeholder_image_src(),
				],
			]
      );
    
      $this->add_control(
			'due_date',
			[
				'label' => esc_html__( 'Event Date', 'deliciko' ),
            'type' => \Elementor\Controls_Manager::DATE_TIME,
          
            'picker_options'=>[
              'dateFormat' =>'j,F, Y',
              'enableTime'=>false,
            ],
			]
      );
      
      $this->add_control(
			'event_start_time', [
				'label'			=> esc_html__( 'Start Time', 'deliciko' ),
				'type'			=> Controls_Manager::TEXT,
				'label_block'	=> true,
				'placeholder'	=> esc_html__( '7:00', 'deliciko' ),
				'default'	    => esc_html__( '7:00', 'deliciko' ),
			]
		);
      
      $this->add_control(
			'event_end_time', [
				'label'			=> esc_html__( 'End Time', 'deliciko' ),
				'type'			=> Controls_Manager::TEXT,
				'label_block'	=> true,
				'placeholder'	=> esc_html__( '9:00', 'deliciko' ),
				'default'	    => esc_html__( '9:00', 'deliciko' ),
			]
      );

      
      $this->add_control(
			'order_button_title', [
				'label'			=> esc_html__( 'Button text', 'deliciko' ),
				'type'			=> Controls_Manager::TEXT,
				'label_block'	=> true,
				'placeholder'	=> esc_html__( 'Book a table', 'deliciko' ),
				'default'	    => esc_html__( 'Book a table', 'deliciko' ),
			]
      );
      
      $this->add_control(
			'order_button_url', [
				'label'			=> esc_html__( 'Button url', 'deliciko' ),
				'type'			=> Controls_Manager::TEXT,
				'label_block'	=> true,
				'placeholder'	=> esc_html__( '#', 'deliciko' ),
				'default'	    => esc_html__( '#', 'deliciko' ),
			]
      );

      $this->add_responsive_control(
			'title_align', [
				'label'			 => esc_html__( 'Alignment', 'deliciko' ),
				'type'			 => Controls_Manager::CHOOSE,
				'options'		 => [

					'left'		 => [
						'title'	 => esc_html__( 'Left', 'deliciko' ),
						'icon'	 => 'fa fa-align-left',
					],
					'center'	 => [
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
                    '{{WRAPPER}} .single-event-reservation' => 'text-align: {{VALUE}};',
                   
                    
				],
			]
        );

      $this->end_controls_section();

     

	    
		$this->start_controls_section(
			'section_sub_title_style', [
				'label'	 => esc_html__( 'Title', 'deliciko' ),
				'tab'	 => Controls_Manager::TAB_STYLE,
			]
        );

        $this->add_control(
			'title_color', [
				'label'		 => esc_html__( 'Title color', 'deliciko' ),
				'type'		 => Controls_Manager::COLOR,
				'selectors'	 => [
					'{{WRAPPER}} .single-event-reservation h3' => 'color: {{VALUE}};',
				],
			]
		);

        
        $this->add_group_control(Group_Control_Typography::get_type(),
         [
			'name'		 => 'title_typography',
			'selector'	 => '{{WRAPPER}} .single-event-reservation h3',
			]
		);

        $this->end_controls_section();
        
        //Content Style Section
      $this->start_controls_section('section_content_style',
         [
				'label'	 => esc_html__( 'Content', 'deliciko' ),
				'tab'	    => Controls_Manager::TAB_STYLE,
			]
        );

        $this->add_control(
			'feature_content_color', [
				'label'		 => esc_html__( 'Content color', 'deliciko' ),
				'type'		 => Controls_Manager::COLOR,
				'selectors'	 => [
					'{{WRAPPER}} .single-event-reservation p' => 'color: {{VALUE}};',
				],
			]
        );

        $this->add_group_control(Group_Control_Typography::get_type(),
         [
			 'name'		 => 'feature_content_typography',
			 'selector'	 => '{{WRAPPER}} .single-event-reservation p',
			]
		);

		$this->end_controls_section();

		//Icon Style Section
      $this->start_controls_section('section_icon_style',
         [
				'label'	 => esc_html__( 'Icon', 'deliciko' ),
				'tab'	   => Controls_Manager::TAB_STYLE,
			]
        );

        $this->add_control('date_icon_color', 
          [
				'label'		 => esc_html__( 'Date icon color', 'deliciko' ),
				'type'		 => Controls_Manager::COLOR,
				'selectors'	 => [
					'{{WRAPPER}} .single-event-reservation .event-meta .event-date i' => 'color: {{VALUE}};',
				],
			]
        );
        $this->add_control('time_icon_color', 
          [
				'label'		 => esc_html__( 'Time icon color', 'deliciko' ),
				'type'		 => Controls_Manager::COLOR,
				'selectors'	 => [
					'{{WRAPPER}} .single-event-reservation .event-meta .event-time i' => 'color: {{VALUE}};',
				],
			]
        );
        

      $this->add_group_control(
			Group_Control_Typography::get_type(), [
			'name'		 => 'icon_typography',
			'selector'	 => '{{WRAPPER}} .single-event-reservation .event-meta .event-time i,{{WRAPPER}} .single-event-reservation .event-meta .event-date i',
			]
       ); 
       
      

      $this->end_controls_section();
      $this->start_controls_section('section_button_style',
         [
				'label'	 => esc_html__( 'Reservation button', 'deliciko' ),
				'tab'	   => Controls_Manager::TAB_STYLE,
			]
        );
        $this->add_control('button_text_color', 
        [
          'label'		 => esc_html__( 'color', 'deliciko' ),
          'type'		 => Controls_Manager::COLOR,
          'selectors'	 => [
             '{{WRAPPER}} .single-event-reservation .event-order a' => 'color: {{VALUE}};',
          ],
       ]
       );
       $this->add_control('button_bg_color', 
       [
         'label'		 => esc_html__( 'bgcolor', 'deliciko' ),
         'type'		 => Controls_Manager::COLOR,
         'selectors'	 => [
            '{{WRAPPER}} .single-event-reservation .event-order a' => 'background: {{VALUE}};',
         ],
      ]
      );
		$this->end_controls_section();

		
    

    } //Register control end

    protected function render( ) { 
      $settings = $this->get_settings();
     
	
		$title = $settings["title"];
      $desc = $settings["desc"];
      $due_date = $settings["due_date"];
      $event_start_time = $settings["event_start_time"];
      $event_end_time = $settings["event_end_time"];
      $order_button_title = $settings["order_button_title"];
      $order_button_url = $settings["order_button_url"];
      $image = $settings["image"];
    
	
    ?>
 
    
	<div class="row">
      <div class="col-md-6"> 
         <div class="single-event-reservation">
            <h3 class="ts-title">
               <?php echo esc_html($title); ?>
            </h3>
            <div class="event-meta">
               <span class="event-date">
                  <i class="icon icon-calendar"></i> 
                  <?php echo esc_html($due_date); ?>
               </span>  
               <span class="event-time">
                     <i class="icon icon-clock"></i> 
                     <?php echo esc_html($event_start_time); ?>
                     <?php echo esc_html(' - '.$event_end_time); ?>
               </span>   
            </div>
            
            <p>
               <?php echo deliciko_kses($desc); ?>
            </p>
            <div class="event-order">
               <a class="btn" href="<?php echo esc_url($order_button_url); ?>"> 
                  <?php echo esc_html($order_button_title); ?>
               </a>
            </div> 
         </div>
      </div>
      <div class="col-md-6">
        <img src="<?php echo esc_url($image['url']); ?>" />
      </div>

   </div>


    

	
    
    <?php  
    }
    protected function content_template() { }
}