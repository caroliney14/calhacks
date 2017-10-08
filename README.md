ShopNifty is a web app which simplifies clothes shopping! Simply enter the url of an image in the main screen search bar to receive visually similar results from popular online sites that vend articles of clothing. With one click of a button, receive dozens of query results, including a picture captioned with the name of the item, price, and url to the specific result.

ShopNifty uses Microsoft Azure's Computer Vision API to process and tag images, and Webhose, a web scraping API, to collect data across multiple sites for items similar to the user's desired input image. Then, the resulting query data is parsed and outputted in a user-friendly format.

# How to run locally
sudo python2.7 -m SimpleHTTPServer 80
