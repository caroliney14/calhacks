/**
 * curl --get --include 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=(site%3Awalmart.com%20OR%20cafepress.com)%20Shirt' \
 * -H 'Accept: text/plain'
 * getCrawlData("walmart.com", "Shirt", function(data) {
 *   console.log(data);
 * });
 */
function getCrawlData(url, color, item, callback) {
    console.log(color); 
    console.log(item);
    console.log(url);
    $.ajax({
        //url: 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=(site%3Aw${url}%20OR%20cafepress.com)%20${item}'
        //url: 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=name%3Aiphone'
        url: 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=description%3A' + color + '%20' + item + '%20site%3A' + url
        //url: `http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=site%3A${url}%20description%3A%20${color}%20${item}`
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

function getProductsHtmlForTag(url, colortag, itemtag) {
    return new Promise(function(resolve, reject) {
        getCrawlData(url, colortag, itemtag, function(data) {
            //if (data == null) {return;}
            const products_html = data.products.map((product) => {
                return `<div class="product">
                        <div class="productimg"><img src="${product.images[0]}"/></div>
                        <span class="url"><a href=${product.url}>${product.name}</a></span>
                        <span class="price">$${product.price}</span>
                    </div>;
            `});
            //$("#responseTextArea").html(products_html.join("********<br />"));
            // return products_html.join("********<br />");
            resolve(products_html.join("<br />"));
        });
    });
};

function processImage(sourceImageUrl) {
    $("#responseTextArea").html("Loading...");
    console.log('Processing image ${sourceImageUrl}');
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
        //https://stackoverflow.com/questions/34857458/reading-local-text-file-into-a-javascript-array
        /*
        var fs = require('fs');
        fs.readFile("./clothesdict.txt", function(text){
            var clothesText = text.split("\n");
        });
        fs.readFile("./colors.txt", function(text){
            var colorText = text.split("\n");
        });
        /*
          var clothesText;
        $.get('https://github.com/caroliney14/calhacks/blob/master/assets/clothesdict.txt', function(data) {
            clothesText = data.split('\n');
        });
        console.log(clothesText.toString());
        var colorText;
        $.get('https://github.com/caroliney14/calhacks/blob/master/assets/colors.txt', function(data) {
            colorText = data.split('\n');
        });
        */
        
        //var file = event.target.file;
        /*var reader = new FileReader(); 
        var clothesTextPre=reader.readAsText("clothesdict.txt");
        var colorTextPre =reader.readAsText("colors.txt");
        //varitems=txt.split(",");
        var clothesText=txt.split("\n");
        var colorText=txt.split("\n");*/

        clothesText = ["shirt", "dress"]
        colorText = ["red"]
    
        // available_tags = ["shirt", "nature"];
        var colortag = null;
        var clothingtag = null;
        const tags_to_use = data['description']['tags'].filter((tag) => {
            var color = colorText.indexOf(tag.toLowerCase()) != -1 && !colortag;
            if (color) {
                colortag = tag.toLowerCase();
            }
            var clothes = clothesText.indexOf(tag.toLowerCase())!= -1 && !clothingtag;
            if (clothes) {
                clothingtag = tag.toLowerCase();
            }
            return;
            //return (color || clothes) && tag_length;
            //og body: return available_tags.indexOf(tag.toLowerCase()) != -1;
        })
        console.log(clothingtag);
        var html1 = getProductsHtmlForTag("urbanoutfitters.com", colortag, clothingtag);
        var html2 = getProductsHtmlForTag("nike.com", colortag, clothingtag);
        var html3 = getProductsHtmlForTag("lulus.com", colortag, clothingtag);
        const promises = [html1, html2, html3];
        //const promises = list.join("<br />");


        /*const promises = tags_to_use.map(function(tag) {
           //return getProductsHtmlForTag("urbanoutfitters.com", tag);
            //red dress for urban and lulus
            //black shoes for nike and adidas
            var html1 = getProductsHtmlForTag("urbanoutfitters.com", tag);
            var html2 = getProductsHtmlForTag("nike.com", tag);
            var html3 = getProductsHtmlForTag("lulus.com", tag);
            var list = html1 + html2 + html3;
            //var html2 = getProductsHtmlForTag("adidas.com", tag);
            return list.join("<br />");
        });*/

        Promise.all(promises).then(function(results) {
            console.log(results);
            $("#responseTextArea").html(results.join(""));
        });

        //$("#responseTextArea").html(JSON.stringify(data['description']['tags'], null, 2));
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
