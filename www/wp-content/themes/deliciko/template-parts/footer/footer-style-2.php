<?php 
      $back_to_top = deliciko_option('back_to_top');
      $mailchimp_short_code = '';
      $mailchimp_short_code =    deliciko_option("footer_mailchimp");

     
   ?> 
   
      <footer class="ts-footer ts-footer-red" >
            <div class="container">
            <?php if(defined( 'FW' )): ?>
               <?php if( is_active_sidebar('footer-left') || is_active_sidebar('footer-center') || is_active_sidebar('footer-right') ): ?> 
                  <div class="row">
                     <div class="col-lg-2 col-md-2 col-sm-12">
                        <?php  dynamic_sidebar( 'footer-left' ); ?>
                    </div>
                     <div class="col-lg-5 col-md-5 col-sm-12">
                        <?php  dynamic_sidebar( 'footer-center' ); ?>
                     </div>
                     <div class="col-lg-5 col-md-5 col-sm-12">
                     <?php if( shortcode_exists('mc4wp_form') && $mailchimp_short_code!='' ): ?>  
                        <div class="ts-subscribe">
                                 <?php  echo do_shortcode($mailchimp_short_code);  ?>  
                        </div>  
                     <?php endif; ?>
                     </div>
                     <!-- end col -->
                  </div>
                  <div class='footer-bar'> </div>
               <?php endif; ?>   
            <?php endif; ?> 
             
                  <div class="row copyright">
                     <div class="col-lg-6 col-md-6">
                       <div class="copyright-text">
                           <?php 
                              
                                 $copyright_text = deliciko_option('footer_copyright', 'Copyright © '. date('Y') . ' Deliciko. All Right Reserved.');
                              echo deliciko_kses($copyright_text);  
                           ?>
                        </div>
                     </div>
                     <div class="col-lg-6 col-md-5">
                     <?php if ( defined( 'FW' ) ) : ?>   
                           <div class="footer-social">
                              <ul>
                              <?php 
                                 $social_links = deliciko_option('footer_social_links',[]);                         
                                 foreach($social_links as $sl):
                                    $class = 'ts-' . str_replace('fa fa-', '', $sl['icon_class']);
                                    ?>
                                    <li class="<?php echo esc_attr($class); ?>">
                                          <a href="<?php echo esc_url($sl['url']); ?>">
                                          <i class="<?php echo esc_attr($sl['icon_class']); ?>"></i>
                                          </a>
                                    </li>
                                 <?php endforeach; ?>
                              </ul>
                        <?php endif; ?>     
                           </div>
                     </div>
               </div>
           </div>
      </footer>
        <!-- end footer -->
   <?php if($back_to_top=="yes"): ?>
      <div class="BackTo">
         <a href="#" class="fa fa-angle-up" aria-hidden="true"></a>
      </div>
   <?php endif; ?>