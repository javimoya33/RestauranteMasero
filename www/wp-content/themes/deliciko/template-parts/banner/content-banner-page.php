<?php 
   $banner_image    = '';
   $banner_title    = '';
   $banner_style    = 'full';
   $header_style    = 'standard';

   if ( defined( 'FW' ) ) { 

 
      $banner_settings          = deliciko_option('page_banner_setting'); 
      $banner_image             = deliciko_meta_option( get_the_ID(), 'header_image' );
      $header_style             = deliciko_option('header_layout_style', 'standard');
      
   
      //title
      if(deliciko_meta_option( get_the_ID(), 'header_title' ) != ''){
         $banner_title = deliciko_meta_option( get_the_ID(), 'header_title' );
      }elseif($banner_settings['banner_page_title'] != ''){
         $banner_title = $banner_settings['banner_page_title'];
      }else{
         $banner_title   = get_the_title();
      }
      
    
      //image
      if(is_array($banner_image) && $banner_image['url'] != '' ){
         $banner_image = $banner_image['url'];
      }elseif( is_array($banner_settings['banner_page_image']) && $banner_settings['banner_page_image']['url'] != ''){
            $banner_image = $banner_settings['banner_page_image']['url'];
      }else{
         
            $banner_image = DELICIKO_IMG.'/banner/banner_image.jpg';
      }
      
      $show = (isset($banner_settings['page_show_banner'])) ? $banner_settings['page_show_banner'] : 'yes'; 
      // breadcumb
      $show_breadcrumb =  (isset($banner_settings['page_show_breadcrumb'])) ? $banner_settings['page_show_breadcrumb'] : 'yes';

   
   }else{
      //default
      $banner_image             = '';
      $banner_title             = get_the_title();
      $show                     = 'yes';
      $show_breadcrumb          = 'no';

   }
   if( $banner_image != ''){
      $banner_image = 'style="background-image:url('.esc_url( $banner_image ).');"';
   }
   $banner_heading_class = '';
   if($header_style=="transparent"):
      $banner_heading_class     = "mt-80";   
   endif;  

?>

<?php if(isset($show) && $show == 'yes'): ?>

     <div class="banner-area <?php echo esc_attr($banner_image == ''?'banner-solid':'banner-bg'); ?>" <?php echo wp_kses_post( $banner_image ); ?>>
            <div class="container">
                <div class="row">
                    <div class="col-md-12 text-center">
                        <h2 class="banner-title <?php echo esc_attr($banner_heading_class); ?>">
                           <?php 
                              if(is_archive()){
                                    the_archive_title();
                              }else{
                                 $title = str_replace(['{', '}'], ['<span>', '</span>'],$banner_title ); 
                                 echo wp_kses_post( $title);
                              }
                           ?> 
                        </h2>
                         <?php if(isset($show_breadcrumb) && $show_breadcrumb == 'yes'): ?>
                            <?php deliciko_get_breadcrumbs(" / "); ?>
                         <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>  
  
<?php endif; ?>   