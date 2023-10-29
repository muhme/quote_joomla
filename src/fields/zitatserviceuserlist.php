<?php
/*
 * zitatserviceuserlist.php
 * Oct-25-2023
 *
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 */
defined('_JEXEC') or die;

use \Joomla\CMS\Form\FormField;
use \Joomla\CMS\Http\HttpFactory;

/*
 * Custom field which fetches all user login names with quotes from API to select one by ID.
 */
class JFormFieldZitatServiceUserList extends FormField
{
    protected $type = 'ZitatServiceUserList';

    protected function getInput()
    {
        $http = HttpFactory::getHttp();
        // Oct 24th 2023 we have 60 users with quotes, simple get them all in one request
        $url = ZITAT_SERVICE_API_URL . '/users?size=2000&';
        $response = $http->get($url);

        $users = [];
        if ($response->code == 200) {
            $data = json_decode($response->body);
            if (isset($data->users)) {
                foreach ($data->users as $user) {
                    $users[$user->id] = $user->login;
                }
            }
        }

        $html = '<select name="' . $this->name . '" id="' . $this->id . '">';

        // Optional: Add a default or "choose" option
        $html .= '<option value="">*</option>';

        foreach ($users as $id => $user) {
            // Use the user ID as the value and the login name as the display text
            $selected = ($this->value == $id) ? ' selected="selected"' : '';
            $html .= '<option value="' . $id . '"' . $selected . '>' . $user . '</option>';
        }
        $html .= '</select>';

        return $html;
    }
}
