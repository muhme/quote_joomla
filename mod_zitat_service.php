<?php
/*
 * mod_zitat_service.php
 * Joomla 1.0 Module to show fortune quotation
 * version: 1.1.2
 * Heiko Lübbe
 * http://www.zitat-service.de
 * Feb/21/2008 - May/13/2009
 */

defined( '_VALID_MOS' ) or die( 'Direct Access to this location is not allowed.' );

$query = "SELECT * FROM #__modules WHERE module = 'mod_zitat_service' ";
$database->setQuery($query);
$rows = $database->loadObjectList();
$params = mosParseParams($rows[0]->params);

$run = "http://www.zitat-service.de/quote?content_only=true";

$category = trim($params->mod_zitat_service_category);
$user = trim($params->mod_zitat_service_user);
$author = trim($params->mod_zitat_service_author);
$window = trim($params->mod_zitat_service_window);
$script = $params->mod_zitat_service_script; // boolean 0 or 1

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
                           'User-Agent: mod_zitat_service_j10_1.1.2'
          )
      ));
  // Be warned as we don't wish to establish an own exception handler in case of timeout
  // you'll see the following error message on the screen if Debug-Setting is ON in Joomla.
  // Warning: file_get_contents(http://www.zitat-service.de/quote.cgi?content_only=true): failed to open stream: HTTP request failed!
  echo file_get_contents($run, 0, $ctx);
} else {
  // use JavaScript or noscript tag if JavaScript is also disabled
  $run = str_replace('content_only=true', 'content_only=JavaScript', $run);
  echo '<script src="' . $run . '" type="text/javascript"></script><noscript><!-- allow_url_fopen ist auf dem Server aus und JavaScript auf dem client.--><div class="quote"><div class="quotation"><a href="http://www.zitat-service.de/quotation/show/367" target="_parent">Der Weg ist das Ziel.</a></div><div class="source"><a href="http://de.wikipedia.org/wiki/Konfuzius" target="_parent">Konfuzius</a></div></div></noscript>';
}

?>
