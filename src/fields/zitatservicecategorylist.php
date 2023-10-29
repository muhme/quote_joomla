<?php
/*
 * zitatservicecategorylist.php
 * Oct-25-2023
 *
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 */
defined('_JEXEC') or die;

use \Joomla\CMS\Form\FormField;
use \Joomla\CMS\Http\HttpFactory;

require_once dirname(__FILE__) . '/../helper.php';

/*
 * Custom field which fetches all categories from API to select one by ID.
 */
class JFormFieldZitatServiceCategoryList extends FormField
{
    protected $type = 'ZitatServiceCategoryList';

    protected function getInput()
    {
        $http = HttpFactory::getHttp();
        $language = ZitatServiceHelper::getActualLanguage();
        // Oct 24th 2023 we have 570 categories, simple get them all in one request
        $url = ZITAT_SERVICE_API_URL . '/categories?size=2000&language=' . $language;
        $response = $http->get($url);

        $categories = [];
        if ($response->code == 200) {
            $data = json_decode($response->body);
            if (isset($data->categories)) {
                foreach ($data->categories as $category) {
                    $categories[$category->id] = $category->category;
                }
            }
        }

        $html = '<select name="' . $this->name . '" id="' . $this->id . '">';

        // Optional: Add a default or "choose" option
        $html .= '<option value="">*</option>';

        foreach ($categories as $id => $category) {
            // Use the category ID as the value and the category name as the display text
            $selected = ($this->value == $id) ? ' selected="selected"' : '';
            $html .= '<option value="' . $id . '"' . $selected . '>' . $category . '</option>';
        }
        $html .= '</select>';

        return $html;
    }
}
