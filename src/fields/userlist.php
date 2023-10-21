<?php
defined('_JEXEC') or die;

use Joomla\CMS\Form\FormField;
use Joomla\CMS\Http\HttpFactory;

class ZitatServiceFormFieldUserList extends FormField
{
    protected $type = 'UserList';

    protected function getInput()
    {
        $http = HttpFactory::getHttp();
        $url = 'https://api.zitat-service.de/v1/users?size=2000';
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
