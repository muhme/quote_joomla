/**
 * 
 *
 */ 
document.addEventListener("DOMContentLoaded", function () {
  var moduleData = document.getElementById("zitat-service-data");
  if (moduleData === undefined || moduleData === null) {
    console.error("Cannot find element by ID #zitat-service-data");
    return;
  }
  var url = moduleData.getAttribute("url");
  if (url === undefined || url === null) {
    console.error("Cannot find attribute url inside ID #zitatservicedata");
    return;
  }
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
    },
  })
    .then((response) => response.text())
    .then((htmlContent) => {
      const quote = document.getElementById("zitat-service");
      if (quote === undefined || quote === null) {
        console.error("Cannot find element by ID #zitat-service");
        return;
      }
      quote.innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error("Error fetching the data: ", error);
    });
});
