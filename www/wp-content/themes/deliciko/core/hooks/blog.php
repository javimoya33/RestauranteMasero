<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * hooks for wp blog part
 */

// if there is no excerpt, sets a defult placeholder
// ----------------------------------------------------------------------------------------
function deliciko_excerpt( $words = 20, $more = 'BUTTON' ) {
	if($more == 'BUTTON'){
		$more = '<a class="btn btn-primary">'.esc_html__('read more', 'deliciko').'</a>';
	}
	$excerpt		 = get_the_excerpt();
	$trimmed_content = wp_trim_words( $excerpt, $words, $more );
	echo deliciko_kses( $trimmed_content );
}


// change textarea position in comment form
// ----------------------------------------------------------------------------------------
function deliciko_move_comment_textarea_to_bottom( $fields ) {
	$comment_field		 = $fields[ 'comment' ];
	unset( $fields[ 'comment' ] );
	$fields[ 'comment' ] = $comment_field;
	return $fields;
}
add_filter( 'comment_form_fields', 'deliciko_move_comment_textarea_to_bottom' );


// change textarea position in comment form
// ----------------------------------------------------------------------------------------
function deliciko_search_form( $form ) {
    $form = '
        <form  method="get" action="' . esc_url( home_url( '/' ) ) . '" class="deliciko-serach">
            <div class="input-group">
                <input type="search" class="form-control" name="s" placeholder="' .esc_attr__( 'Search', 'deliciko' ) . '" value="' . get_search_query() . '">
                <span class="input-group-btn"><i class="fa fa-search"></i></span>
            </div>
        </form>';
	return $form;
}
add_filter( 'get_search_form', 'deliciko_search_form' );
