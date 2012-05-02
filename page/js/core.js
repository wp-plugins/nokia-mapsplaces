/*
* @package Nokia Places Plugin
* @title Core js file for index.php
* @author Nikolai Tihhomirov
* 
* Adds actions to buttons
* Resizes colorbox window
* Inserts place shortcode to the editor 
*
*/
jQuery( document ).ready( function(){

    nokia.places.settings.setAppContext({appId: 'I5YGccWtqlFgymFvzbq1', authenticationToken: 'L6NaX3SgOkROXjtP-oLPSg'});  //remove

    var widget = window.location.search.match(/widgetMode=([^&]+)/);

    var displayOptions = {
        "nokia.blue.compact": [
            'contact',
            'actions'
        ],
        "nokia.blue.map": [
            'controls'
        ],
        "nokia.blue.place": [
            'actions',
            'contact',
            'controls'
        ],
        "nokia.blue.extended": [
            'actions',
            'contact',
            'thumbnail',
            'controls'
        ],
        "nokia.blue.full": [
            'actions',
            'contact',
            'thumbnailList',
            'reviews',
            'description',
            'controls'
        ]
    }
    
    var sizes = [
            {width: 'auto', height: 370, label: 'Use blog size'}
        ],
        activeTemplate,
        activeSize;

    function showPlaceWidget(){
        jQuery('#headerStep2, #placeWidgetContainer').removeClass('hidden');
        jQuery('#map, #resultList, #headerStep1').addClass('hidden');
        jQuery('#wrapper').removeClass('mapEnabled');
		showDisplayOptions (widget ? 'nokia.blue.compact' : 'nokia.blue.place');
    }

    function hidePlaceWidget(){
	
        if(widget){
          setLayout.call(jQuery('#layoutOptions li#layoutCompact')[0]);
        }
        else{
          setLayout.call(jQuery('#layoutOptions li#layoutBasic')[0]);
        }
        
        jQuery('#headerStep2, #placeWidgetContainer').addClass('hidden');
        jQuery('#map, #resultList, #headerStep1').removeClass('hidden');
        jQuery('#wrapper').addClass('mapEnabled');
		// Re-create empty Place Widget
		var template = widget ? 'nokia.blue.compact' : 'nokia.blue.place';
		placeWidget = new nokia.places.widgets.Place({
            targetNode: 'placeWidget',
            moduleParams: {
                'Map': {
                    iconUrl: 'images/pin.png'
                }
            },
            template: template
        });
		showDisplayOptions (template);
    }

    function toogleDisplayOption(){
        var className = 'no-' + this.getAttribute('value');
        var container = jQuery('#placeWidgetContainer');
        if(true === this.checked){
            container.removeClass(className);
            return
        }
        container.addClass(className);
    }

    /**
     * renderJSON()
     * 
     * @package Nokia Places Plugin
     * Extract JSON object to {"key": "value"} type
     *
     */
    function renderJSON(obj){
        var keys = [];
        var retValue = "{";
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] == 'object') {
                    retValue += "'"+key+"': " +renderJSON(obj[key]) + ",";
                } else {
                    if('string' === typeof obj[key]){
                        obj[key] = obj[key].replace(/'/g, "\\\\\\'")
                    }
                    retValue += "'"+key + "': " + "'"+obj[key]+"',";
                }

                keys.push(key);
            }
        }
        //cut last coma
        if(',' === retValue.charAt(retValue.length - 1)){
            retValue = retValue.slice(0, -1);
        }
        return retValue + "}";
    }

    /**
     * format_place_shortcode
     * 
     * @package Nokia Places Plugin
     * Creates a shortcode for particular place and puts it into tinymce content
     *
     */
    function insertPlacesApiLink() {
        var data = placeWidget.getData();
		
        var tagtext = '[nokia-maps ';
        var win = window.dialogArguments || opener || parent || top;
        
        var size;
        if(false === activeSize){
            var s1 = parseInt(jQuery('#customSizeWidth')[0].value);
            var s2 = parseInt(jQuery('#customSizeHeight')[0].value);
            
            if(s1 && s2){
                size = renderJSON({width: jQuery('#customSizeWidth')[0].value, height: jQuery('#customSizeHeight')[0].value});
            }
            else{
                size = renderJSON(sizes[0]);
            }
            
        }
        else{
            size = renderJSON({
                width: sizes[activeSize].width,
                height: (jQuery('#layoutOptions li#layoutCompact').hasClass('active') ? 180 : sizes[activeSize].height) 
            });
        }
        
        var options = {
            template: activeTemplate,
            sizes:  size,
            display_options: getDisabledDisplayOptions()
        }
		
        // Now href should be given precedence
		options.href = currentHref.replace(/(app_id=[^&]+&?)/, '').replace(/(app_code=[^&]+&?)/, '');
		/*
		if (data.href) {
			options.href = data.href;
		} else
        if (data.placeId){
            options.placeId = data.placeId;
        }else{
            //or use data
            var place_data = renderJSON(data);
            
            var i = 0;
            do{
                i++;
                options['place_data_'+i] = place_data.substr(0, 255);
                place_data = place_data.substr(255, place_data.length);
            }while(place_data.length > 0);
            options.place_data_params = i;
        }
		*/
        
        for(var i in options){
            if(!options[i]){
                continue;
            }
            
            tagtext += i+'="'+options[i]+'" ';
        }
		var jslMap = placeWidget.template.getModules('Map')[0].jslMap;
		tagtext += ' zoomLevel="' + jslMap.zoomLevel + '" ';
		tagtext += ' tileType="' + ((jslMap.baseMapType == map.SATELLITE) ? 'satellite' : (jslMap.baseMapType == map.NORMAL) ?  'map' : 'terrain') + '" ';
        tagtext += '] ';
                    
        if(widget && widget[1]){
            var node = win.document.getElementById(widget[1]);
            node.value = tagtext;
            
            if(node){
                var saveId = widget[1].replace('placeData', 'savewidget');
                
                var saveBtn = jQuery(node.parentNode.parentNode.parentNode).find('input[name=savewidget]');  //, #savewidget, #'+saveId
                if(saveBtn){
                    saveBtn.trigger('click');
                }
            }
        }
        else{
            win.send_to_editor(tagtext);
        }

        closeOverlayWindow();
        return;
    }

    function closeOverlayWindow(){
        return parent.tb_remove()
    }
	
    function showDisplayOptions (template) {
		var checkbox,
				options = displayOptions[template];
			jQuery('.checkboxContainer div').addClass('hidden');
			for(var i = 0, l = options.length; i < l; i++){
				jQuery('.checkboxContainer div[rel=' + options[i] + ']').removeClass('hidden');
				checkbox = jQuery('.checkboxContainer input[value=' + options[i] + ']')[0];
				if(checkbox){
					checkbox.checked = true;
					toogleDisplayOption.call(checkbox)
				}
			}
	}

	function setLayout(){
	
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
	
        var activeId = jQuery('#layoutOptions li.active')[0].id;
        jQuery('#placeWidgetContainer').removeClass(activeId);
        jQuery('#placeWidgetContainer').addClass(this.id);
		jQuery('#placeWidget').removeClass();
        
        jQuery('#layoutOptions li').removeClass('active');

        jQuery(this).addClass('active');
        activeTemplate = this.getAttribute('rel');
        //placeWidget.setTemplate(activeTemplate, null, null, true);
		//Re-create placeWidget with a new template
		if (placeWidget.getData) {
			currentPlaceData = placeWidget.getData();
			placeWidget = new nokia.places.widgets.Place({
				targetNode: 'placeWidget',
				moduleParams: {
					'Map': {
						iconUrl: 'images/pin.png',
						centerOffset: templateOffsets[activeTemplate]
					}
				},
				template: activeTemplate
			});
			placeWidget.setData (currentPlaceData);
			showDisplayOptions(activeTemplate);
		}
    }
    
    function getDisabledDisplayOptions(){
        var ret = [],
            options = displayOptions[activeTemplate];

        for(var i = 0, l = options.length; i < l; i++){
            if(true === jQuery('.checkboxContainer input[value=' + options[i] + ']')[0].checked){
                continue;
            }
            ret.push('no-'+options[i]);
        }
        
        return ret.join(' ');
    }
	
    function getDocHeight(){
        var _D = document,
            body = _D.documentElement;
        return Math.max(
                body.scrollHeight, body.scrollHeight,
                body.offsetHeight, body.offsetHeight,
                body.clientHeight, body.clientHeight
                );        
    }
   
	function removeLabelText(){
        this.value = "";
        jQuery(this).removeClass('labelText');
        jQuery('#fixedSizes .active').removeClass('active');
        activeSize = false;
    }
    
    function activateSize(){
        jQuery('#fixedSizes .active').removeClass('active');
        jQuery(this).addClass('active');
        activeSize = this._sizeIndex;
        
        var inputs = jQuery('.sizes input');
        inputs[0].value = '';
        inputs[1].value = '';
    }
    
    function fillSizes(){
        var el;
        for(var i = 0, l = sizes.length; i < l; i++){
            el = document.createElement('a');
            el._sizeIndex = i;
            
            el.innerHTML = sizes[i].label ? sizes[i].label : sizes[i].width + 'x' + sizes[i].height;
            jQuery('#fixedSizes')[0].appendChild(el);
            
            jQuery(el).bind('click', activateSize)
        }
    }

    
    function createDispayedReg (places){
        var result = {},
            place;
        
        if(places instanceof Array){
            for(var i=0, l=places.length; i<l; i++){
                place = places[i];
                if(!result[place.href]){
                    result[place.href] = true;
                }
            }
        }
        
        return result;
    }
    
    
    var map = false,
        placeWidget,
		currentHref,
		currentPlaceData,
		infoBubbles;
    
    
    function onMarkerClickFactory(place){
        return function(ev){
            infoBubbles.addBubble('', new nokia.maps.geo.Coordinate(place.position.latitude, place.position.longitude, null, true));
            var contentNode = infoBubbles.findElement("nm_bubble_content");
            if(!contentNode){
                contentNode = infoBubbles.findElement("ovi_mp_bubble_content");
            }
            
            var bubbleWidget = new nokia.places.widgets.Place({
                template: 'nokia-maps_bubble'
            });
            
            bubbleWidget.setData(place, contentNode);
        }
    }
    
    
    function loadMap (){
        //initialize infobubbles 
        infoBubbles = new nokia.maps.map.component.InfoBubbles();
        
        var components = [
            new nokia.maps.map.component.Behavior(),
            new nokia.maps.map.component.ZoomBar(),
            infoBubbles
        ];

        var rc = new nokia.maps.map.component.RightClick();
        components.push(rc);
	
        if (nokia.maps.search.manager) {
            components.push(new nokia.maps.search.component.RightClick());
        }
		
		jQuery('#map').addClass('hidden');
        map = new nokia.maps.map.Display(document.getElementById("map"), {
            'zoomLevel': 2, //zoom level for the map
            'center': [50.083333, 14.416667], //center coordinates,
            'components': components
        });
		
		// Try to position a map
		map.set("minZoomLevel", 3);
		var l = new Locator({map:map});
		l.locate();
		jQuery('#map').removeClass('hidden');



        placeWidget = new nokia.places.widgets.Place({
            targetNode: 'placeWidget',
            moduleParams: {
                'Map': {
                    iconUrl: 'images/pin.png'
                }
            },
            template: widget ? 'nokia.blue.compact' : 'nokia.blue.place'
        });

        var resultList = new nokia.places.widgets.ResultList({
            targetNode: 'resultList',
            template: 'nokia-maps_resultlist',
			//template: "nokia.blue.resultlist",
            map: map,
            perPage: 6,
            onRenderPage: function(renderData, pageNumber){
                
                map.objects.clear();
                
                var displayedPlaces = createDispayedReg(renderData),
                    allPlaces = (resultList.data)? resultList.data.results.items : [],
                    i,
                    l,
                    place,
                    placeNum;
               
                
                //display all other places as small pins
                for(i=0, l=allPlaces.length; i<l; i++){
                    place = allPlaces[i];
                    if(!displayedPlaces[place.href]){
                        var mapCoords = new nokia.maps.geo.Coordinate(place.position.latitude, place.position.longitude, null, true),
                            mapMarker = new nokia.maps.map.Marker(mapCoords, {
                                icon: 'images/pin_small_round.png',
                                anchor: {
                                    x: 5.5,
                                    y: 7.5
                                }
                            });
                        mapMarker.addListener('click',onMarkerClickFactory(place));
                        map.objects.add(mapMarker);
                    }
                }
                
                renderData.reverse();
                placeNum = renderData.length;
                //display current place on the list
                for(i=0, l=renderData.length; i<l; i++){
                    place = renderData[i];
                    var mapCoords = new nokia.maps.geo.Coordinate(place.position.latitude, place.position.longitude, null, true),
                    mapMarker = new nokia.maps.map.StandardMarker(mapCoords, {
                        text: placeNum
                    });
                    mapMarker.addListener('click',onMarkerClickFactory(place));
                    map.objects.add(mapMarker);
                    placeNum--;
                }
                
				// Resize the map to fit all markers into a visible area (disabled until we get a better idea of how it should work)
				// map.zoomTo(map.getBoundingBox(), false);
                jQuery('#resultList').removeClass('hidden');
            },
            events: [
            {
                rel:'nokia-place-name',
                name:'click',
                handler: function(data){
                    setPlaceData(data);
                }
            }
            ]
        });

        var searchBox = new nokia.places.widgets.SearchBox({
            targetNode: 'searchBox',
            template: 'nokia-maps_searchbox',
            maxResults: 96,
            map: map,
            searchCenter: function () {
                return {
                    latitude: 52.516274,
                    longitude: 13.377678
                }
            },
            onResults: function (data) {
				if (!data.results.items.length) {
					jQuery('#resultList').addClass('hidden');
					jQuery("#no-results").removeClass("hidden");
					jQuery("#no-results-search-term").html(jQuery("input[rel='searchbox-input']").val());
					return;
				}
				jQuery("#no-results").addClass("hidden");
                document.getElementById('map').className = 'smallMap'
                resultList.setData(data);
            }
        });
    }
	
	// This might be removed when it becomes available in Nokia JS Places API
    function isPlace( jsonObject ) {
		var placeIdReg = new RegExp(/([\w\d]{8}-[\w\d]{32})/);
		if (jsonObject.href){
			return placeIdReg.test(jsonObject.href);
		}else if(jsonObject.placeId){
			return placeIdReg.test(jsonObject.placeId);
		}
		return false;
    }

    function setPlaceData(data){
        //Show Advanced/Extended layout only for POIs
		if (!data) return;
        if (isPlace(data)) {
            jQuery('#layoutAdvanced').removeClass('hidden');
        }else{
            //or use data only
            jQuery('#layoutAdvanced').addClass('hidden');
        }

		//destroy placeId to workaround placeId preference (remove when JS Places API starts using href whenever available)
		data.placeId = null;
		currentPlaceData = data;
		currentHref = data.href;
        placeWidget.setPlace(data);
        showPlaceWidget();
    }

    
    jQuery('.checkboxContainer input').bind('change', toogleDisplayOption);
    jQuery('#layoutOptions li').bind('click', setLayout);
    jQuery('#changePlace').bind('click', hidePlaceWidget);
    jQuery('.labelText').bind('focus', removeLabelText);
    jQuery('#insertAction').bind('click', insertPlacesApiLink);
    jQuery('#cancelAction').bind('click', closeOverlayWindow);

    loadMap();
    
    fillSizes();
    activateSize.call(jQuery('#fixedSizes a')[0]);
    
    if(widget){
        setLayout.call(jQuery('#layoutOptions li#layoutCompact')[0]);
        jQuery('#layoutTab').addClass('hidden');
    }
    else{
        setLayout.call(jQuery('#layoutOptions li#layoutBasic')[0]);
    }
    
});
//end of document ready