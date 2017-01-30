<?php
/**
 * CLDZA_LMAN WordPress Plugin
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 *
 * @wordpress-plugin
 * Plugin Name: Caldoza.net License Manager
 * Plugin URI:  http://cramer.co.za
 * Description: Manage licenses for plugins purchased at Caldoza.net
 * Version:     1.0.0
 * Author:      David Cramer
 * Author URI:  http://cramer.co.za
 * Text Domain: caldoza
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 */
// If this file is called directly, abort.
if ( defined( 'WPINC' ) ) {

	define( 'CLDZA_LMAN_CORE', __FILE__ );
	define( 'CLDZA_LMAN_PATH', plugin_dir_path( __FILE__ ) );
	define( 'CLDZA_LMAN_URL', plugin_dir_url( __FILE__ ) );
	define( 'CLDZA_LMAN_VER', '1.0.0' );

	// include caldoza bootstrap.
	require_once( CLDZA_LMAN_PATH . 'caldoza-bootstrap.php' );

}
