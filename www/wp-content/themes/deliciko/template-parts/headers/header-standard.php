<?php
 

   if ( defined( 'FW' ) ) { 
   // sticky header
   $header_nav_sticky = deliciko_option('header_nav_sticky');
   $shop_btn_show = deliciko_option('shop_btn_show');

	$button_settings = deliciko_option('header_table_button_settings');
	//Page settings
	$header_btn_show = $button_settings['header_btn_show'];
	$header_btn_url = $button_settings['header_btn_url'];
	$header_btn_title = $button_settings['header_btn_title'];
   }else{

	$header_btn_show = 'no';
	$shop_btn_show = 'no';
   $header_nav_sticky = 'no';
	$header_btn_url = '#';
	$header_btn_title = ' Book a table ';
   }

?>

<!-- header nav start-->
<header id="header" class="header header-standard  <?php echo esc_attr($header_nav_sticky=='yes'?'navbar-sticky':''); ?>">

        <!-- navbar container start -->
        <div class="navbar-container">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <a class="navbar-brand" href="<?php echo esc_url( home_url('/')); ?>">
                        <img src="<?php 
                           echo esc_url(
                              deliciko_src(
                                 'general_dark_logo',
                                 DELICIKO_IMG . '/logo/logo.png'
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
