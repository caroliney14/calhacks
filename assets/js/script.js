/**
 * curl --get --include 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=(site%3Awalmart.com%20OR%20cafepress.com)%20Shirt' \
 * -H 'Accept: text/plain'
 * getCrawlData("walmart.com", "Shirt", function(data) {
 *   console.log(data);
 * });
 */
function getCrawlData(url, item, callback) {
    $.ajax({
        url: `http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=(site%3Aw${url}%20OR%20cafepress.com)%20${item}`
    }).done(function(data) {
        callback(data);
    }).fail(function() {
        console.log("Error");
    });
};


function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function getProductsHtmlForTag(url, tag) {
    return new Promise(function(resolve, reject) {
        getCrawlData(url, tag, function(data) {
            const products_html = data.products.map((product) => {
                return `
                    <div class="product">
                        <span class="url"><a href=${product.url}>${product.name}</a></span>
                        <span class="price">$${product.price}.00</span>
                    </div>
                `;
            });
            //$("#responseTextArea").html(products_html.join("********<br />"));
            // return products_html.join("********<br />");
            resolve(products_html.join("<br />"));
        });
    });
};

function processImage(sourceImageUrl) {
    $("#responseTextArea").html("Loading...");
    console.log(`Processing image ${sourceImageUrl}`);
    // Request parameters.
    var params = {
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    // Display the image.
    // var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";
    // Replace the subscriptionKey string value with your valid subscription key.
    var subscriptionKey = "70228e8d0c50425b97a0c373f9692887";
    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}'
    }).done(function(data) {
        console.log(data['description']['tags']);
        const available_tags = ["shirt", "nature"];

        const tags_to_use = data['description']['tags'].filter((tag) => {
            return available_tags.indexOf(tag.toLowerCase()) != -1;
        })

        const promises = tags_to_use.map(function(tag) {
            return getProductsHtmlForTag("walmart.com", tag);
        });

        Promise.all(promises).then(function(results) {
            console.log(results);
            $("#responseTextArea").html(results.join(""));
        });

        // $("#responseTextArea").val(JSON.stringify(data['description']['tags'], null, 2));
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};

$(document).ready(function() {
    let query = getJsonFromUrl(document.location);
    processImage(query.url);
});

/* Special thanks to Andres Castaneda

Other credits: 
https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/javascript 
*/
