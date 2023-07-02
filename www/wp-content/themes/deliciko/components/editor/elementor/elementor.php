<?php

if ( ! defined( 'ABSPATH' ) ) exit;

if(defined('ELEMENTOR_VERSION')):

include_once DELICIKO_EDITOR . '/elementor/manager/controls.php';

class DELICIKO_Shortcode{

	/**
     * Holds the class object.
     *
     * @since 1.0
     *
     */
    public static $_instance;
    

    /**
     * Localize data array
     *
     * @var array
     */
    public $localize_data = array();

	/**
     * Load Construct
     * 
     * @since 1.0
     */

	public function __construct(){

		  add_action('elementor/init', array($this, 'DELICIKO_elementor_init'));
        add_action('elementor/controls/controls_registered', array( $this, 'deliciko_icon_pack' ), 11 );
        add_action('elementor/controls/controls_registered', array( $this, 'control_image_choose' ), 13 );
        add_action('elementor/controls/controls_registered', array( $this, 'DELICIKO_ajax_select2' ), 13 );
        add_action('elementor/widgets/widgets_registered', array($this, 'DELICIKO_shortcode_elements'));
        add_action( 'elementor/editor/after_enqueue_styles', array( $this, 'editor_enqueue_styles' ) );
        add_action( 'elementor/frontend/before_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        add_action( 'elementor/preview/enqueue_styles', array( $this, 'preview_enqueue_scripts' ) );
        
	}


    /**
     * Enqueue Scripts
     *
     * @return void  
     */ 
    
     public function enqueue_scripts() {
         wp_enqueue_script( 'deliciko-main-elementor', DELICIKO_JS  . '/elementor.js',array( 'jquery', 'elementor-frontend' ), DELICIKO_VERSION, true );
    }

    /**
     * Enqueue editor styles
     *
     * @return void
     */

    public function editor_enqueue_styles() {
  
        wp_enqueue_style( 'deliciko-icon-elementor', DELICIKO_CSS.'/iconfont.css',null, DELICIKO_VERSION );

    }

    /**
     * Preview Enqueue Scripts
     *
     * @return void
     */

    public function preview_enqueue_scripts() {}
	/**
     * Elementor Initialization
     *
     * @since 1.0
     *
     */

    public function DELICIKO_elementor_init(){
    
        \Elementor\Plugin::$instance->elements_manager->add_category(
            'deliciko-elements',
            [
                'title' =>esc_html__( 'DELICIKO', 'deliciko' ),
                'icon' => 'fa fa-plug',
            ],
            1
        );
    }

    /**
     * Extend Icon pack core controls.
     *
     * @param  object $controls_manager Controls manager instance.
     * @return void
     */ 

    public function DELICIKO_icon_pack( $controls_manager ) {

        require_once DELICIKO_EDITOR_ELEMENTOR. '/controls/icon.php';

        $controls = array(
            $controls_manager::ICON => 'Deliciko_Icon_Controler',
        );

        foreach ( $controls as $control_id => $class_name ) {
            $controls_manager->unregister_control( $control_id );
            $controls_manager->register_control( $control_id, new $class_name() );
        }

    }
    // registering ajax select 2 control
    public function DELICIKO_ajax_select2( $controls_manager ) {
        require_once DELICIKO_EDITOR_ELEMENTOR. '/controls/select2.php';
        $controls_manager->register_control( 'ajaxselect2', new \Control_Ajax_Select2() );
    }
    
    // registering image choose
    public function control_image_choose( $controls_manager ) {
        require_once DELICIKO_EDITOR_ELEMENTOR. '/controls/choose.php';
        $controls_manager->register_control( 'imagechoose', new \Control_Image_Choose() );
    }

    public function DELICIKO_shortcode_elements($widgets_manager){

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/event.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Event_Widget());
        
        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/owlslider.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_OwlSlider_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/feature.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Feature_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/foodblog.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Food_Update_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/title.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Title_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/chef.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_chef_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/chef-slider.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_chef_slider_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/testimonial.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Testimonial_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/food-menu.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_food_menu_Widget());
        
        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/food-list.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_food_list_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/resurvation-table.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_reservation_table_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/food-vertical-block.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Post_Vertical_Grid_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/food-vertical-block2.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Post_Vertical_Grid2_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/vertical-grid-slider.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Vertical_Grid_Slider_Widget());

        require_once DELICIKO_EDITOR_ELEMENTOR.'/widgets/vertical-feature-slider.php';
        $widgets_manager->register_widget_type(new Elementor\Deliciko_Vertical_Features_Slider_Widget());
    }
    
	public static function DELICIKO_get_instance() {
        if (!isset(self::$_instance)) {
            self::$_instance = new DELICIKO_Shortcode();
        }
        return self::$_instance;
    }

}
$DELICIKO_Shortcode = DELICIKO_Shortcode::DELICIKO_get_instance();

endif;