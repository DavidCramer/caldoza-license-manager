<?php

/**
 * Interface for data saving
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2016 David Cramer
 */
namespace caldoza\data;

interface save {


	/**
	 * save data to database
	 *
	 * @since 1.0.0
	 * @access public
	 */
	public function save_data();

	/**
	 * get the objects data store key
	 * @since 1.0.0
	 * @access public
	 * @return string $store_key the defined option name for this CLDZA_LMAN object
	 */
	public function store_key();

}

