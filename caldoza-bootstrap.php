<?php
/**
 * CLDZA_LMAN Bootstrapper
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 *
 */
// If this file is called directly, abort.
if ( defined( 'WPINC' ) ) {

	if ( ! defined( 'CLDZA_LMAN_ASSET_DEBUG' ) ) {
		if ( ! defined( 'DEBUG_SCRIPTS' ) ) {
			define( 'CLDZA_LMAN_ASSET_DEBUG', '.min' );
		} else {
			define( 'CLDZA_LMAN_ASSET_DEBUG', '' );
		}
	}


	// include caldoza helper functions and autoloader.
	require_once( CLDZA_LMAN_PATH . 'includes/functions.php' );

	// register caldoza autoloader
	spl_autoload_register( 'caldoza_autoload_class', true, false );

	// init
	\Caldoza::init();

}
