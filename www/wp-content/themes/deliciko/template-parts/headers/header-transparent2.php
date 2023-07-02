<?php
 

   if ( defined( 'FW' ) ) { 
   // sticky header
   $header_nav_sticky = deliciko_option('header_nav_sticky');
// top settings
   $header_topbar_settings   = deliciko_option('header_top_bar_settings');
   $top_show                 = $header_topbar_settings['header_topbar_show'];
   $header_topbar_address    = $header_topbar_settings['header_topbar_address'];
   $header_topbar_contact    = $header_topbar_settings['header_topbar_contact'];

   $button_settings = deliciko_option('header_table_button_settings');
   $shop_btn_show = deliciko_option('shop_btn_show');

	//Page settings
	$header_btn_show = $button_settings['header_btn_show'];
	$header_btn_url = $button_settings['header_btn_url'];
   $header_btn_title = $button_settings['header_btn_title'];
 
   }else{

	$header_btn_show = 'no';
   $header_btn_url = '#';
   $shop_btn_show = 'no';
	$header_btn_title = esc_html__('Book a table','deliciko');
	$header_topbar_contact = esc_html__(' +123-456-7899 ','deliciko');
	$header_topbar_address = esc_html__('85 Bay Meadows Drive, GA 30188, United States ','deliciko');
   $top_show = 'no';
   $header_nav_sticky = 'no';
   }
?>

<div class="header-transparent">
   <!-- topbar -->
<?php if($top_show =='yes'): ?>
<div class="topbar topbar-transparent b-bottom">
   <div class="container">
      <div class="row">
         <div class="col-md-8 align-self-center">
          <?php if(defined('FW')): ?>
               <ul class="top-contact-info">
                  <li>
                     <i class="icon icon-home"></i>
                     <?php echo esc_html($header_topbar_address) ?>
                  </li>
                  <li>
                     <i class="icon icon-phone2"></i>
                     <?php echo esc_html($header_topbar_contact) ?>
                  </li>
               </ul>
            <?php endif; ?>
         </div>

         <div class="col-md-4 align-self-center">
         <?php $social_links = deliciko_option('general_social_links',[]);  ?>
            <ul class="social-links text-right">
                  <?php 
                  
                     if(count($social_links)):  
                        $class= ''; 
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
      </div>
   </div>
</div>
 <?php endif; ?>

<!-- header nav start-->
<header id="header" class="header nav-classic-transparent <?php echo esc_attr($header_nav_sticky=='yes'?'navbar-sticky':''); ?>">
  
        <!-- navbar container start -->
        <div class="navbar-container">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light">
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
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#primary-nav"
                        aria-controls="primary-nav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"><i class="icon icon-menu"></i></span>
                    </button>
                    <?php get_template_part( 'template-parts/navigations/nav', 'primary' ); ?>
                    <!-- collapse end -->
                  <?php if(defined('FW')): ?>
                     <ul class="header-nav-right-info form-inline">
                     <?php if($shop_btn_show == "yes" && class_exists( 'WooCommerce' )): ?>
                              <li>
                              <div class="header-cart">
                                 <div class="cart-link">
                                    <a class="cart-contents" href="<?php echo wc_get_cart_url(); ?>" title="<?php esc_attr_e('View your shopping cart', 'deliciko'); ?>">
                                    <span class="icon icon-cart"></span>
                                    <sup><?php echo sprintf(_n('%d item', '%d', WC()->cart->cart_contents_count, 'deliciko'), WC()->cart->cart_contents_count);?></sup>
                                    
                                    </a>
                                 </div>
                               </div>
                              </li>
                           <?php endif; ?> 

                        <?php if($header_btn_show=='yes'): ?>
                            <li class="header-book-btn">
                                <a href="<?php echo esc_url($header_btn_url); ?>" class="btn btn-primary"><?php echo esc_html($header_btn_title); ?></a>
                            </li>
                        <?php endif; ?>
                     </ul>
                  <?php endif; ?>
                </nav>
                <!-- nav end -->
            </div>
            <!-- container end -->
        </div>
        <!-- navbar contianer end -->
</header>
</div>