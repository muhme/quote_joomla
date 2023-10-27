<?php

defined('_JEXEC') or die;

use \Joomla\CMS\Form\FormField;
use \Joomla\CMS\Http\HttpFactory;

/*
 * Custom field which fetches all user login names with quotes from API to select one by ID.
 *
 * zitatserviceuserlist.php
 * Joomla 3/4/5 Module to show random quote
 * version: 2.0.0
 * @author Heiko Lübbe
 * @copyright (C) 2023- Heiko Lübbe
 * @licence GNI/GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
 * https://www.zitat-service.de
 * Oct/25/2023
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
