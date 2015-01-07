=== Nokia Maps & Places ===
Contributors: Skowron, radek.adamczyk, marekkrysiuk, time4ostry
Tags: geo, location, maps, mapping, nokia, cross-browser, widget, places, nokia maps, address
Requires at least: 3.1
Tested up to: 3.5.1
Stable tag: 1.7.0

With Nokia Maps & Places plugin you can easily add places and addresses into your Wordpress posts or pages.

== Description ==

= Nokia Maps for Your Blog =

Official Nokia Maps & Places plugin is powered by [Nokia Maps API](http://api.maps.nokia.com/). Add it to your blog to share information about your favorite places and to display maps.

= Features =

* Easy to install: no need for additional configuration, adds a button to media insert/upload section
* Easy to use: search using keywords or right click on the map, choose a place from a list, edit place title and insert the place widget into the editor
* Three ready-to-use templates to customize your places widget
* Use different map tiles including public transport and traffic information tiles
* Support for dashboard QuickPress
* All required data is stored in a shortcode, no additional tables needed
* Readers of your blog will be able to:
* Pan or zoom a map
* Rate a place
* Use contact information (phone number, e-mail, Web page)
* See a place in Nokia Maps
* Get directions on Nokia Maps
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
5. Nokia Maps & Places widget in a post
6. Shortcode example
7. Select any place with right-click and use it in your widget
8. Use any place and customize place name
9. Include Nokia Maps Traffic into your place widgets
10. Show public transport information in a widget

== Changelog ==
= 1.7.0 =
End of support Nokia Maps & Places plugin
= 1.6.7 =
* Bugfixes
= 1.6.6 =
* Bugfixes
= 1.6.5 =
* Performance improvements for place display
* Place search popup fix
* Other bugfixes
= 1.6.4 =
* Bugfixes
= 1.6.3 =
* Compatibility fix. Plugin is now compatible with newest wordpress versions.
= 1.6.2 =
* Bugfixes and improvements
= 1.6.1 =
* Fixing NOTICE errors when wordpress is running in debug mode
* Fixing bubble endless spinner when geo service fails
* Other minor bugfixes and improvements
= 1.6.0 =
* Switched to Nokia Maps API 2.2.1
* Switched to new geocoder 6.2
* Added Traffic and Public Transport in a wizard and in a place widget
* Added "Get directions" link in actions (opens Nokia Maps in a new window, current implementation has pop-up blocking issues)
* Bug fixes
= 1.5.0 =
* Geo IP Location, then browser language preference is used for initial map position
* Map Right Click location selection (possible coordinate selection when address is not available)
* Introducing preview bubble during result selection
* Possible place selection and zoom into place from the preview bubble
* More search results displayed on map
* Improved searching experience
* Rendered map icons are clickable
* Instant zooming to cities, countries and administration areas when searched
* Increasing Thickbox window and map size
* Introducing place title change
* Tile type on "Customize your map" set according to tile type on "Search for the place or address"
* Improved support for legacy addresses
* Fixed layout issues
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
