<?php
defined('_JEXEC') or die;

use Joomla\CMS\Form\FormField;
use Joomla\CMS\Http\HttpFactory;

class ZitatServiceFormFieldAuthorList extends FormField
{
    protected $type = 'ZitatServiceAuthorList';

    protected function getInput()
    {
        $http = HttpFactory::getHttp();
        $url = 'https://api.zitat-service.de/v1/authors?size=2000&language=de';
        $response = $http->get($url);

        $authors = [];
        if ($response->code == 200) {
            $data = json_decode($response->body);
            if (isset($data->authors)) {
                foreach ($data->authors as $author) {
                    $authors[$author->authorId] = "";
                    if (isset($author->lastname)) {
                        $authors[$author->authorId] .= $author->lastname;
                    }
                    if (isset($author->firstname)) {
                        $authors[$author->authorId] .= ", " . $author->firstname;
                    } 
                }
            }
        }

        $html = '<select name="' . $this->name . '" id="' . $this->id . '">';

        // Optional: Add a default or "choose" option
        $html .= '<option value="">*</option>';

        foreach ($authors as $id => $author) {
            // Use the author ID as the value and the author name as the display text
            $selected = ($this->value == $id) ? ' selected="selected"' : '';
            $html .= '<option value="' . $id . '"' . $selected . '>' . $author . '</option>';
        }
        $html .= '</select>';

        return $html;
    }
}
