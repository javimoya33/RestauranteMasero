<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;

class Deliciko_reservation_table_Widget extends Widget_Base { 


   public function get_name() {
      return 'delicios-reservation';
  }

  public function get_title() {
      return esc_html__( 'Deliciko Reservation Table' , 'deliciko' );
  }

  public function get_icon() {
      return 'eicon-table';
  }

  public function get_categories() {
      return ['deliciko-elements'];
  }

  protected function register_controls() {
        
   $this->start_controls_section('section_tab_style',
       [
           'label' => esc_html__('Deliciko Reservation Table', 'deliciko'),
       ]
   );
   $this->add_control(
      'reservation_table_link',
      [
         'label' => __( 'Reservation Table Link', 'deliciko' ),
         'type' => \Elementor\Controls_Manager::TEXT,
         'label_block' => true,
         'default' => "//www.opentable.com/widget/reservation/loader?rid=347401&type=standard&theme=wide&iframe=false&overlay=false&domain=com&lang=en-US",
        
      ]
   );
   $this->add_control(
      'reservation_btn_color', [
         'label'		 => esc_html__( 'Button Color', 'deliciko' ),
         'type'		 => Controls_Manager::COLOR,
         'selectors'	 => [
            '{{WRAPPER}} .elementor-widget-container .ot-dtp-picker .ot-dtp-picker-button' => 'color-color: {{VALUE}};',
         ],
      ]
   );
   $this->add_control(
      'reservation_btn_bg_color', [
         'label'		 => esc_html__( 'Button BG Color', 'deliciko' ),
         'type'		 => Controls_Manager::COLOR,
         'selectors'	 => [
            '{{WRAPPER}} .elementor-widget-container .ot-dtp-picker .ot-dtp-picker-button' => 'background-color: {{VALUE}};',
         ],
      ]
   );


   $this->end_controls_section();
   
   }  

   protected function render( ) {

      $settings           =     $this->get_settings();

      $reservation_table_link = $settings['reservation_table_link'];
        ?>

<script type='text/javascript' src='<?php echo esc_url($reservation_table_link); ?>'></script>
     
      
      <?php
  }
  protected function content_template() { }

}