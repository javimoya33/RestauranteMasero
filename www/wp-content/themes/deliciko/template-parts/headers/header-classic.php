<?php
 

   if ( defined( 'FW' ) ) { 
   // sticky header
   $header_nav_sticky = deliciko_option('header_nav_sticky');
   // top settings
   $header_topbar_show = deliciko_option('header_top_bar_settings');
   $top_show        = $header_topbar_show['header_topbar_show'];

	$button_settings = deliciko_option('header_table_button_settings');
	//Page settings
	$header_btn_show = $button_settings['header_btn_show'];
	$header_btn_url = $button_settings['header_btn_url'];
   $header_btn_title = $button_settings['header_btn_title'];
 
   }else{

	$header_btn_show = 'no';
	$header_btn_url = '#';
	$header_btn_title = esc_html__('Book a table','deliciko');
   $top_show = 'no';
   $header_nav_sticky = 'no';
   }
?>

<!-- topbar -->
<?php if($top_show =='yes'): ?>
<div class="topbar b-bottom">
   <div class="container">
      <div class="row">
         <div class="col-md-4 align-self-center">
         <?php $social_links = deliciko_option('general_social_links',[]);  ?>
            <ul class="social-links">
                  <?php 
                  $class ='';
                     if(count($social_links)):   
                        foreach($social_links as $sl):
                           if( isset( $sl['icon_class']) && isset($sl['ttile']) ) :
                              $class = 'ts-' . str_replace('fa fa-', '', $sl['icon_class']);
                              $title = $sl["title"];
                           endif; 
                  ?>
                        <li class="<?php echo esc_attr($class); ?>">
                           <a title="<?php echo esc_attr($title); ?>" href="<?php echo esc_url($sl['url']); ?>">
                            <i class="<?php echo esc_attr($sl['icon_class']); ?>"></i>
                           </a>
                        </li>
                  <?php endforeach; ?>
               <?php endif; ?>
            </ul>
         </div>
         <div class="col-md-4">
            <div class="top-logo text-center">
               <a class="navbar-brand" href="<?php echo esc_url( home_url('/') ); ?>">
                     <img src="<?php 
                        echo esc_url(
                           deliciko_src(
                              'general_dark_logo',
                              DELICIKO_IMG . '/logo/logo-v3.png'
                           )
                        );
                     ?>" alt="<?php bloginfo('name'); ?>">
               </a>
            </div>
         </div>
         <div class="col-md-4 align-self-center">
         <?php if(defined('FW')): ?>
               <ul class="topbar-btn text-right unstyled">
            
                  <?php if($header_btn_show=='yes'): ?>
                        <li class="header-book-btn">
                           <a href="<?php echo esc_url($header_btn_url); ?>" class="btn btn-primary"><?php echo esc_html($header_btn_title); ?></a>
                        </li>
                  <?php endif; ?>
               </ul>
            <?php endif; ?>
         </div>
      </div>
   </div>
</div>
 <?php endif; ?>


<!-- header nav start-->
<header id="header" class="header header-classic <?php echo esc_attr($header_nav_sticky=='yes'?'navbar-sticky':''); ?>">
        <!-- navbar container start -->
        <div class="navbar-container">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light">
                
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#primary-nav"
                        aria-controls="primary-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon">
                         <i class="icon icon-menu"></i>
                        </span>
                    </button>
                    <?php get_template_part( 'template-parts/navigations/nav', 'primary' ); ?>
                    <!-- collapse end -->
               
                </nav>
                <!-- nav end -->
            </div>
            <!-- container end -->
        </div>
        <!-- navbar contianer end -->
</header>
