<?php if (!defined('ABSPATH')) die('Direct access forbidden.');
/**
 * enqueue static files: javascript and css for backend
 */

wp_enqueue_style('iconfont', DELICIKO_CSS . '/iconfont.css', null, DELICIKO_VERSION);
wp_enqueue_style('deliciko-admin', DELICIKO_CSS . '/deliciko-admin.css', null, DELICIKO_VERSION);

wp_enqueue_script('deliciko-admin', DELICIKO_JS . '/deliciko-admin.js', array('jquery'), DELICIKO_VERSION, true);