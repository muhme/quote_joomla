<?php

defined('_JEXEC') or die;

class ZitatServiceHelper
{
    /**
     * get actual language w/o locale and fall back to "en" if not supported
     */
    public static function getActualLanguage()
    {
        $language = JFactory::getLanguage();
        $tag = $language->getTag();

        // Extract the first two characters to get the language shorthand
        $langShort = substr($tag, 0, 2);

        // List of valid languages
        $validLanguages = ['de', 'es', 'en', 'ja', 'uk'];

        // Check if the extracted language is in the valid list or default to 'en'
        return in_array($langShort, $validLanguages) ? $langShort : 'en';
    }
}
