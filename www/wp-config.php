<?php
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache







/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'restauvcomu2022' );

/** Database username */
define( 'DB_USER', 'restauvcomu2022' );

/** Database password */
define( 'DB_PASSWORD', '7qeK8D5n2bvc3tTewl' );

/** Database hostname */
define( 'DB_HOST', 'restauvcomu2022.mysql.db' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

define('WP_HOME','https://www.restaurantemasero.com');
define('WP_SITEURL','https://www.restaurantemasero.com');

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Hz{2+8$XSyG%q?C/QyRjw!`>d/hjn]E+_[E{9}47mqv}2EBboc]*FqEd_(S$%yLJ' );
define( 'SECURE_AUTH_KEY',  '5,FiVz<J.8?[#Y|prL;UX2y2(p1X*cTV7v) u+%v.z.,(WUQz0[@z~NkK(oXjZTt' );
define( 'LOGGED_IN_KEY',    'A6KU3zA<Bn:h=w+MWOw_k1F_V-Uza({r`AMOa%iCPh)Re.[%=Zp-EJNYm*}:&p&0' );
define( 'NONCE_KEY',        'cP@$|[h~M2.MUdPNHq)Qv==yf8eS3V@XEw[XceV |_2VN:<7B?4|H@2KwQgO$B4c' );
define( 'AUTH_SALT',        'iuxkus!]ANJw8!{Zsq>]|n}uhz#YDGGajGB`)@Q`6Do(5?IM {SY*y;6Hu2`-p9n' );
define( 'SECURE_AUTH_SALT', '&VK0mn<d9;cexP#4u`4nT$P;qq`P:Z[^<#iQ)}i~yo/9Npo`NS#PV~+HibL~mV>V' );
define( 'LOGGED_IN_SALT',   'XvP>A60|$.f(u78R)ccu/YlV7/`r0-6;/tVk_ !$8]<X>1&_^4,^]]i_x%mk#7MC' );
define( 'NONCE_SALT',       'ga,ol&T-*!L6cd=}UYh Jwfi-U0TQXg&)Z&:O[E9M-^.YfHMA!+Dl<SlzH@Y,d/f' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'mase_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
