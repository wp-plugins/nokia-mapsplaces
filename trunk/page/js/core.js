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

    var showPlaceWidget = function(){
        jQuery('#headerStep2, #placeWidgetContainer').removeClass('hidden');
        jQuery('#map, #placeList, #headerStep1').addClass('hidden');
        jQuery('#wrapper').removeClass('mapEnabled');
    }

    var hidePlaceWidget = function(){
        if(widget){
          setLayout.call(jQuery('#layoutOptions li#layoutCompact')[0]);
        }
        else{
          setLayout.call(jQuery('#layoutOptions li#layoutBasic')[0]);
        }
        
        jQuery('#headerStep2, #placeWidgetContainer').addClass('hidden');
        jQuery('#map, #placeList, #headerStep1').removeClass('hidden');
        jQuery('#wrapper').addClass('mapEnabled');
    }

    var toogleDisplayOption = function(){
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
    var renderJSON = function(obj){
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
    var insertPlacesApiLink = function () {
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
        //check placeid
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
        
        for(var i in options){
            if(!options[i]){
                continue;
            }
            
            tagtext += i+'="'+options[i]+'" ';
        }
        tagtext += '] ';
                    
        if(widget && widget[1]){
            var node = win.document.getElementById(widget[1]);
            node.value = tagtext;
            
            if(node){
                var saveBtn = jQuery(node.parentNode.parentNode.parentNode).find('#savewidget');
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

    var closeOverlayWindow = function(){
        return parent.tb_remove()
    }

    var setLayout = function(){
        var activeId = jQuery('#layoutOptions li.active')[0].id;
        jQuery('#placeWidgetContainer').removeClass(activeId);
        jQuery('#placeWidgetContainer').addClass(this.id);
        
        jQuery('#layoutOptions li').removeClass('active');

        jQuery(this).addClass('active');
        activeTemplate = this.getAttribute('rel');
        placeWidget.setTemplate(activeTemplate, null, null, true);

        var checkbox,
            options = displayOptions[activeTemplate];
        jQuery('.checkboxContainer div').addClass('hidden');
        for(var i = 0, l = options.length; i < l; i++){
            jQuery('.checkboxContainer div[rel=' + options[i] + ']').removeClass('hidden');
            checkbox = jQuery('.checkboxContainer input[value=' + options[i] + ']')[0];
            checkbox.checked = true;
            toogleDisplayOption.call(checkbox)
        }
    }
    
    var getDisabledDisplayOptions = function(){
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
   
    var removeLabelText = function(){
        this.value = "";
        jQuery(this).removeClass('labelText');
//        jQuery(this).unbind('focus');
        
        jQuery('#fixedSizes .active').removeClass('active');
        activeSize = false;
    }
    
    var activateSize = function(){
        jQuery('#fixedSizes .active').removeClass('active');
        jQuery(this).addClass('active');
        activeSize = this._sizeIndex;
        
        var inputs = jQuery('.sizes input');
        inputs[0].value = '';
        inputs[1].value = '';
    }
    
    var fillSizes = function(){
        var el;
        for(var i = 0, l = sizes.length; i < l; i++){
            el = document.createElement('a');
            el._sizeIndex = i;
            
            el.innerHTML = sizes[i].label ? sizes[i].label : sizes[i].width + 'x' + sizes[i].height;
            jQuery('#fixedSizes')[0].appendChild(el);
            
            jQuery(el).bind('click', activateSize)
        }
    }

    var map = false,
        placeWidget;
    var loadMap = function(){
        var components = [
            new nokia.maps.map.component.Behavior(),
            new nokia.maps.map.component.ZoomBar()
        ];

        var rc = new nokia.maps.map.component.RightClick();
        components.push(rc);

        if (nokia.maps.search.Manager) {
            components.push(new nokia.maps.search.component.RightClick());
        }            

        map = new nokia.maps.map.Display(document.getElementById("map"), {
            'zoomLevel': 10, //zoom level for the map
            'center': [52.51, 13.4], //center coordinates,
            'components': components
        });

        var Page = nokia.maps.dom.Page,
        EventTarget = nokia.maps.dom.EventTarget,
        searchManager = new nokia.maps.search.Manager();

        var menuAction = function(observedManager, key, value) {
            if(value == "finished") {
                if (observedManager.locations.length > 0) {
                    var el = rc.findElement('rc-menu-item-header');

                    if(!el){
                        setTimeout(function(){
                            menuAction(observedManager, key, value)
                        }, 100);
                        return false;
                    }

                    Page(el);
                    EventTarget(el);

                    var obj = observedManager.locations[0];
                    el.addListener("click", function(evt) {
                        var place = {
                            additionalData: {},
                            location: {
                                address: obj.address,
                                displayPosition: obj.displayPosition
                            },
                            categories: [
                            {
                                iconURL: '../placesapi//css/img/wordpress/categoryicons/png_43x36_blue/Address.png'
                            }
                            ]
                        };
                        setPlaceData(place);

                        el.removeListener("click", arguments.callee, false);
                    }, false);


                }
            } else if(value == "failed") {
                alert("The request failed.");
            }
        }

        searchManager.addObserver("state", menuAction);

        rc.addObserver('hidden', function(pObj, pName, pValue){
            if(false !== pValue){
                return false;
            }

            var coords = map.pixelToGeo(pObj.node.offsetLeft, pObj.node.offsetTop);
            searchManager.reverseGeocode(coords);            
        })

        placeWidget = new nokia.places.Place({
            targetNode: 'placeWidget',
            moduleParams: {
                'Map': {
                    iconUrl: 'images/pin.png'
                }
            },
            template: 'nokia.blue.place'
        });

        var placeList = new nokia.places.PlaceList({
            targetNode: 'placeList',
            template: 'nokia.wordpress.placelist',
            map: map,
            perPage: 4,
            onRenderPage: function(){
                placeList.displayOnMap();
                jQuery('#placeList').removeClass('hidden');
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

        var searchBox = new nokia.places.SearchBox({
            targetNode: 'searchBox',
            template: 'nokia.wordpress.searchbox',                
            map: map,
            searchCenter: function () {
                return {
                    latitude: 52.516274,
                    longitude: 13.377678
                }
            },
            onResults: function (data) {
                document.getElementById('map').className = 'smallMap'
                placeList.setData(data);
            }
        });
    }

    var setPlaceData = function(data){
        //check placeid
        if (data.placeId) {
            jQuery('#layoutAdvanced').removeClass('hidden');
            placeWidget.setPlaceId(data.placeId);
        }else{
            //or use data only
            jQuery('#layoutAdvanced').addClass('hidden');
            placeWidget.setData(data);
        }
        
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

