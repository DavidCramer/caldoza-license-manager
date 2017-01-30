<?php
/**
 * License UI config
 *
 * @package   dbpt
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 */

$config = array(
	'label'       => __( 'License', 'db-post-types' ),
	'description' => __( 'Add / Update License', 'db-post-types' ),
	'script'      => array(
		'dbpt-license' => CLDZA_LMAN_URL . 'assets/js/license' . CLDZA_LMAN_ASSET_DEBUG . '.js',
	),
	'style'       => array(
		'dbpt-license' => CLDZA_LMAN_URL . 'assets/css/license' . CLDZA_LMAN_ASSET_DEBUG . '.css',
	),
	'control'     => array(
		'license' => array(
			'label'  => __( 'Licenses', 'db-post-types' ),
			'type'   => 'item',
			'config' => array(
				'label'       => __( 'Add License', 'db-post-types' ),
				'description' => __( 'Add / Update License', 'db-post-types' ),
				'width'       => 350,
				'height'      => 310,
				'template'    => CLDZA_LMAN_PATH . 'ui/license-template.php',
				'section'     => array(
					'license' => array(
						'control' => array(
							'plugin' => array(
								'label'       => __( 'Plugin', 'db-post-types' ),
								'description' => __( 'Select the plugin to license.', 'db-post-types' ),
								'type'        => 'select',
								'choices'     => $this->get_plugin_choices(),
							),
							'key'    => array(
								'label'       => __( 'Key', 'db-post-types' ),
								'description' => __( 'Enter a license key for DB Post Type.', 'db-post-types' ),
								'type'        => 'text',
								'attributes'  => array(
									'class' => 'regular-text dbpt-name',
								),
							),
						),
					),
				),
			),
		),
	),
);
/**
 * Filter UI config for the license modal
 *
 * @since 1.0.0
 *
 * @param array $config The tab config structure
 */
return apply_filters( 'dbpt_ui_license', $config );
