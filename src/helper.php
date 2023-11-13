<?php
/*
 * helper.php
 * Oct-21-2023 - Nov-13-2023
 *
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

define('ZITAT_SERVICE_MODULE_VERSION', '2.0.1');
// define('ZITAT_SERVICE_API_URL', 'http://host.docker.internal:3000/v1');
define('ZITAT_SERVICE_API_URL', 'https://api.zitat-service.de/v1');
// list of valid languages as from https://api.zitat-service.de/v1/languages
define('LANGUAGES', ['de', 'es', 'en', 'ja', 'uk']);

use \Joomla\CMS\Factory;
use \Joomla\CMS\Http\HttpFactory;
use \Joomla\CMS\Uri\Uri;
use \Joomla\Registry\Registry;

class ZitatServiceHelper
{
    /**
     * get actual language w/o locale and fall back to 'en' if not supported
     */
    public static function getActualLanguage()
    {
        // get actual used language from frontend or backend
        $language = Factory::getLanguage();
        $tag = $language->getTag();

        // from e.g. 'de-DE' extract the first two characters to get the language w/o country
        $langShort = substr($tag, 0, 2);

        // extracted language is valid or default to 'en'
        return in_array($langShort, LANGUAGES) ? $langShort : 'en';
    }

    /**
     * return HTML quote
     * e.g. <div class="quote">
     *        <div class="quotation">
     *          <a href="https://www.zitat-service.de/en/quotations/1127">
     *            It's nice to be important, but it's more important to be nice.
     *          </a>
     *        </div>
     *        <div class="source">John Cassis
     *        </div>
     *      </div>
     */
    public static function getQuote($params)
    {
        // advanced module parameters
        $height = $params->get('height');
        // use synchronous getHttp() or asynchronous JavaScript?
        $script = $params->get('script'); // boolean 0 or 1

        $url = ZITAT_SERVICE_API_URL . '/quote_html?contentOnly=true' .
            '&V_' . ZITAT_SERVICE_MODULE_VERSION .
            '_' . JVERSION .
            '_' . ($script ? 'A' : 'S'); // 'A'synchron JavaScript or Joomla 'S'ynchron
        $url = self::extendWithParams($url, $params);

        if ($script) {
            // asynchronous JavaScript
            $document = Factory::getDocument();
            // load asynchron and in the end
            $document->addScript(Uri::base() . 'modules/mod_zitat_service_de/js/zitatservice.js', [], ['defer' => 'false']);
            $style = isset($height) ? 'style="min-height: ' . htmlspecialchars($height, ENT_QUOTES, 'UTF-8') . ';" ' : '';
            return '<div id="zitat-service-data"' .
            ' url="' . htmlspecialchars($url, ENT_QUOTES, 'UTF-8') . '"' .
                '></div><div ' . $style . 'id="zitat-service"></div>';
        } else {
            // synchronous PHP
            try {
                $options = new Registry();
                $options->set('timeout', 3); // seconds
                $options->set('transport.curl', array(CURLOPT_FOLLOWLOCATION => 0)); // do not follow redirects
                $http = HttpFactory::getHttp($options, 'curl');
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
                        return self::ohDear($url, $response->code, $data['error']['message']);
                    }
                    // else use the entire returned content
                    return self::ohDear($url, 'Error', $response->body);
                } else {
                    // converts the JSON object into a PHP associative array
                    // from e.g. {"error":{"statusCode":500,"message":"Internal Server Error"}}
                    $data = json_decode($response->body, true);
                    // check if the required keys exist
                    if (isset($data['error']['message'])) {
                        // return only the error message
                        return self::ohDear($url, $response->code, $data['error']['message']);
                    }
                    // else e.g. HTTP/1.1 301 Moved Permanently
                    return self::ohDear($url, 'Error', $response->code, $response->body);
                }
            } catch (Throwable $t) {
                // handle Exceptions and Errors
                return self::ohDear($url, get_class($t), $t->getMessage());
            }
        }
        return self::ohDear($url, 'Error', 'End of getQuote()');
    }

    /**
     * Oh my dear!
     * shorten error $msg to 200 chars if needed and extend with $url
     * e.g. 500 Internal Server Error "http://host.docker.internal:3000/v1/quote_html?mod_zitat_service_2.0.1&language=de"
     */
    private static function ohDear($url, ...$params)
    {
        $processedParams = array_map(function ($param) {
            // if the parameter is a string and its length is more than 200 characters, truncate it
            if (is_string($param) && strlen($param) > 200) {
                return substr($param, 0, 200);
            }
            return $param;
        }, $params);
        return implode(' ', $processedParams) . ' "' . $url . '"';
    }

    /**
     * extend given $url with URL parameters
     */
    private static function extendWithParams($url, $params)
    {
        // module parameter for URL
        $user = trim($params->get('user') ?? '');
        $author = trim($params->get('author') ?? '');
        $category = trim($params->get('category') ?? '');
        $language = trim($params->get('language') ?? '');
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

        // enhanced module parameter for URL
        $target = trim($params->get('target') ?? '');

        if (!empty($category)) {
            $url .= "&categoryId=$category";
        }
        if (!empty($user)) {
            $url .= "&userId=$user";
        }
        if (!empty($author)) {
            $url .= "&authorId=$author";
        }
        if (!empty($target)) {
            $url .= "&target=$target";
        }
        return $url;
    }
}
