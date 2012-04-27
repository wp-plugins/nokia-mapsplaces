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
if ((false === isset($_GET['placeid']) && false === isset($_GET['place_data']) && false === isset($_GET['href'])) || false === isset($_GET['iframeid'])) {
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

        <script src="http://api.maps.nokia.com/2.2.0/jsl.js?with=places,maps" type="text/javascript"></script>
        
        
        <link rel="stylesheet" type="text/css" media="all" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/nokia-mapsplaces/page/css/disableOptions.css" />
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
			// Center offsets for templates
			// To be removed when passing zoomLevel and tileType parameters do not overwrite other module params (like standard offsets)
			var templateOffsets = {
			"nokia.blue.place": {
								place:{
									x: 0,
									y: -124
								},
								address:{
									x: 0,
									y: -100
								}
							},
			"nokia.blue.extended": {
                        place:{
                            x: 250,
                            y: 0
                        },
                        address:{
                            x: 250,
                            y: 0
                        }
                    },

			"nokia.blue.compact": {
                        place:{
                            x: 0,
                            y: 45
                        },
                        address:{
                            x: 0,
                            y: 45
                        }
                    }

			}
            var template = "<?php echo $_GET['template'] ?>";

            var data = {
                appId: 'I5YGccWtqlFgymFvzbq1',
                authenticationToken: 'L6NaX3SgOkROXjtP-oLPSg',
				"template": template,
                <?php
				$placeHref = $_GET['href'];
				if ($placeHref) echo "href: '".html_entity_decode($placeHref)."',\n";
                else if($_GET['placeid']) echo "placeId: '{$_GET['placeid']}',\n";
                if($place_data) echo "place_data: {$place_data},\n";
                echo "sizes: ".stripslashes($_GET['sizes']).",\n";
                echo "displayOptions: '{$_GET['display_options']}'\n";
                ?>
            }
            
			
            
            var appCodeData = 'app_id=' + data.appId + '&app_code=' + data.authenticationToken;
            
			// href may not be defined for legacy places
			if (data.href) {
				data.href = data.href.replace(/(app_id=[^&]+&?)/, '').replace(/(app_code=[^&]+&?)/, '');
				var separator = data.href.match(/\?/) ? "&" : "?";
				data.href = data.href + separator + appCodeData;
			}
            
            if('auto' === data.sizes.width){
                var iframeid = document.getElementById('iframeid').getAttribute('content');
                var placesIframe = parent.document.getElementById('places_api_view'+iframeid);
                if(placesIframe){
                    data.sizes.width = placesIframe.offsetWidth;
                }
                
                data.sizes.width = 0 === data.sizes.width ? 220 : data.sizes.width;
            }

            var loadPlace = function(){
                if(data.displayOptions){
                    document.getElementById('placewidget').className = data.displayOptions;
                }
                nokia.places.settings.setAppContext({appId: data.appId, authenticationToken: data.authenticationToken});  //remove
                var place = new nokia.places.widgets.Place({
                    targetNode: 'placewidget',
                    template: data.template,
                    placeId: data.placeId,
                    href: data.href,
                    moduleParams: {
                        'Map': {
                            iconUrl: 'images/pin.png',
							centerOffset: templateOffsets[template]
				<?php 
					if ($_GET['zoomlevel']) echo ", zoom: {$_GET['zoomlevel']}";
					if ($_GET['tiletype']) echo ", tileType: '{$_GET['tiletype']}'";
				?>
                       }
                    },
                    onReady: function(){
                        if(data.place_data){
                          place.setData(data.place_data); 
                        }
                    },
                    onRender: function(){ 
                        jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-compact,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('width', data.sizes.width+'px')
                        jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('height', data.sizes.height+'px')
                        jQuery('#content .nokia-places-blue-map .nokia-place-map-container,#content .nokia-place-extended-details-container,#content .nokia-places-blue-compact').css('height', data.sizes.height+'px')
                    }
                });
                
            }
         
        </script>
    </body>
</html>