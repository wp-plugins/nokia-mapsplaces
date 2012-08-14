<?php
/**
 *  
 * @package Nokia Places Plugin
 * @title Core placesapi page
 * @author Nikolai Tihhomirov
 * 	
 * Searching for a place
 * Picking from a list
 * Inserting particular place
 * 
 */
//include wp-load.php
require_once(dirname(dirname(__FILE__)) . '/placesapi_config.php');
//check rights
if (!current_user_can('edit_pages') && !current_user_can('edit_posts'))
    wp_die(__("You are not allowed to be here"));
global $wpdb;
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
    	<meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--Insert core js and stylesheets -->
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/jquery-ui-1.8.16.custom.css" />
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/general.css" />
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/disableOptions.css" />
		<link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/wordpress.css" />

<script id="nokia-maps_searchbox" type="text/template">
	<div module="SearchBox" class="nokia-searchbox">
		<input class="nokia-searchbox-input" type="text" rel="searchbox-input"/>
		<input class="nokia-searchbox-button" type="button" rel="searchbox-button" value="___places.search___"/>
		<div rel="searchbox-list" class="nokia-searchbox-list">
			<div class="nokia-searchbox-list-border"></div>
		</div>
	</div>
</script>

<script id="nokia-maps_resultlist-old" type="text/template">
	<div module="List">
		 <div rel="list-pagination" class="nokia-pagination"></div>
        <ul each="{results.items}" rel="list-data" class="nokia-place-list">
            <li class="nokia-place-list-elem" rel="nokia-place-name">
				<div class="nokia-blue-category-pin">
					<div class="nokia-blue-categoryicon">
						<img url="{category.icon}.web.category_symbols.png" />
					</div>
				</div>
				<p fill="{title}" class="nokia-place-name"></p>
                <div class="nokia-place-address" fill="{vicinity}"></div>
               	<a class="nokia-wordpress-preview-label">Select this place</a>
				<div class="clearb"></div>
            </li>
        </ul>
    </div>
</script>

<script id="nokia-maps_resultlist" type="text/template">
	<div module="List">
		<div rel="list-pagination" class="nokia-pagination"></div>
        <ul each="{results.items}" rel="list-data" class="nokia-place-list">
            <li class="nokia-place-list-elem" rel="nokia-place">
				<div class="nokia-list-elem-left">
					<div class="nokia-blue-category-pin">
                            <span class="nokia-wordpress-list-index" addClass="{indexDigits()}" fill="{_index}"></span>
                     </div>
                     <div class="nokia-blue-categoryicon"><img url="{category.icon}.web.category_symbols.png" /></div>
				</div>
				<p fill="{title}" class="nokia-place-name"></p>
                <div class="nokia-place-address" fill="{vicinity}"></div>
                <a class="nokia-wordpress-preview-label" rel="nokia-place-select">Select this place</a>
				<div class="clearb"></div>
            </li>
        </ul>
    </div>
</script>

<!-- bubble displays raw search result -->
<script id="nokia-maps_bubble" type="text/template">
	<div class="nokia-place-bubble">
		<img url="{category.icon}.web.category_symbols_light.png" class="nokia-place-categicon">
		<h3 fill="{title}" class="nokia-place-name"></h3>
    	<span fill="{category.name}" class="nokia-place-category"></span>
    	<div fill="{vicinity}" class="nokia-bubble-summary"></div>
		<ul class="nokia-place-select">
			<li><a rel="select-lnk">Select this place</a></li>
			<li><a id="bubbleZoomIn" rel="zoom-lnk">Zoom in</a></li>
		</ul>
	</div>  
</script>


	<script src="http://api.maps.nokia.com/2.2.1/jsl.js?with=places,maps" type="text/javascript"></script>
		

    </head>
    <body>
    <style>
    	<!--[if lte IE 7]>
		.nokia-place-bubble .nokia-place-name{
			color: #000;
		}
		<![endif]-->
        .nokia-places-general-resultlist .nokia-place-name{
            cursor: pointer;
        }
    </style>
    
    <div id="wrapper" class="mapEnabled">

        <div id="headerStep1">
            <h1>Search for the place or address</h1>
            <div id="searchBox" class="nokia-places-wordpress-searchbox"></div>
        </div>
        <div id="headerStep2" class="hidden">
            <h1>Customize your map</h1>
            <a id="changePlace">Change Place / Address</a>
        </div>
        
        <input class="insert_place" id="insertPlace" type="button" Value="Insert">
        <div id="placeContainer">
            
            
            <div id="resultList" class="hidden nokia-places-wordpress-resultlist"></div>
			<div class="hidden nokia-places-wordpress-resultlist" id="no-results">
				<h1>Something's wrong</h1>
				<div id="error-msg">
					<p class="paragraph1">Didn't find anything for <span id="no-results-search-term"></span>.</p>
					<p>Please check your search term and try again. Adding city or country details could help.</p>
				</div>
			</div>
            <div id="map"></div>
            <div id="placeWidgetContainer" class="hidden">
                <div id="placeWidget"></div>
                
            <div class="settings">

                <div id="layoutTab" class="tab">
                    <div class="contentLeft">
                    	<h5>Layout</h5>
                        <ul id="layoutOptions">
                            <li id="layoutCompact" rel="nokia.blue.compact"></li>
                            <li id="layoutMap" rel="nokia.blue.map"></li>
                            <li id="layoutBasic" class="active" rel="nokia.blue.place"></li>
                            <li id="layoutAdvanced" rel="nokia.blue.extended"></li>
<!--
                            <li id="layoutFull" rel="nokia.blue.full"></li>
-->
                        </ul>
                        
                    </div>
                    <div class="contentLeft title">
                    	<h5>Title</h5>
                    	<input id="customTitle" type="text" name="title" class="input label">
<!--				
                        <input type="radio" name="theme" checked="1" value="dark"> Dark 
                        <input type="radio" name="theme" value="bright"> Bright 
-->
                    </div>
                </div>
                <div class="tab">
                    <h5>Display</h5>
                    <div class="contentLeft checkboxContainer">
                        <div rel="actions"><input type="checkbox" name="elements" value="actions"> Actions</div>
                        <div rel="contact"><input type="checkbox" name="elements" value="contact"> Contact info</div>
                        <div rel="description"><input type="checkbox" name="elements" value="description"> Description</div>
                        <div rel="reviews"><input type="checkbox" name="elements" value="reviews"> Reviews</div>
                        <div rel="thumbnail"><input type="checkbox" name="elements" value="thumbnail"> Photo</div>
                        <div rel="thumbnailList"><input type="checkbox" name="elements" value="thumbnailList"> Thumbnail list</div>
                        <div rel="controls"><input type="checkbox" name="elements" value="controls"> Map controls</div>
                    </div>
                    <div class="contentRight">
<!--
                        <input type="radio" name="theme" value="map"> Map 
                        <input type="radio" name="theme" value="image"> Image
-->
                    </div>
                </div>
                <div class="tab">
                    <h5>Size</h5>
                    <div class="contentLeft  fixedSizes" id="fixedSizes">
                    </div>
                    <div class="contentRight sizes">
                        <input id="customSizeWidth" type="text" name="width" value="width" class="labelText"> x <input id="customSizeHeight" type="text" name="height" value="height" class="labelText"> pixels 
                    </div>
                </div>

            </div>
                
            </div>
            
            <a type="button" class="button" id="cancelAction">Cancel</a>
            <a type="button" class="button-primary" id="insertAction">Finish</a>
            
        </div>
    </div>
	
	<script src='<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/jquery.js'></script>
	<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/js/locator.js"></script>
    <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/js/core.js"></script>
	
</body>
</html>