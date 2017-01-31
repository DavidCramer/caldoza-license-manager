<?php

/**
 * Caldoza Main Class
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 */
class Caldoza {

	/**
	 * Holds instance of the class
	 *
	 * @since   1.0.0
	 *
	 * @var     Caldoza
	 */
	private static $instance;

	/**
	 * Holds the admin page object
	 *
	 * @since   1.0.0
	 *
	 * @var     \caldoza\ui\page
	 */
	private $admin_page;

	/**
	 * Caldoza constructor.
	 */
	public function __construct() {

		// create admin objects
		add_action( 'plugins_loaded', array( $this, 'register_admin' ) );
		// setup updaters
		add_action( 'admin_init', array( $this, 'update_plugin' ), 0 );
		// add required fields check
		add_action( 'caldoza_control_item_submit_license', array( $this, 'verify_license' ), 10, 2 );
	}

	/**
	 * Return an instance of this class.
	 *
	 * @since 1.0.0
	 *
	 * @return  Caldoza  A single instance
	 */
	public static function init() {

		// If the single instance hasn't been set, set it now.
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;

	}

	/**
	 * Verifies license details
	 *
	 * @since 1.0.0
	 *
	 * @param array $data The data to be verified
	 * @param \dbpt\ui\control\item $item The item object
	 */
	public function verify_license( $data, $item ) {

		$message = array();
		// check if a plugin is set
		if ( empty( $data['license']['plugin'] ) ) {
			$message[] = esc_html__( 'A plugin to license is required', 'caldoza-license-manager' );
		}
		// check has a key
		if ( empty( $data['license']['key'] ) ) {
			$message[] = esc_html__( 'A key is required to license a plugin', 'caldoza-license-manager' );
		} else {
			$plugin = $this->get_plugin( $data['license']['plugin'] );

			// check the key is valid
			$args    = array(
				'body' => array(
					'edd_action' => 'check_license',
					'item_name'  => $plugin['item_name'],
					'license'    => $data['license']['key'],
					'url'        => get_home_url(),
				),
			);
			$request = wp_remote_get( 'https://caldoza.net/', $args );
			if ( is_wp_error( $request ) ) {
				$message[] = $request->get_error_message();
			} else {
				// vet message
				$check_license = json_decode( wp_remote_retrieve_body( $request ), ARRAY_A );
				if ( empty( $check_license ) ) {
					$message[] = __( 'invalid response', 'caldoza' );
				} else {
					//check
					switch ( $check_license['license'] ) {
						case 'expired' :
							$message[] = sprintf(
								__( 'Your license key expired on %s.' ),
								date_i18n( get_option( 'date_format' ), strtotime( $licese['expires'], current_time( 'timestamp' ) ) )
							);
							break;
						case 'revoked' :
							$message[] = __( 'Your license key has been disabled.', 'caldoza' );
							break;

						case 'missing' :
							$message[] = __( 'Invalid license.', 'caldoza' );
							break;

						case 'invalid' :
						case 'site_inactive' :
							$message[] = __( 'Your license is not active for this URL.', 'caldoza' );
							break;

						case 'item_name_mismatch' :
							$message[] = __( 'This appears to be an invalid license key.', 'caldoza' );
							break;

						case 'no_activations_left':
							$message[] = __( 'Your license key has reached its activation limit.', 'caldoza' );
							break;

						default :
							$message[] = __( 'An error occurred, please try again.', 'caldoza' );
							break;

						case 'inactive':
						case 'valid':
							$args['body']['edd_action'] = 'activate_license';
							$request                    = wp_remote_get( 'https://caldoza.net/', $args );
							if ( is_wp_error( $request ) ) {
								$message[] = $request->get_error_message();
							} else {
								$license = json_decode( wp_remote_retrieve_body( $request ), ARRAY_A );
							}
							break;
					}
				}
			}
		}
		// remove empty
		$message = array_filter( $message );

		if ( ! empty( $message ) ) {
			wp_send_json_error( implode( '<br>', $message ) );
		}

		$data['license']['license'] = $license;

		// set data to item
		$item->child['config']->set_data( array( 'config' => $data ) );
	}

	/**
	 * get a single plugin
	 *
	 * @since 1.0.0
	 *
	 * @param string $slug The slug of the plugin to get
	 *
	 * @return array|null The details for the plugin or null if not found
	 *
	 */
	public function get_plugin( $slug ) {
		$list = $this->get_plugins();
		if ( ! empty( $list[ $slug ] ) ) {
			return $list[ $slug ];
		}

		return null;
	}

	/**
	 * fire off the filter to get all plugins
	 *
	 * @since 1.0.0
	 *
	 */
	public function get_plugins() {
		return apply_filters( 'caldoza_plugins', array() );
	}

	/**
	 * Register the admin pages
	 *
	 * @since 1.0.0
	 */
	public function register_admin() {

		$this->admin_page = caldoza()->add( 'page', 'caldoza-license-manager', $this->admin_core_page() );

	}

	/**
	 * @return caldoza
	 *
	 * @since 1.0.0
	 */
	public function admin_core_page() {

		$structure = array(
			'page_title' => __( 'Caldoza.net License Manager', 'caldoza-license-manager' ),
			'menu_title' => __( 'Caldoza.net Licensing', 'caldoza-license-manager' ),
			'base_color' => '#1565C0',
			'parent'     => 'options-general.php',
			'full_width' => true,
			'attributes' => array(
				'data-autosave' => true,
			),
			'header'     => array(
				'id'          => 'admin_header',
				'label'       => __( 'Caldoza.net License Manager', 'caldoza-license-manager' ),
				'description' => __( '1.0.0', 'caldoza-license-manager' ),
			),
			'style'      => array(
				'admin' => CLDZA_LMAN_URL . 'assets/css/admin.css',
			),
			'section'    => array(
				'license' => include CLDZA_LMAN_PATH . 'ui/license.php',
			),
		);

		return $structure;
	}

	/**
	 * get plugin list for selector
	 *
	 * @since 1.0.0
	 *
	 */
	public function get_plugin_choices() {
		$raw_list = $this->get_plugins();
		$list     = array();
		foreach ( $raw_list as $slug => $item ) {
			$list[ $slug ] = $item['item_name'];
		}

		return $list;
	}

	/**
	 * Init/register plugin updates
	 *
	 * @since 1.0.0
	 *
	 */
	public function update_plugin() {
		$licenses = $this->get_licensed();
		foreach ( $licenses as $slug => $license ) {
			if ( empty( $license['plugin'] ) ) {
				continue;
			}
			$args = array(
				'version'   => $license['plugin']['version'],
				'license'   => $license['key'],
				'item_name' => $license['plugin']['item_name'],
				'author'    => $license['plugin']['author'],
				'beta'      => false,
			);
			// setup the updater
			$edd_updater = new EDD_SL_Plugin_Updater( 'https://caldoza.net/', $license['plugin']['core'], $args );
		}
	}

	/**
	 * get licensed plugins
	 *
	 * @since 1.0.0
	 *
	 */
	private function get_licensed() {
		$data         = $this->admin_page->load_data();
		$licenses     = array();
		$raw_licenses = array();
		if ( ! empty( $data['license']['license'] ) ) {
			$raw_licenses = $data['license']['license'];
			if ( ! is_array( $raw_licenses ) ) {
				$raw_licenses = json_decode( $raw_licenses, ARRAY_A );
			}
		}

		foreach ( $raw_licenses as $license ) {
			if ( empty( $license['license'] ) ) {
				continue;
			}
			$plugin                                              = $this->get_plugin( $license['license']['plugin'] );
			$licenses[ $license['license']['plugin'] ]           = $license['license'];
			$licenses[ $license['license']['plugin'] ]['plugin'] = $plugin;

		}

		return $licenses;
	}
}

// init
Caldoza::init();
