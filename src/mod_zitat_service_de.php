<?php
/*
 * mod_zitat_service_de.php
 * Joomla 3 Module to show fortune quotation
 * version: 2.0.0
 * @author Heiko Lübbe
 * @copyright (C) 2008- Heiko Lübbe
 * @licence GNI/GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
 * https://www.zitat-service.de
 * Feb/21/2008 - Oct/24/2023
 *
 * todo: Can only be used once at the moment. Could be extended with module's id to enable multiple JavaScript event handlers. But I cannot get module's id at the moment.
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

JFormHelper::addFieldPath(JPATH_SITE . '/modules/mod_zitat_service_de/fields');
require_once dirname(__FILE__) . '/helper.php';

// TODO: correct to supress deprecated depending on error reporting or better on logging, and what about to have deprecated directly to the logs and not the user
$config = JFactory::getConfig();
$errorReporting = $config->get('error_reporting');
if ($errorReporting != 'maximun') {
    // Suppress deprecated messages
    error_reporting(error_reporting() & ~E_DEPRECATED);
}

$quote = ZitatServiceHelper::getQuote($params);

require JModuleHelper::getLayoutPath('mod_zitat_service_de');
