<?php
/**
 * Blog Header
 *
 */
 
$banner_bg	 = $banner_title = $banner_subtitle = '';
$header_style    = 'standard';
 
if ( defined( 'FW' ) ) {
    
    $banner_settings = deliciko_option('shop_banner_settings');
    //Page settings
    $header_style             = deliciko_option('header_layout_style', 'standard');

    $show = (isset($banner_settings['show'])) ? $banner_settings['show'] : 'yes'; 
    $show_breadcrumb = (isset($banner_settings['show_breadcrumb'])) ? $banner_settings['show_breadcrumb'] : 'yes';

    $banner_title = (isset($banner_settings['title']) && $banner_settings['title'] != '') ? 
                        $banner_settings['title'] : esc_html__('Shop','deliciko');
    $single_title = (isset($banner_settings['single_title']) && $banner_settings['single_title'] != '') ? 
                        $banner_settings['single_title'] : esc_html__('Product Details','deliciko');

    $banner_image = ( is_array($banner_settings['image']) && $banner_settings['image']['url'] != '') ? 
                        $banner_settings['image']['url'] : DELICIKO_IMG.'/banner/banner_image.jpg';

}else{
    $banner_image =DELICIKO_IMG.'/banner/banner_image.jpg';
    $banner_title = esc_html__('Shop','deliciko');
    $single_title = esc_html__('Product Details','deliciko');
    $show = 'yes';
    $show_breadcrumb = 'yes';
}
if( isset($banner_image) && $banner_image != ''){
    $banner_bg = 'style="background-image:url('.esc_url( $banner_image ).');"';
}

if(isset($show) && $show == 'yes'): ?>

<?php

$banner_heading_class = '';
if($header_style=="transparent"):
   $banner_heading_class     = "mt-80";   
endif;  
?>

<div id="page-banner-area" class="page-banner-area banner-area" <?php echo wp_kses_post( $banner_bg ); ?>>
   <!-- Subpage title start -->
   <div class="page-banner-title">
   
      <div class="text-center">
      
         <h2 class="banner-title <?php echo esc_attr($banner_heading_class); ?>">
         <?php 
               if(is_archive()){
                  if(isset($banner_title ) && $banner_title !=''){
                     echo deliciko_kses( $banner_title );
                  }else{
                     the_archive_title();
                  }
               }elseif(is_product()){
                  if(isset($single_title) && $single_title  !=''){
                     echo deliciko_kses( $single_title );
                  }else{
                     the_title();
                  }
               }else{
                  echo deliciko_kses( $banner_title );
               }
         ?>
         </h2> 
      
      
         <?php if($show_breadcrumb == 'yes'): ?>
               <?php woocommerce_breadcrumb(); ?>
         <?php endif; ?>
      </div>
   </div><!-- Subpage title end -->
</div><!-- Page Banner end -->

<?php endif; ?>