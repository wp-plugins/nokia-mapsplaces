<?php
/**
 *  
 * @package Nokia Places Plugin
 * @title Custom template iframe core
 * @author Nikolai Tihhomirov
 *
 */
//include wp-load.php
require_once(dirname(dirname(__FILE__)) . '/placesapi_config.php');
//Check GET
if ((false === isset($_GET['placeid']) && false === isset($_GET['place_data'])) || false === isset($_GET['iframeid'])) {
    wp_die(__("Not enough data"));
}

preg_match("#'width':\s?'(\d+)','height':\s?'(\d+)'#", stripslashes($_GET['sizes']), $size);

if($_GET['place_data_params']){
    $place_data = '';
    for($i = 1; $i <= $_GET['place_data_params']; $i++){
        $place_data .= $_GET['place_data_'.$i];
    }
    $place_data = stripslashes($place_data);
}


?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <!--Insert unique frameid for resize function -->
        <meta id="iframeid" content="<?php echo $_GET['iframeid'] ?>"/>
        <script src='<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/jquery.js'></script>
        <script type="text/javascript" src="http://api.maps.nokia.com/places/beta2/jsPlacesAPI.js"></script>
        <script src="http://api.maps.nokia.com/2.0.0/jsl.js?routing=none&positioning=none" type="text/javascript" charset="utf-8"></script>
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-places-plugin/page/css/disableOptions.css" />
        <style>
            body{
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body onload="loadPlace()">
        <!--Include custom template container -->
        <div id='content'><div id='placewidget'></div></div>

        <script type='text/javascript'>
            
            var data = {
                <?php
                if($_GET['placeid']) echo "placeId: '{$_GET['placeid']}',\n";
                if($place_data) echo "place_data: {$place_data},\n";
                echo "template: '{$_GET['template']}',\n";
                echo "sizes: ".stripslashes($_GET['sizes']).",\n";
                echo "displayOptions: '{$_GET['display_options']}'\n";
                ?>
            }

            if('auto' === data.sizes.width){
                var iframeid = document.getElementById('iframeid').getAttribute('content');
                var placesIframe = parent.document.getElementById('places_api_view'+iframeid);
                if(placesIframe){
                    data.sizes.width = placesIframe.offsetWidth;
                }
            }

            var loadPlace = function(){
                if(data.displayOptions){
                    document.getElementById('placewidget').className = data.displayOptions;
                }

                var place = new nokia.places.Place({
                    targetNode: 'placewidget',
                    template: data.template,
                    placeId: data.placeId,
                    moduleParams: {
                        'Map': {
                            iconUrl: 'images/pin.png'
                        }
                    },
                    onReady: function(){
                        if(data.place_data){
                          place.setData(data.place_data); 
                        }
                    },
                    onRender: function(){ 
                        jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('width', data.sizes.width+'px')
                        jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('height', data.sizes.height+'px')
                        jQuery('#content .nokia-places-blue-map .nokia-place-map-container,#content .nokia-place-extended-details-container').css('height', data.sizes.height+'px')
                    }
                });
                
            }
         
        </script>
    </body>
</html>