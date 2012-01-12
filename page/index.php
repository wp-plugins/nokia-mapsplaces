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
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <!--Insert core js and stylesheets -->
        <script type="text/javascript" src="http://api.maps.nokia.com/places/beta3/jsPlacesAPI.js"></script>

        <script src='<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/jquery.js'></script>
        <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/js/core.js"></script>
        <script src="http://api.maps.nokia.com/2.0.0/jsl.js?routing=none&positioning=none" type="text/javascript" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/jquery-ui-1.8.16.custom.css" />
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/general.css" />
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/disableOptions.css" />
    </head>
    <body>
    <style>
        .nokia-places-general-placelist .nokia-place-name{
            cursor: pointer;
        }
    </style>
    
    <div id="wrapper" class="mapEnabled">

        <div id="headerStep1">
            <h1>Search for the place or address</h1>
            <div id="searchBox"></div>
        </div>
        <div id="headerStep2" class="hidden">
            <h1>Customize your map</h1>
            <a id="changePlace">Change Place / Address</a>
        </div>
        
        <input class="insert_place" id="insertPlace" type="button" Value="Insert">
        <div id="placeContainer">
            
            
            <div id="placeList"></div>
            <div id="map"></div>
            <div id="placeWidgetContainer" class="hidden">
                <div id="placeWidget"></div>
                
            <div class="settings">

                <div id="layoutTab" class="tab">
                    <h5>Layout</h5>
                    <div class="contentLeft">
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
                    <div class="contentRight">
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

</body>
</html>