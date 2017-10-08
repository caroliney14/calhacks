ShopNifty version 1.0 10/01/2017

# ShopNifty

ShopNifty is a web app which simplifies and enhances clothes shopping! Simply enter the url of an image in the main screen search bar to receive visually similar results from popular online clothing stores. With one click of a button, receive dozens of query results that include a picture of the item captioned with the name of the item, price, and url to the specific result.

ShopNifty uses Microsoft Azure's Computer Vision API to process and tag images, and Webhose, a web scraping API, to collect data across multiple sites for items similar to the user's desired input image. Then, the resulting query data is parsed and outputted in a user-friendly format.

## How to Run Locally:
sudo python2.7 -m SimpleHTTPServer 80
