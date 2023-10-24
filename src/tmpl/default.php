<?php // no direct access
/*
 * @licence GNI/GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
 */
defined( '_JEXEC' ) or die( 'Restricted access' ); ?>

<?php if ($quote): ?>
    <?php echo $quote; ?>
<?php else: ?>
    <p>template: No quote available.</p>
<?php endif; ?>
