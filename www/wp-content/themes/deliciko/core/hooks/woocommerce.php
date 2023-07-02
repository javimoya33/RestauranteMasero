<?php 

add_filter('woocommerce_add_to_cart_fragments', 'deliciko_woocommerce_header_add_to_cart_fragment');

function deliciko_woocommerce_header_add_to_cart_fragment( $fragments ) 
{
  
      ob_start(); ?>
      <a class="cart-contents" href="<?php echo wc_get_cart_url(); ?>" title="<?php esc_attr_e('View your shopping cart', 'deliciko'); ?>">
      <span class="icon icon-cart"></span>
      <sup><?php echo sprintf(_n('%d item', '%d', WC()->cart->cart_contents_count, 'deliciko'), WC()->cart->cart_contents_count);?></sup>
                           
      </a>

    <?php
    $fragments['a.cart-contents'] = ob_get_clean();
    return $fragments;
}