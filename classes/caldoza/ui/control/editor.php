<?php
/**
 * CLDZA_LMAN Control
 *
 * @package   controls
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 */
namespace caldoza\ui\control;

/**
 * WordPress Content Editor
 *
 * @since 1.0.0
 */
class editor extends \caldoza\ui\control\textarea {

	/**
	 * The type of object
	 *
	 * @since       1.0.0
	 * @access public
	 * @var         string
	 */
	public $type = 'editor';

	/**
	 * Returns the main input field for rendering
	 *
	 * @since 1.0.0
	 * @see \caldoza\ui\caldoza
	 * @access public
	 */
	public function input() {

		$settings = array( 'textarea_name' => $this->name() );
		if ( ! empty( $this->struct['settings'] ) && is_array( $this->struct['settings'] ) ) {
			$settings = array_merge( $this->struct['settings'], $settings );
		}

		ob_start();

		wp_editor( $this->get_value(), 'control-' . $this->id(), $settings );

		return ob_get_clean();

	}

	/**
	 * Define core CLDZA_LMAN scripts - override to register core ( common scripts for caldoza type )
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function set_assets() {

		// set scripts
		$this->assets['script']['editor-init']      = $this->url . 'assets/controls/editor/js/editor' . CLDZA_LMAN_ASSET_DEBUG . '.js';

		parent::set_assets();
	}

}
