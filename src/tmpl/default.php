<?php
/*
 * tmpl/default.php
 * Oct-21-2023
 *
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 */

// no direct access
defined( '_JEXEC' ) or die( 'Restricted access' ); ?>

<?php if ($quote): ?>
    <?php echo $quote; ?>
<?php else: ?>
    <p>template: No quote available.</p>
<?php endif; ?>
