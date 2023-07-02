<?php 
   $banner_image    =  '';
   $banner_title    = '';
   $header_style    = 'standard';
   
if ( defined( 'FW' ) ) { 
   $banner_settings         = deliciko_option('blog_banner_setting'); 
   $banner_style            = deliciko_option('sub_page_banner_style');
   $header_style            = deliciko_option('header_layout_style', 'standard');
  
   //image
   $banner_image = ( is_array($banner_settings['banner_blog_image']) && $banner_settings['banner_blog_image']['url'] != '') ? 
                        $banner_settings['banner_blog_image']['url'] : DELICIKO_IMG.'/banner/banner_image.jpg';

   //title 
   $banner_title = (isset($banner_settings['banner_blog_title']) && $banner_settings['banner_blog_title'] != '') ? 
                        $banner_settings['banner_blog_title'] : get_bloginfo( 'name' );
   //show
   $show = (isset($banner_settings['blog_show_banner'])) ? $banner_settings['blog_show_banner'] : 'yes'; 
   // banner overlay
   $show = (isset($banner_settings['blog_show_banner'])) ? $banner_settings['blog_show_banner'] : 'yes'; 
    
   //breadcumb 
   $show_breadcrumb =  (isset($banner_settings['blog_show_breadcrumb'])) ? $banner_settings['blog_show_breadcrumb'] : 'yes';

 }else{
     //default
   $banner_image             = '';
   $banner_title             = get_bloginfo( 'name' );
   $show                     = 'yes';
   $show_breadcrumb          = 'no';

     
 }
 if( isset($banner_image) && $banner_image != ''){
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
                              }elseif(is_single()){
                                 the_title();
                              }
                              else{
                                 $title = str_replace(['{', '}'], ['<span>', '</span>'],$banner_title ); 
                                 echo wp_kses_post( $title);
                              }
                           ?> 
                        </h2>
                         <?php if(isset($show_breadcrumb) && $show_breadcrumb == 'yes'): ?>
                            <?php deliciko_get_breadcrumbs(' / '); ?>
                         <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>  
  
<?php endif; ?>     