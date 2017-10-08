/* Authors: Elaine Chien, Yannan Tuo, Lance Xing, Caroline Zhou
Special thanks to Andres Castaneda

Resources:
https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/javascript 
https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
*/

// Calls webhose web scraper API
function getCrawlData(url, color, item, callback) {
    $.ajax({
        url: 'http://webhose.io/productFilter?token=ec0657cf-b883-4cb5-a61f-18b5c5a7c4e2&format=json&q=description%3A' + color + '%20' + item + '%20site%3A' + url
    }).done(function(data) {
        callback(data);
    }).fail(function() {
        console.log("Error");
    });
};

// Converts URL to JSON
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

//Checks to see if there are any relevant results
//var resultExists = false;

// Creates html text from tags
function getProductsHtmlForTag(url, colortag, itemtag) {
    return new Promise(function(resolve, reject) {
        getCrawlData(url, colortag, itemtag, function(data) {
            const products_html = data.products.map((product) => {
                if(product != null && product['name'] != null&& product['name'].toLowerCase().indexOf(colortag) != -1 && product['name'].toLowerCase().indexOf(itemtag) != -1){
                    //resultExists = true;
                    //console.log(resultExists);
                    return `<div class="product">
                        <div class="productimg"><a href=${product.url}><img src="${product.images[0]}"/></a></div>
                        <span class="url"><a href=${product.url}>${product.name}</a></span>
                        <span class="price">$${product.price}</span>
                        <div><a href=${product.url}>${product.source.site}</a></div>
                    </div>   
                `}                
            });
            //$("#responseTextArea").html(products_html.join("********<br />"));
            // return products_html.join("********<br />");
            resolve(products_html.join("<br />"));
        });
    });
};

// Calls Microsoft Azure Computer Vision API to process image
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
    document.querySelector("#sourceImage").src = sourceImageUrl;
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";
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

        // Create dictionary with popular clothing id tags
        clothesText = ["abaya", "anorak", "apron", "ascot", "tie", "ball", "gown", "bandanna", "baseball", "cap", "bathing", "battledress", "beanie", "bedclothes", "bell-bottoms", "belt", "beret", "Bermuda", "shorts", "bib", "bikini", "blazer", "bloomers", "blouse", "boa", "bonnet", "boot", "bow", "bow", "tie", "boxer", "shorts", "boxers", "bra", "bracelet", "brassiere", "breeches", "briefs", "buckle", "button", "button-down", "shirt", "caftan", "camisole", "camouflage", "cap", "gown", "cape", "capris", "cardigan", "cloak", "coat", "collar", "corset", "costume", "coveralls", "cowboy", "boots", "cowboy", "hat", "cravat", "crown", "cuff", "cuff", "links", "culottes", "cummerbund", "D", "dashiki", "diaper", "dinner", "jacket", "dirndl", "drawers", "dress", "shirt", "duds", "dungarees", "earmuffs", "earrings", "elastic", "evening", "gown", "fedora", "fez", "flak", "jacket", "flannel", "nightgown", "flannel", "shirt", "flip-flops", "formal", "frock", "fur", "coat", "gaiters", "galoshes", "garb", "gabardine", "garment", "garters", "gear", "getup", "gilet", "girdle", "glasses", "gloves", "gown", "halter top", "handbag", "handkerchief", "hat", "Hawaiian", "shirt", "hazmat", "headscarf", "helmet", "hem", "high heels", "hoodie", "hook", "hosiery", "gown", "houndstooth", "housecoat", "jacket", "jeans", "jersey", "jewelry", "jodhpurs", "jumper", "jumpsuit", "kerchief", "khakis", "kilt", "kimono", "kit", "knickers", "lab coat", "lapel", "leather", "jacket", "leggings", "leg warmers", "leotard", "life jacket", "lingerie", "loafers", "loincloth", "longjohns", "long underwear", "miniskirt", "mittens", "moccasins", "muffler", "mumu", "neckerchief", "necklace", "nightgown", "nightshirt", "onesies", "outerwear", "outfit", "overalls", "overcoat", "overshirt", "pajamas", "pants", "pantsuit", "pantyhose", "parka", "pea coat", "peplum", "petticoat", "pinafore", "pleat", "pocket", "pocketbook", "polo shirt", "poncho", "poodle skirt", "porkpie hat", "pullover", "pumps", "purse", "raincoat", "ring", "robe", "rugby", "shirt", "sandals", "sari", "sarong", "scarf", "school", "uniform", "scrubs", "shawl", "sheath", "dress", "shift", "shirt", "shoe", "shorts", "shoulder", "pads", "shrug", "singlet", "skirt", "slacks", "slip", "slippers", "smock", "snaps", "sneakers", "sock", "sombrero", "spacesuit", "Stetson", "hat", "stockings", "stole", "sunbonnet", "sundress", "sunglasses", "sun", "hat", "suspenders", "sweater", "sweatpants", "sweatshirt", "sweatsuit", "swimsuit", "T-shirt", "tam", "tank top", "teddy", "threads", "tiara", "tie", "tie", "clip", "tights", "toga", "togs", "coat", "top hat", "train", "trench coat", "trunks", "turtleneck", "tutu", "trousers", "trunks", "tube", "tunic", "turban", "turtleneck", "shirt", "tux", "tuxedo", "tweed", "jacket", "twill", "twin", "set", "umbrella", "underclothes", "undershirt", "underwear", "uniform", "veil", "Velcro", "vest", "vestments", "visor", "waders", "waistcoat", "wear", "wedding", "gown", "Wellingtons", "wetsuit", "white", "tie", "wig", "windbreaker", "woollens", "wrap", "yoke", "zipper", "zoris"];
        // Create dictionary with basic color id tags
        colorText = ["red", "orange", "yellow", "green", "blue", "purple", "teal", "black", "white", "pink", "brown"]
        var colortag = null;
        var clothingtag = null;

        // Updates tags_to_use to first clothes or color tag encountered, which will also have highest confidence
        const tags_to_use = data['description']['tags'].filter((tag) => {
            var color = colorText.indexOf(tag.toLowerCase()) != -1 && colortag == null;
            if (color) {
                colortag = tag.toLowerCase();
            }
            var clothes = clothesText.indexOf(tag.toLowerCase())!= -1 && clothingtag == null;
            if (clothes) {
                clothingtag = tag.toLowerCase();
            }
            return;
        })

        // Calls web scraping API with popular clothing stores
        var html1 = getProductsHtmlForTag("urbanoutfitters.com", colortag, clothingtag);
        var html2 = getProductsHtmlForTag("nike.com", colortag, clothingtag);
        var html3 = getProductsHtmlForTag("lulus.com", colortag, clothingtag);
        /*var html4 = getProductsHtmlForTag("shop.nordstrom.com", colortag, clothingtag);
        var html5 = getProductsHtmlForTag("target.com", colortag, clothingtag);
        var html6 = getProductsHtmlForTag("walmart.com", colortag, clothingtag);*/
        const promises = [html1, html2, html3];
        //const promises = [html1, html2, html3, html4, html5, html6];
            Promise.all(promises).then(function(results) {
                $("#responseTextArea").html(results.join(""));
        });

        // Check to see if no results appeared
        /*if (!resultExists) {
            const products_html = `<div class="product">
                    <span class="url">Sorry, we were unable to find suitable results! :(</span>
                </div>`;   
            $("#responseTextArea").html(products_html);

        } else {
            const promises = [html1, html2, html3];
            Promise.all(promises).then(function(results) {
                console.log(results);
                $("#responseTextArea").html(results.join(""));
            //});
        //}
        
        // For debugging, print out entire json
        //$("#responseTextArea").html(JSON.stringify(data['description']['tags'], null, 2));*/
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
