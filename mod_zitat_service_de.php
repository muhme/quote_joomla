<?php
/*
 * mod_zitat_service_de.php
 * Joomla 2.5 Module to show fortune quotation
 * version: 1.3
 * Heiko Lübbe
 * http://www.zitat-service.de
 * Feb/21/2008 - Apr/4/2013
 *
 * todo: Can only be used once at the moment. Could be extended with module's id to enable multiple JavaScript event handlers. But I cannot get module's id at the moment.
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

$document = JFactory::getDocument();
$modbase = ''.JURI::base().'modules/mod_zitat_service_de/';

$run = "http://www.zitat-service.de/quote?content_only=true&encoding=UTF-8";

$script   = $params->get('script'); // boolean 0 or 1
$category = trim($params->get('category'));
$user     = trim($params->get('user'    ));
$author   = trim($params->get('author'  ));
$window   = trim($params->get('window'  ));
$height   = trim($params->get('height'   ));

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
                           'User-Agent: mod_zitat_service_de_1.3'
          )
      ));
  // warnings like the typical following one are removed by @ before function
  // Warning: file_get_contents(http://www.zitat-service.de/quote.cgi?content_only=true): failed to open stream: HTTP request failed!
  $quote = file_get_contents($run, 0, $ctx);
  if(false == ($quote = @file_get_contents($run, 0, $ctx))) {
    // PHP like exception handler wich gives everytime a quote as result.
    $quote = '
      <!-- Problem with getting the quote from file_get_contents(), typically timeout. -->
      <div class="quote">
        <div class="quotation"><a href="http://www.zitat-service.de/quotation/show/839" target="_parent">Wer Fehler finden will, findet sie auch im Paradies.</a></div>
        <div class="source"><a href="http://de.wikipedia.org/wiki/Henry_David_Thoreau" target="_parent">Henry David Thoreau</a>, zugeschrieben</div>
      </div>';
  }

} else {
  // use JavaScript or noscript tag if JavaScript is also disabled

  $run = str_replace('content_only=true', 'content_only=JavaScriptFunction', $run);
  $style = empty($height) ? "" : " style=\\\"min-height: $height;\\\" ";
  
  $quote = '
    <script type="text/javascript">
      //<![CDATA[
      document.write ("<div id=\"quoteId\" class=\"quote\"' . $style . '></div>");
      if ( typeof window.addEventListener != "undefined" ) {
        window.addEventListener( "load", loadQuote, false );
      } else if ( typeof window.attachEvent != "undefined" ) {
        window.attachEvent( "onload", loadQuote);
      } else {
        if ( window.onload != null ) {
          var oldOnload = window.onload;
          window.onload = function ( e ) { oldOnload( e ); loadQuote(); };
        } else {
          window.onload = loadQuote;
        }
      }
      // ]]>
    </script>
    <noscript>
      <!-- JavaScript is disabled on Web browser.-->
      <div class="quote">
        <div class="quotation"><a href="http://www.zitat-service.de/quotation/show/367" target="_parent">Der Weg ist das Ziel.</a></div>
        <div class="source"><a href="http://de.wikipedia.org/wiki/Konfuzius" target="_parent">Konfuzius</a></div>
      </div>
    </noscript>';

    /* for HTML head */
	$document->addScript($modbase . "js/lazyload-min.js");
    // onload event handler loadQuote(), which calls quote() JavaScript function, given from zitat-service, to fill div with id quoteId with the quotation
	$document->addScriptDeclaration('
      //<![CDATA[
      function loadQuote() {
        LazyLoad.js("' . $run .  '", function () { document.getElementById("quoteId").innerHTML = quote(); });
      }
      // ]]>
    ');
}

require(JModuleHelper::getLayoutPath('mod_zitat_service_de'));
