<?php
/*
 * mod_zitat_service.php
 * Joomla 1.5 Module to show fortune quotation
 * version: 1.1.3
 * Heiko Lübbe
 * http://www.zitat-service.de
 * Feb/21/2008 - June/27/2010
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

$run = "http://www.zitat-service.de/quote?content_only=true&encoding=UTF-8";

$category = trim($params->get('mod_zitat_service_category'));
$user     = trim($params->get('mod_zitat_service_user'    ));
$author   = trim($params->get('mod_zitat_service_author'  ));
$window   = trim($params->get('mod_zitat_service_window'  ));
$script   = $params->get('mod_zitat_service_script'); // boolean 0 or 1

if (!empty($category)) {
	$run .= "&category=$category";
};
if (!empty($user)) {
	$run .= "&user=$user";
};
if (!empty($author)) {
	$run .= "&author=$author";
};
if (!empty($window)) {
	$run .= "&window=$window";
};

// Use url_fopen or JavaScript?
if (!$script) {
  // Needs allow_url_fopen to be enabled in php.ini that we can open the URL for read.

  $server = $_SERVER['SERVER_NAME'];
  if (empty($server)) {
      $server = $_SERVER['HTTP_HOST'];
  }
  $ctx = stream_context_create(
      array(
          'http' => array(
              'timeout' => 3, // just in case to prevent too long waiting, set 3 secs
              'header'  => 'Referer: ' . $server . "\r\n" .
                           'User-Agent: mod_zitat_service_j15_1.1.2'
          )
      ));
  // warnings like the typical following one are removed by @ before function
  // Warning: file_get_contents(http://www.zitat-service.de/quote.cgi?content_only=true): failed to open stream: HTTP request failed!
  $quote = file_get_contents($run, 0, $ctx);
  if(false == ($quote = @file_get_contents($run, 0, $ctx))) {
    // PHP like exception handler wich gives everytime a quote as result.
    $quote = '<!-- Problem with getting the quote from file_get_contents(), typically timeout. --><div class="quote"><div class="quotation"><a href="http://www.zitat-service.de/quotation/show/839" target="_parent">Wer Fehler finden will, findet sie auch im Paradies.</a></div><div class="source"><a href="http://de.wikipedia.org/wiki/Henry_David_Thoreau" target="_parent">Henry David Thoreau</a>, zugeschrieben</div></div>';
  }
} else {
  // use JavaScript or noscript tag if JavaScript is also disabled
  $run = str_replace('content_only=true', 'content_only=JavaScript', $run);
  $quote = '<script src="' . $run . '" type="text/javascript"></script><noscript><!-- allow_url_fopen is disbaled on server and JavaScript is disabled on the client.--><div class="quote"><div class="quotation"><a href="http://www.zitat-service.de/quotation/show/367" target="_parent">Der Weg ist das Ziel.</a></div><div class="source"><a href="http://de.wikipedia.org/wiki/Konfuzius" target="_parent">Konfuzius</a></div></div></noscript>';
}

require(JModuleHelper::getLayoutPath('mod_zitat_service'));
