=== Nokia Maps & Places ===
Contributors: Skowron, radek.adamczyk, marekkrysiuk, time4ostry
Tags: geo, location, maps, mapping, nokia, cross-browser, widget, places, nokia maps, address
Requires at least: 2.9
Tested up to: 3.3
Stable tag: 1.4.0

With Nokia Maps & Places plugin you can easily add places and addresses into your Wordpress posts or pages.

== Description ==

= Nokia Maps for Your Blog =

Nokia Maps & Places is a plugin powered by [Nokia Maps API](http://api.maps.nokia.com/en/places/intro.html). Add it to your blog to share information about your favorite places and to display maps.

= Features =

* Easy to install: no need for additional configuration, adds a button to media insert/upload section
* Easy to use: search using keywords, choose a place from a list and insert the place widget into the editor
* Three ready-to-use templates to customize your places widget
* Support for dashboard QuickPress
* All required data is stored in a shortcode, no additional tables needed
* Readers of your blog will be able to:
 * Pan or zoom a map
 * Rate a place
 * Use contact information (phone number, e-mail, Web page)
 * See a place in Nokia Maps
 * Share a place on Facebook or Twitter with one click
 * Share a place on any Web site using an URL
 * If a place allows booking (hotels, etc.) - initiate booking with one click

= Screencast =

http://www.youtube.com/watch?v=ukEc8TDd2iQ

== Installation ==
Just follow one of procedures described [here](http://codex.wordpress.org/Managing_Plugins#Installing_Plugins). We recommend using [WordPress built-in installer](http://codex.wordpress.org/Administration_Panels#Add_New_Plugins). Remember to activate a plugin once it is installed.

Note: when upgrading a plugin make sure you deactivate and then remove existing plugin version using [Plugins Panel](http://codex.wordpress.org/Administration_Panels#Plugins) in the [Administration Panels](http://codex.wordpress.org/Administration_Panels) of your WordPress site or manually, as described [here](http://codex.wordpress.org/Managing_Plugins#Uninstalling_Plugins). 

== Screenshots ==

1. Nokia Maps & Places button in Upload/Insert section of Add New Post
2. Place search with suggestion list
3. Search results
4. Customize your map
5. Nokia Maps&Places widget in a post

== Changelog ==
= 1.4.0 =
* Nokia Maps API (2.2.0) used to generate Map and Places information
* Introducing common identifier for both Places and Addresses (href parameter in shortcode)
* Zoom level and tile type are persistent (during place layout selection, changing zoom level or tile type will reflect in final Place/Address display) 
* Fixed Layout issues for place/address selection wizard
* Templates for place/address selection wizard are part of the plugin bundle
* Numbers added to result list items will reflect the numbered pins shown on the map
* Fixed layout issues for results with small amount of data
* Improved pin positioning within place's templates
* 'Results not found' are communicated to the user
= 1.3.1 =
* CSS bug fix
= 1.3.0 =
* Support for sidebar widgets.
* New compact template to use.
* Bug fixes.
= 1.0.2 =
* Fixed iframe url on frontend side - always use get_option('siteurl')
* New labels for Add place popup: display options (Customize your map) 
= 1.0.1 =
* Remove unused tinymce/colorbox
* Remove unnecessary wp_enqueue_script from nokia-mapsplaces.php to fix failing placesapi GET requests
* Replace nokia-places-plugin with nokia-mapsplaces
* New contributor: radek.adamczyk
= 1.0.0 =
* Initial release