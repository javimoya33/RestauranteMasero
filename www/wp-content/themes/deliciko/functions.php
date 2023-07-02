<?php
/**
 * theme's main functions and globally usable variables, contants etc
 * added: v1.0 
 * textdomain: deliciko, class: Deliciko, var: $deliciko, constants:DELICIKO_, function: deliciko_
 */
// shorthand contants
// ------------------------------------------------------------------------
define('DELICIKO_THEME', 'Deliciko Restaurant WordPress Theme');
define('DELICIKO_VERSION', '2.0.2');
define('DELICIKO_MINWP_VERSION', '5.2');


// shorthand contants for theme assets url
// ------------------------------------------------------------------------
define('DELICIKO_THEME_URI', get_template_directory_uri());
define('DELICIKO_IMG', DELICIKO_THEME_URI . '/assets/images');
define('DELICIKO_CSS', DELICIKO_THEME_URI . '/assets/css');
define('DELICIKO_JS', DELICIKO_THEME_URI . '/assets/js');



// shorthand contants for theme assets directory path
// ----------------------------------------------------------------------------------------
define('DELICIKO_THEME_DIR', get_template_directory());
define('DELICIKO_IMG_DIR', DELICIKO_THEME_DIR . '/assets/images');
define('DELICIKO_CSS_DIR', DELICIKO_THEME_DIR . '/assets/css');
define('DELICIKO_JS_DIR', DELICIKO_THEME_DIR . '/assets/js');

define('DELICIKO_CORE', DELICIKO_THEME_DIR . '/core');
define('DELICIKO_COMPONENTS', DELICIKO_THEME_DIR . '/components');
define('DELICIKO_EDITOR', DELICIKO_COMPONENTS . '/editor');
define('DELICIKO_EDITOR_ELEMENTOR', DELICIKO_EDITOR . '/elementor');
define('DELICIKO_INSTALLATION', DELICIKO_CORE . '/installation-fragments');
define('DELICIKO_REMOTE_CONTENT', esc_url('http://demo.themewinter.com/demo-content/deliciko'));


// set up the content width value based on the theme's design
// ----------------------------------------------------------------------------------------
if (!isset($content_width)) {
    $content_width = 800;
}

// set up theme default and register various supported features.
// ----------------------------------------------------------------------------------------
 
function deliciko_setup() {

    // make the theme available for translation
    $lang_dir = DELICIKO_THEME_DIR . '/languages';
    load_theme_textdomain('deliciko', $lang_dir);

    // add support for post formats
    add_theme_support('post-formats', [
        'standard', 'gallery', 'video', 'audio'
    ]);

    // add support for automatic feed links
    add_theme_support('automatic-feed-links');

    // let WordPress manage the document title
    add_theme_support('title-tag');

    // add support for post thumbnails
    add_theme_support('post-thumbnails');

    add_theme_support( 'align-wide' );


    // hard crop center center
    set_post_thumbnail_size(750, 465, ['center', 'center']);

     // woocommerce support
     add_theme_support( 'woocommerce' );
     add_theme_support( 'wc-product-gallery-lightbox' );
     add_theme_support( 'wc-product-gallery-slider' );


    // register navigation menus
    register_nav_menus(
        [
            'primary' => esc_html__('Primary Menu', 'deliciko'),
            'footermenu' => esc_html__('Footer Menu', 'deliciko'),
        ]
    );

    // HTML5 markup support for search form, comment form, and comments
    add_theme_support('html5', array(
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption'
    ));

}
add_action('after_setup_theme', 'deliciko_setup');



// hooks for unyson framework
// ----------------------------------------------------------------------------------------
function deliciko_framework_customizations_path($rel_path) {
    return '/components';
}
add_filter('fw_framework_customizations_dir_rel_path', 'deliciko_framework_customizations_path');


function deliciko_remove_fw_settings() {
    remove_submenu_page( 'themes.php', 'fw-settings' );
}
add_action( 'admin_menu', 'deliciko_remove_fw_settings', 999 );


//Change sidebar id to your primary sidebar id and add it to 

//themes/theme_name/core/hooks/blog.php
function deliciko_body_classes( $classes ) {

    if ( is_active_sidebar( 'sidebar-1' ) || ( class_exists( 'Woocommerce' ) && ! is_woocommerce() ) || class_exists( 'Woocommerce' ) && is_woocommerce() && is_active_sidebar( 'shop-sidebar' ) ) {
        $classes[] = 'sidebar-active';
    }else{
        $classes[] = 'sidebar-inactive';
    }
    return $classes;
}
add_filter( 'body_class','deliciko_body_classes' );





// include the init.php
// ----------------------------------------------------------------------------------------
require_once( DELICIKO_CORE . '/init.php');
require_once( DELICIKO_COMPONENTS . '/editor/elementor/elementor.php');


// gutenberg
add_action('enqueue_block_editor_assets', 'deliciko_action_enqueue_block_editor_assets' );
function deliciko_action_enqueue_block_editor_assets() {
	wp_enqueue_style( 'deliciko-fonts', deliciko_google_fonts_url(['Cookie:300,300i,400,400i,500,600,700', 'Open Sans:400,500,700', 'ZCOOL XiaoWei: 400']), null, DELICIKO_VERSION );
    wp_enqueue_style( 'deliciko-gutenberg-editor-font-awesome-styles', DELICIKO_CSS . '/font-awesome.css', null, DELICIKO_VERSION );
    wp_enqueue_style( 'deliciko-gutenberg-editor-customizer-styles', DELICIKO_CSS . '/gutenberg-editor-custom.css', null, DELICIKO_VERSION );
    wp_enqueue_style( 'deliciko-gutenberg-editor-styles', DELICIKO_CSS . '/gutenberg-custom.css', null, DELICIKO_VERSION );
    wp_enqueue_style( 'deliciko-gutenberg-blog-styles', DELICIKO_CSS . '/blog.css', null, DELICIKO_VERSION );
}

/**
 *  Preloader 
 */
function preloader_function(){
        $preloader_show = deliciko_option('preloader_show');
        if($preloader_show == 'yes'){
            $deliciko_preloader_logo_url= esc_url(deliciko_src('preloader_logo'));
        ?>
        <div id="preloader">
            <?php if($deliciko_preloader_logo_url !=''): ?>
            
            <div class="preloader-logo">
                <img  class="img-fluid" src="<?php echo esc_url($deliciko_preloader_logo_url); ?>" alt="<?php echo get_bloginfo('name') ?>">
            </div>
            <?php else: ?>
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
            <?php endif; ?>
            <div class="preloader-cancel-btn-wraper"> 
                <span class="btn btn-primary preloader-cancel-btn" style="line-height: 20px;">
                  <?php echo esc_html_e('Cargar contenido', 'deliciko'); ?></span>
            </div>
        </div>
    <?php
    }
}
add_action('wp_head', 'preloader_function');



