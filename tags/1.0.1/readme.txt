=== Nokia Maps & Places ===
Contributors: Skowron, radek.adamczyk, marekkrysiuk, time4ostry
Tags: geo,	maps, mapping, nokia, cross-browser, widget, places, nokia maps
Requires at least: 2.9
Tested up to: 3.3
Stable tag: 1.0.1

With Nokia Maps & Places plugin you can easily add places and addresses into your Wordpress posts or pages.

== Description ==

= Nokia Maps for Your Blog =

Nokia Maps & Places is a plugin powered by [Nokia JS Places API](http://api.maps.nokia.com/places/). Add it to your blog to share information about your favorite places and to display maps.

For more information, check out [Nokia Maps & Places](https://projects.developer.nokia.com/wp_places).
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

http://www.youtube.com/watch?v=i0-CjbNOyPI&cc_load_policy=1

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
= 1.0.1 =
* Remove unused tinymce/colorbox
* Remove unnecessary wp_enqueue_script from nokia-mapsplaces.php to fix failing placesapi GET requests
* Replace nokia-places-plugin with nokia-mapsplaces
* New contributor: radek.adamczyk
= 1.0.0 =
* Initial release
