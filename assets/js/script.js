
//var visionClient = new VisionServiceClient("70228e8d0c50425b97a0c373f9692887");

function processImage() {
// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
var subscriptionKey = "70228e8d0c50425b97a0c373f9692887";

// Replace or verify the region.
//
// You must use the same region in your REST API call as you used to obtain your subscription keys.
// For example, if you obtained your subscription keys from the westus region, replace
// "westcentralus" in the URI below with "westus".
//
// NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
// a free trial subscription key, you should not need to change this region.
var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

// Request parameters.
var params = {
    "visualFeatures": "Categories,Description,Color",
    "details": "",
    "language": "en",
};

// Display the image.
var sourceImageUrl = document.getElementById("inputImage").value;
document.querySelector("#sourceImage").src = sourceImageUrl;

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
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
})

.done(function(data) {
    // Show formatted JSON on webpage.
    var index = [];
    // build the index
    for (var x in data) {
    index.push(x);
    }
    //for(var x in index){
    //$("#responseTextArea").val(JSON.stringify(data['description']['tags'][0], null, 2));
    //}
    var tagData = (JSON.stringify(data['description']['tags'], null, 2)).split(",");
    //for(i = 0; i<tagData.size(); i++){
    //    $("#responseTextArea").val(tagData[i]);
    //}
    $("#responseTextArea").val(JSON.stringify(data['description']['tags'], null, 2));

})

.fail(function(jqXHR, textStatus, errorThrown) {
    // Display error message.
    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
    errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
    alert(errorString);
});
};