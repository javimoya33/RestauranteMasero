<?php
/**
 * The header template for the theme
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>> 

    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta property="og:title" content="Restaurante Masero" />
        <meta property="og:image" content="https://www.restaurantemasero.com/wp-content/uploads/2022/11/3c9493b9-82d0-4842-a189-f2935f0d1b52.jpg" />
		<?php wp_head(); ?>
    </head>

    <body <?php body_class(); ?>>

	<?php 
         
      $header_style             = deliciko_option('header_layout_style', 'standard');
      $page_override_header     = deliciko_meta_option(get_the_ID(),'page_header_override');
      $page_header_layout_style = deliciko_meta_option(get_the_ID(),'page_header_layout_style','standard');
     
    
      get_template_part( 'template-parts/headers/header', $header_style );
    ?>
    
