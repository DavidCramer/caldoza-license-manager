<?php
/**
 * License templates for admin
 *
 * @package   caldoza
 * @author    David Cramer
 * @license   GPL-2.0+
 * @link
 * @copyright 2017 David Cramer
 */

?>
<div class="caldoza-item-row caldoza-item-primary-row" data-row="{{license/plugin}}" style="padding: 6px 0px 0px;{{#is license/license/license value="valid"}}box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 5px 0 0 #8BC34A inset;{{else}}box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 5px 0 0 #f44336 inset;{{/is}}">
<div style="padding: 0px 12px;">
	<h4 class="caldoza-plugin-name">{{license/license/item_name}}</h4>
	<?php echo esc_html( 'Licensed to:'); ?>
	<strong>{{license/license/customer_name}}
		<small style="font-weight: normal; color: rgb(159, 159, 159); font-style: oblique;">{{license/license/customer_email}}</small>
	</strong>
</div>
<div style="padding: 0px 12px;">
	<?php echo esc_html( 'Expires:'); ?>
	<strong>{{license/license/expires}}</strong>
</div>

	<div style="text-align: right;">
		<span class="caldoza-item-delete caldoza-action-item" data-row="{{license/plugin}}"><span class="dashicons dashicons-trash"></span></span>
		<span class="caldoza-item-edit caldoza-action-item"><span class="dashicons dashicons-edit"></span></span>
	</div>
</div>
<div class="caldoza-item-row caldoza-item-delete-confirm" data-row="{{license/plugin}}" style="background-color: #fff;">
	<span class="caldoza-item-delete-cancel caldoza-action-item" data-row="{{license/plugin}}"><span class="dashicons dashicons-arrow-left"></span></span>
	<span class="caldoza-item-remove caldoza-action-item"><span class="dashicons dashicons-trash"></span> <?php esc_html_e( 'Confirm Delete', 'db-post-types'); ?></span>
</div>
