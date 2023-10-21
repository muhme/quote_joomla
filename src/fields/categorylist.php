<?php
defined('_JEXEC') or die;

use Joomla\CMS\Form\FormField;
use Joomla\CMS\Http\HttpFactory;

require_once dirname(__FILE__) . '/../helper.php';

class ZitatServiceFormFieldCategoryList extends FormField
{
    protected $type = 'ZitatServiceCategoryList';

    protected function getInput()
    {
        $http = HttpFactory::getHttp();
        $language = ZitatServiceHelper::getActualLanguage();
        $url = 'https://api.zitat-service.de/v1/categories?size=2000&language=' . $language;
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
