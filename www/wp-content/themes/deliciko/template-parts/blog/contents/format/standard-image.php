<div class="post-media post-image">
<?php if(has_post_thumbnail()): ?>
    <a href="<?php echo esc_url(get_the_permalink()); ?>">
        <img class="img-fluid" src="<?php echo get_the_post_thumbnail_url(); ?>" alt=" <?php the_title_attribute(); ?> ">
      </a>
               <?php 
                  if ( is_sticky() ) {
                     echo '<sup class="meta-featured-post"> <i class="fa fa-thumb-tack"></i> ' . esc_html__( 'Sticky', 'deliciko' ) . ' </sup>';
				  }
				
               ?>
  </div>
<?php endif; ?>
<div class="post-body clearfix">
      <div class="entry-header">
         <?php deliciko_post_meta(); ?>
         <h2 class="entry-title">
           <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
         </h2>
      </div>
     
      <?php 
           if ( is_sticky() && !has_post_thumbnail() ) {
					echo '<sup class="meta-featured-post"> <i class="fa fa-thumb-tack"></i> ' . esc_html__( 'Sticky', 'deliciko' ) . ' </sup>';
           }
       ?> 
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