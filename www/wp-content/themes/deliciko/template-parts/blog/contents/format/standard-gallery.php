<div class="post-media post-video">
   <?php if(has_post_thumbnail()): ?>
        <img class="img-fluid" alt="<?php the_title_attribute(); ?>" src="<?php echo esc_url(get_the_post_thumbnail_url()); ?>" >
       <?php 
        if ( is_sticky() ) {
                  echo '<sup class="meta-featured-post"> <i class="fa fa-thumb-tack"></i> ' . esc_html__( 'Sticky', 'deliciko' ) . ' </sup>';
           }  
           ?>

         <?php if( defined( 'FW' ) && deliciko_meta_option(get_the_ID(),'featured_video')!=''):  ?>
               <div class="video-link-btn">
                  <a href="<?php echo deliciko_meta_option(get_the_ID(),'featured_video'); ?>" class="play-btn popup-btn"><i class="icon icon-play"></i></a>
               </div>
         <?php endif; ?> 
              
   <?php endif; ?>
         </div>
         <div class="post-body clearfix">
         <div class="entry-header">
           <?php deliciko_post_meta(); ?>
           <h2 class="entry-title">
               <a href="<?php esc_url(the_permalink()); ?>"><?php the_title(); ?></a>
           </h2>
         </div>
         
          
         <div class="post-content">
            <div class="entry-content">
               <p>
                  <?php deliciko_excerpt( 40, null ); ?>
               </p>
            </div>
            <?php
            if(!is_single()):
            ?>
            <div class="post-footer readmore-btn-area">
               <a class="readmore" href="<?php the_permalink(); ?>"> <?php echo esc_html__('Continue','deliciko'); ?> <i class="icon icon-arrow-right"></i></a>
            </div>
            <?php
               endif; 
         ?>
         </div>
   <!-- Post content right-->

</div>
<!-- post-body end-->