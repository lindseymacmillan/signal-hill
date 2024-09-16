<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package signal-hill
 */

?>

	<footer class="site-footer">
		<div class="player">
			<audio src="#" style="display: none; visibility: hidden;"></audio>
			<button class="control">Play</button>
			<div class="information">
				<div class="track">
					<span id="title">Story Title</span> — 
					<span id="contributor">Contributor Name</span>
				</div>
				<div class="time">
					<span id="current-time">0:00</span> / 
					<span id="duration">0:00</span>
				</div>
				<div class="progress">
					<div class="bar" data-progress="20%"></div>
				</div>
			</div>
			<button id="transcript">Transcript</button>
			<button id="actions">Actions</button>

		</div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
