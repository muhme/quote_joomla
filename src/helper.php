<?php

define('ZITAT_SERVICE_MODULE_VERSION', '2.0.0');
define('ZITAT_SERVICE_API_URL', 'https://api.zitat-service.de/v1');

defined('_JEXEC') or die;

class ZitatServiceHelper
{
    /**
     * get actual language w/o locale and fall back to "en" if not supported
     * used for frontend module and backend module administration
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

    public static function getQuote($params)
    {

        $url = ZITAT_SERVICE_API_URL . '/quote_html?mod_zitat_service_' . ZITAT_SERVICE_MODULE_VERSION;
        $url = self::extendWithParams($url, $params);

        try {
            // don't follow redirect
            $options = new JRegistry();
            $options->set('timeout', 3); // seconds
            $options->set('transport.curl', array(CURLOPT_FOLLOWLOCATION => 0)); // do not follow redirects
            $http = JHttpFactory::getHttp($options, 'curl');
            $response = $http->get($url);

            if ($response->code == 200) {
                return $response->body;
            } else if ($response->code == 404) {
                // converts the JSON object into a PHP associative array
                // from e.g. {"error":{"statusCode":404,"name":"NotFoundError",
                //            "message":"No quote found for given parameters:
                //            language=es (Spanish), userId=12 (Ingridko)."}}
                $data = json_decode($response->body, true);
                // check if the required keys exist
                if (isset($data['error']['message'])) {
                    // return only the error message
                    return $data['error']['message'];
                }
                // else use the entire returned content
                return 'Error ' . substring($response->body, 0, 100);
            } else {
                // e.g. HTTP/1.1 301 Moved Permanently
                $quote = "Error "; //. substr($response->body, 0, 100) . $url;
            }
        } catch (Exception $e) {
            // handle exceptions if any
            return 'Exception ' . get_class($e) . ' ' . $e->getMessage() . ", url=[" . $url . "]";
        } catch (Error $e) {
            // handle errors like TypeError, ParseError, etc.
            return 'Error ' . $e->getMessage() . ", url=[" . $url . "]";
        }
    }

    /**
     * extend given $url with URL parameters
     */
    private static function extendWithParams($url, $params)
    {
        // module parameter
        $user = trim($params->get('user' ?? ''));
        $author = trim($params->get('author' ?? ''));
        $category = trim($params->get('category' ?? ''));
        $language = trim($params->get('language' ?? ''));
        if (!empty($language)) {
            if ($language != "all") {
                // use the explicit set language
                $url .= "&language=$language";
            }
            // uses all languages by not setting the language parameter
        } else {
            // as default use frontend language, or default to 'en' if not supported
            $url .= "&language=" . ZitatServiceHelper::getActualLanguage();
        }

        // enhanced module parameter
        $script = $params->get('script'); // boolean 0 or 1
        $window = trim($params->get('window' ?? ''));
        $height = trim($params->get('height' ?? ''));

        if (!empty($category)) {
            $url .= "&categoryId=$category";
        }
        if (!empty($user)) {
            $url .= "&userId=$user";
        }
        if (!empty($author)) {
            $url .= "&authorId=$author";
        }
        if (!empty($window)) {
            $url .= "&window=$window";
        }
        return $url;
    }
}
