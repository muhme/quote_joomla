<?php
/*
 * mod_zitat_service_de.php
 * Nov/24/2023
 * 
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 *
 * script.php - post-update script to work-around 
 *              https://github.com/joomla/joomla-cms/issues/40056
 *              Changelogurl not set in #__extensions when package updated
 */

// no direct access
defined('_JEXEC') or die;

class ModZitatServiceInstallerScript
{
    function postflight($type, $parent) 
    {
        // only on module update needed
        if ($type == 'update') {
            $this->updateChangelogUrl();
        }
    }

    // set changelogurl field by yourself
    private function updateChangelogUrl()
    {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true)
            ->update($db->quoteName('#__extensions'))
            ->set($db->quoteName('changelogurl') . ' = ' . $db->quote('https://raw.githubusercontent.com/muhme/quote_joomla/main/dist/changelog.xml'))
            ->where($db->quoteName('element') . ' = ' . $db->quote('mod_zitat_service_de'));
        $db->setQuery($query);
        $db->execute();
    }
}
