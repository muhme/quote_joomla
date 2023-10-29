/**
 * zitatservice.js
 * Oct-25-2023
 *
 * MIT License, Copyright (c) 2008 - 2023 Heiko Lübbe
 * https://github.com/muhme/quote_joomla
 *
 * url with parameters from PHP is fetched from DIV #zitat-service-data parameter url, e.g.
 * quote is written to documents DIV #zitat-service
 * in case of error, report to console.error plus try to write into documents DIV #zitat-service too, e.g.
 *   Error: No quote found for given parameters: language=uk (Ukrainian), authorId=243 (Конрад Аденауер).
 */
document.addEventListener("DOMContentLoaded", async function () {
  // get module DIV #zitat-service
  const quote_div = document.getElementById("zitat-service");
  var url = "";

  try {
    // get URL with parameters from PHP backend
    const moduleData = document.getElementById("zitat-service-data");
    if (!moduleData) {
      throw new Error("Cannot find element by ID #zitat-service-data");
    }
    url = moduleData.getAttribute("url");
    if (!url) {
      throw new Error(
        "Cannot find attribute url inside ID #zitat-service-data"
      );
    }

    // do the request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    });

    // check and proceed the response
    if (!response.ok) {
      let jsonResponse;
      try {
        jsonResponse = await response.json();
      } catch {
        // response is not parsable, simple return the stuff
        throw new Error(response.status);
      }
      if (jsonResponse && jsonResponse.error && jsonResponse.error.message) {
        // JSON packed error from API found
        throw new Error(jsonResponse.error.message);
      }
      // response is not parsable, simple return the stuff
      throw new Error(response.status);
    }
    const content = await response.text();

    // write the quote in document DIV #zitat-service
    if (!quote_div) {
      throw new Error("Cannot find element by ID #zitat-service");
    }
    quote_div.innerHTML = content;
  } catch (error) {
    // 1st protocol to console
    console.error("Error fetching the data: ", error.message);
    // 2nd try to write back
    if (quote_div) {
      quote_div.innerHTML = "Error: " + error.message + " \"" + url + "\"";
    }
  }
});
