<?php

namespace Elementor;

if ( ! defined( 'ABSPATH' ) ) exit;

class Deliciko_Food_Update_Widget extends Widget_Base {


    public $base;

    public function get_name() {
        return 'delicios-latestnews';
    }

    public function get_title() {
        return esc_html__( 'Food blog ', 'deliciko' );
    }

    public function get_icon() { 
        return 'eicon-posts-grid';
    }

    public function get_categories() {
        return [ 'deliciko-elements' ];
    }

    protected function register_controls() {
		$this->start_controls_section(
			'section_tab', [
				'label' => esc_html__( 'Latest food news', 'deliciko' ),
			]
        );
      
      $this->add_control(
         'post_count',
                     [
                        'label'         => esc_html__( 'Post count', 'deliciko' ),
                        'type'          => Controls_Manager::NUMBER,
                        'default'       => '3',

                     ]
      );

      $this->add_control('post_category',
         [
            'label'     => esc_html__( 'Category', 'deliciko' ),
            'type'      => \Elementor\Controls_Manager::SELECT2,
            'multiple'  => true,
            'default'   => [],
            'options'   => $this->getCategories(),
         
         ]
      ); 

      $this->add_control(
			'post_col',
			[
				'label'   => esc_html__( 'Post Column', 'deliciko' ),
				'type'    => Controls_Manager::SELECT,
				'default' => '3',
				'options' => [
					'3'  => esc_html__( '4 Column ', 'deliciko' ),
					'4'  => esc_html__( '3 Column', 'deliciko' ),
					'6'  => esc_html__( '2 Column', 'deliciko' ),
			
				],
			]
		);
      $this->add_control(
         'post_title_crop',
         [
           'label'         => esc_html__( 'Title limit', 'deliciko' ),
           'type'          => Controls_Manager::NUMBER,
           'default'       => '3',
           
         ]
       ); 

       $this->add_control(
         'post_sort_by',
         [
            'label' => esc_html__( 'Sort By', 'deliciko' ),
            'type' => Controls_Manager::SELECT,
            'default' => 'DESC',
            'options' => [
                    'ASC'  => esc_html__( 'ASC', 'deliciko' ),
                    'DESC'  => esc_html__( 'DESC', 'deliciko' ),
                ],
               
         ]
      );
       
      $this->add_control(
         'show_desc',
         [
             'label'     => esc_html__('Show description', 'deliciko'),
             'type'      => Controls_Manager::SWITCHER,
             'label_on'  => esc_html__('Yes', 'deliciko'),
             'label_off' => esc_html__('No', 'deliciko'),
             'default'   => 'yes',
            
         ]
      ); 
      $this->add_control('desc_limit',
            [
              'label'         => esc_html__( 'Description limit', 'deliciko' ),
              'type'          => Controls_Manager::NUMBER,
              'default'       => '10',
              'condition'     => [ 
                 'show_desc' => ['yes'] 
               ],
              
            ]
      );   
    
      $this->add_control('show_cat',
            [
                'label'     => esc_html__('Show category', 'deliciko'),
                'type'      => Controls_Manager::SWITCHER,
                'label_on'  => esc_html__('Yes', 'deliciko'),
                'label_off' => esc_html__('No', 'deliciko'),
                'default'   => 'yes',
            ]
        );

      $this->add_control('show_date',
        [
            'label'     => esc_html__('Show Date', 'deliciko'),
            'type'      => Controls_Manager::SWITCHER,
            'label_on'  => esc_html__('Yes', 'deliciko'),
            'label_off' => esc_html__('No', 'deliciko'),
            'default'   => 'yes',
        ]
     ); 

      $this->add_control(
         'show_author',
               [
                  'label'     => esc_html__('Show Author', 'deliciko'),
                  'type'      => Controls_Manager::SWITCHER,
                  'label_on'  => esc_html__('Yes', 'deliciko'),
                  'label_off' => esc_html__('No', 'deliciko'),
                  'default'   => 'no',
         
               ]
         );

      $this->add_control('show_readmore',
                  [
                     'label'     => esc_html__('Show Readmore', 'deliciko'),
                     'type'      => Controls_Manager::SWITCHER,
                     'label_on'  => esc_html__('Yes', 'deliciko'),
                     'label_off' => esc_html__('No', 'deliciko'),
                     'default'   => 'yes',
            
                  ]
            );   

       
      $this->end_controls_section();
      
      $this->start_controls_section('style_title_section',
			[
				'label' => esc_html__( 'Title', 'deliciko' ),
				'tab' => Controls_Manager::TAB_STYLE,
			]
      ); 
      
      $this->add_control(
         'post_text_color',
         [
             'label' => esc_html__('Title color', 'deliciko'),
             'type' => Controls_Manager::COLOR,
             'default' => '',
             'selectors' => [
                  '{{WRAPPER}} .post .entry-title a' => 'color: {{VALUE}};',
             ],
         ]
        );

      $this->add_control(
         'post_text_color_hover',
            [
               'label'     => esc_html__('Title hover', 'deliciko'),
               'type'      => Controls_Manager::COLOR,
               'default'   => '',
               'selectors' => [
                  '{{WRAPPER}} .post .entry-title a:hover' => 'color: {{VALUE}};',
            
               ],
            ]
        );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'title_typography',
         'selector'	 => '{{WRAPPER}} .post .entry-title',
         ]
      );
     
      $this->end_controls_section();
     
      $this->start_controls_section('style_content_section',
         [
            'label' => esc_html__( 'Content', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
            'condition'     => [ 
               'show_desc' => ['yes'] 
             ],
         ]
      ); 
      
      $this->add_control(
         'post_content_color',
         [
             'label' => esc_html__('Content color', 'deliciko'),
             'type' => Controls_Manager::COLOR,
             'default' => '',
             'selectors' => [
                  '{{WRAPPER}} .post .entry-content' => 'color: {{VALUE}};',
             ],
         ]
        );

      $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'content_typography',
         'selector'	 => '{{WRAPPER}} .post .entry-content',
         ]
      );
      
      $this->end_controls_section();  

      $this->start_controls_section('style_readmore_section',
         [
            'label' => esc_html__( 'Readmore', 'deliciko' ),
            'tab' => Controls_Manager::TAB_STYLE,
            
         ]
      ); 

      $this->add_control(
         'post_readmore_color',
         [
             'label' => esc_html__('Readmore color', 'deliciko'),
             'type' => Controls_Manager::COLOR,
             'default' => '',
             'selectors' => [
                  '{{WRAPPER}} .post .post-footer a ' => 'color: {{VALUE}};',
             ],
         ]
        );

        $this->add_control(
         'post_readmore_color_hover',
         [
             'label' => esc_html__('Readmore hover', 'deliciko'),
             'type' => Controls_Manager::COLOR,
             'default' => '',
             'selectors' => [
                  '{{WRAPPER}} .post .post-footer a:hover' => 'color: {{VALUE}};',
             ],
         ]
        );

        $this->add_group_control(
         Group_Control_Typography::get_type(), [
         'name'		 => 'readmore_typography',
         'selector'	 => '{{WRAPPER}} .post .post-footer a',
         ]
      );

      $this->end_controls_section();  
    } 

    protected function render() {
     
    $settings        = $this->get_settings();
    $post_title_crop = $settings["post_title_crop"];
    $show_desc       = $settings["show_desc"];
    $desc_limit      = $settings["desc_limit"];
    $post_count      = $settings["post_count"];
    $show_date       = $settings["show_date"];
    $show_cat        = $settings["show_cat"];
    $show_author     = $settings["show_author"];
    $show_readmore   = $settings["show_readmore"];
    $post_col        = $settings["post_col"];
    $post_sort_by    = $settings["post_sort_by"];
    $post_category   = $settings["post_category"];
    $args = array(
        'numberposts'      => $post_count,
        'orderby'          => 'post_date',
        'order'            => $post_sort_by,
        'post_type'        => 'post',
        'post_status'      => 'publish',
        'suppress_filters' => true
    );
   if(is_array($post_category) && count($post_category)){
      $args['category__in'] = $post_category;
   }
     
   $recent_posts = wp_get_recent_posts( $args, ARRAY_A );
  
    ?>
<div class="row latest-blog">
  <?php  foreach( $recent_posts as $recent):   ?>
   <div class="col-lg-<?php echo esc_attr($post_col); ?> fadeInUp">
      <div class="post">
         <?php if(has_post_thumbnail($recent['ID'])): ?>
         <div class="post-media post-image">
            <a href="<?php echo get_permalink($recent["ID"]); ?>"><img src="<?php echo get_the_post_thumbnail_url( $recent['ID'], 'large' ); ?>" class="img-fluid" alt="<?php echo get_author_posts_url( $recent['post_author']); ?>"></a>
         </div>
        <?php endif; ?>
         <div class="post-body">
            <div class="post-meta">
               <?php if($show_author=='yes'): ?>
               <span class="post-author">
               <i class="icon icon-user"></i> 
               <a href="<?php echo get_author_posts_url( $recent['post_author']); ?>"> <?php echo get_the_author(); ?></a>
               </span>
               <?php endif; ?> 
               <?php if($show_cat=='yes'): ?>
               <span class="post-meta-cat">
                    <i class="icon icon-document"></i> 
                    <?php $cats = get_the_category($recent['ID']); ?>
                    <?php foreach($cats as $item): ?>
                      <?php echo esc_html($item->cat_name); ?>
                    <?php endforeach ?>  
               </span> 
               <?php endif; ?>
               <?php if($show_date == 'yes'): ?>
               <span class="post-meta-date">
                <i class="icon icon-clock"></i>
                  <?php echo get_the_date(get_option('date_format'), $recent['ID']); ?> 
               </span>
               <?php endif; ?>
            </div>
            <div class="entry-header">
               <h2 class="entry-title">
                  <a href="<?php echo get_post_permalink($recent["ID"]); ?>"><?php echo wp_trim_words( wp_kses($recent["post_title"],['p']), $post_title_crop, '');  ?> </a>
               </h2>
            </div>
            <!-- header end -->
            <?php if($show_desc=="yes"): ?>
            <div class="entry-content">
               <p> <?php echo wp_trim_words( wp_kses($recent["post_content"],['p']), $desc_limit, '');  ?>   </p>
            </div>
            <?php endif; ?> 
            <div class="post-footer">
               <?php if($show_readmore=="yes"): ?>
               <a href="<?php echo get_post_permalink($recent["ID"]); ?>" class="btn-link"> <?php echo esc_html__('Read More','deliciko'); ?> <i class="icon icon-arrow-right"></i></a>
               <?php endif; ?> 
            </div>
         </div>
         <!-- post-body end -->
      </div>
      <!-- post end-->
   </div>
   <?php endforeach; ?> 
</div> <!-- row end -->
   <?php 
    wp_reset_postdata();
    }

    public function getCategories(){
      
      $terms = get_terms( array(
                  'taxonomy'    => 'category',
                  'hide_empty'  => false,
                  'posts_per_page' => -1, 
          ) );

      
      $cat_list = [];
    
      foreach($terms as $post) {
     
          $cat_list[$post->term_id]  = [$post->name];
      }
      
      return $cat_list;

  } 

   
}