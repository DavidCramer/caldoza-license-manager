<?php
/**
 * CLDZA_LMAN Helper Functions
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @copyright 2016 David Cramer
 */


/**
 * CLDZA_LMAN Object class autoloader.
 * It locates and finds class via classes folder structure.
 *
 * @since 1.0.0
 *
 * @param string $class class name to be checked and autoloaded
 */
function caldoza_autoload_class( $class ) {
	$parts = explode( '\\', $class );
	$name  = array_shift( $parts );
	if ( file_exists( CLDZA_LMAN_PATH . 'classes/' . $name ) ) {
		if ( ! empty( $parts ) ) {
			$name .= '/' . implode( '/', $parts );
		}
		$class_file = CLDZA_LMAN_PATH . 'classes/' . $name . '.php';
		if ( file_exists( $class_file ) ) {
			include_once $class_file;

			return;
		}
	}
	$name = str_replace( '_', '-', strtolower( $name ) );
	if ( file_exists( CLDZA_LMAN_PATH . 'classes/' . $name . '.php' ) ) {
		include_once CLDZA_LMAN_PATH . 'classes/' . $name . '.php';
	}
}

/**
 * CLDZA_LMAN Helper to minipulate the overall UI instance.
 *
 * @since 1.0.0
 */
function caldoza() {
	$request_data = array(
		'post'    => $_POST,
		'get'     => $_GET,
		'files'   => $_FILES,
		'request' => $_REQUEST,
		'server'  => $_SERVER,
	);

	// init UI
	return \caldoza\ui::get_instance( $request_data );
}

/**
 * CLDZA_LMAN Helper to minipulate the overall UI instance.
 *
 * @since 1.0.0
 */
function caldoza_share() {
	// init UI
	return \caldoza\share\share::get_instance();
}