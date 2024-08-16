<?php
/**
 * Plugin Name:       Signal Hill
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       signal-hill
 *
 * @package           signal-hill
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function signal_hill_murmur_block_init() {	// For each directory in the build folder, register each block
	$blocks = array_diff( scandir( __DIR__ . '/build' ), array( '..', '.' ) );
	foreach ( $blocks as $block ) {
		$block_path = __DIR__ . '/build/' . $block;
		if ( is_dir( $block_path ) ) {
			register_block_type( $block_path );
		}
	}
}
add_action( 'init', 'signal_hill_murmur_block_init' );

function murmur_register_post_type() {
	register_post_type( 'issue', array(
		'labels' => array(
			'name' => __( 'Issues' ),
			'singular_name' => __( 'Issue' ),
		),
		'public' => true,
		'has_archive' => true,
		'supports' => array( 'editor', 'title', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-format-status',
		'template' => array(
			array( 'signal-hill/issue', array( 'wide' => true ) ),
		),
		'template_lock' => 'all',
	) );

	register_post_type( 'story', array(
		'labels' => array(
			'name' => __( 'Stories' ),
			'singular_name' => __( 'Story' ),
		),
		'public' => true,
		'has_archive' => true,
		'supports' => array( 'editor', 'title', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-format-status',
		'template' => array(
			array( 'signal-hill/story' ),
		),
		'template_lock' => 'all',
	) );

	register_post_type( 'contributor', array(
		'labels' => array(
			'name' => __( 'Contributors' ),
			'singular_name' => __( 'Contributor' ),
		),
		'public' => true,
		'has_archive' => true,
		'supports' => array( 'editor', 'title', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ),
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-format-status',
		'template' => array(
			array( 'signal-hill/contributor' ),
		),
		'template_lock' => 'all',
	) );

	register_post_meta(
		'story',
		'transcript',
		array(
			'show_in_rest'       => true,
			'single'             => true,
			'type'               => 'string',
			'sanitize_callback'  => 'wp_kses_post',
		)
	);

	register_post_meta(
		'story',
		'audioId',
		array(
			'show_in_rest'       => true,
			'single'             => true,
			'type'               => 'string',
			'sanitize_callback'  => 'wp_kses_post',
		)
	);

	register_post_meta(
		'story',
		'contributorsArr',
		array(
			'type'         => 'array',
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'integer',
					),
				),
			),
			'single'             => true,
			'sanitize_callback'  => 'wp_kses_post',
		)
	);

	register_post_meta(
		'story',
		'mediaArr',
		array(
			'type'         => 'array',
			'show_in_rest' => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'integer',
					),
				),
			),
			'single'             => true,
			'sanitize_callback'  => 'wp_kses_post',
		)
	);
}

add_action( 'init', 'murmur_register_post_type' );