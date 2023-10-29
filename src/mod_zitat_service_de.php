<?php
/*
 * mod_zitat_service_de.php
 * Feb/21/2008 - Oct/24/2023
 * 
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 *
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

use \Joomla\CMS\Factory;
use \Joomla\CMS\Form\FormHelper;
use \Joomla\CMS\Helper\ModuleHelper;

FormHelper::addFieldPath(JPATH_SITE . '/modules/mod_zitat_service_de/fields');
require_once dirname(__FILE__) . '/helper.php';

$quote = ZitatServiceHelper::getQuote($params);

require ModuleHelper::getLayoutPath('mod_zitat_service_de');
