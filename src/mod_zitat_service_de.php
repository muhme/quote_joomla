<?php
/*
 * mod_zitat_service_de.php
 * Feb/21/2008 - Oct/24/2023
 * 
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 *
 * todo: Can only be used once at the moment. Could be extended with module's id to enable multiple JavaScript event handlers. But I cannot get module's id at the moment.
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

use \Joomla\CMS\Factory;
use \Joomla\CMS\Form\FormHelper;
use \Joomla\CMS\Helper\ModuleHelper;

FormHelper::addFieldPath(JPATH_SITE . '/modules/mod_zitat_service_de/fields');
require_once dirname(__FILE__) . '/helper.php';

// TODO: correct to supress deprecated depending on error reporting or better on logging, and what about to have deprecated directly to the logs and not the user
$config = Factory::getConfig();
$errorReporting = $config->get('error_reporting');
if ($errorReporting != 'maximun') {
    // Suppress deprecated messages
    error_reporting(error_reporting() & ~E_DEPRECATED);
}

$quote = ZitatServiceHelper::getQuote($params);

require ModuleHelper::getLayoutPath('mod_zitat_service_de');
