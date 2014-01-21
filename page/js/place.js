(function(){

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

  };

  function getUrlParams(){
  	var query = window.location.search,
  		querySplit,
  		single,
  		singleSplit,
  		value,
  		params = {};
  	if(query.charAt(0) === "?"){
  		query = query.substr(1, query.length);
  	}

  	querySplit = query.split("&");
  	for(var i=0, l=querySplit.length; i<l ;i++){
  		single = querySplit[i];
  		singleSplit = single.split("=");
  		value = singleSplit[1] ? decodeURIComponent(singleSplit[1].replace(/\+/g," ")).replace("&amp;","&") : "";
  		params[singleSplit[0].toLowerCase()] = jQuery('<span/>').text(value).html();
  	}

  	return params;
  }

  var $GET = getUrlParams(),
  	place_data_params = parseInt($GET['place_data_params'],10),
  	place_data = "",
  	data = {
  		template: $GET['template'],
          appId: 'uk8iCZheHETM0B63cPxG',
          authenticationToken: 'TGtRnNzFDZkZ1dRJaKvdTQ',
  		href: '',
  		placeId: $GET['placeid'],
  		sizes: $GET['sizes'] ? jQuery.parseJSON($GET['sizes'].replace(/\'/g,"\"")) : "",
  		displayOptions: $GET['display_options'],
  		zoomLevel: $GET['zoomlevel'] ? parseInt($GET['zoomlevel'], 10) : null,
  		tileType: $GET['tiletype'] || null
  	},
  	appCodeData = 'app_id=' + data.appId + '&app_code=' + data.authenticationToken,
  	iframeid = $GET['iframeid'],
  	placesIframe = parent.document.getElementById('places_api_view'+iframeid),
  	separator;

  if(data.href){
  	separator = data.href.match(/\?/) ? "&" : "?";
  	if(data.href.indexOf("app_id") === -1 && data.href.indexOf("app_code") === -1){
  		data.href = data.href + separator + appCodeData;
  	}
  }


  if('auto' === data.sizes.width){
      if(placesIframe){
          data.sizes.width = placesIframe.offsetWidth;
      }
      data.sizes.width = 0 === data.sizes.width ? 220 : data.sizes.width;
  }

  if(place_data_params > 0){
  	for(var i=1; i<=place_data_params; i++){
  		place_data += $GET['place_data_' + i];
  	}

  	data.place_data = jQuery.parseJSON(place_data);
  }

  function initWidget(placeData) {
  	var place = new nokia.places.widgets.Place({
  		targetNode: 'placewidget',
  		template: data.template,
  		moduleParams: {
  		    'Map': {
  		        iconUrl: 'images/pin.png',
  				centerOffset: templateOffsets[data.template],
  				zoom: data.zoomLevel,
  				tileType: data.tileType
  			}
  		},
  		onReady: function(){
  			place.setData(placeData);
  		},
  		onRender: function(){
  		    jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-compact,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('width', data.sizes.width+'px');
  		    jQuery('#content .nokia-places-blue-extended,#content .nokia-places-blue-extended .nokia-places-blue-map .nokia-place-map-container,#content .nokia-places-blue-map,#content .nokia-places-blue-place,#content .nokia-places-blue-place .nokia-place-map-container').css('height', data.sizes.height+'px');
  		    jQuery('#content .nokia-places-blue-map .nokia-place-map-container,#content .nokia-place-extended-details-container,#content .nokia-places-blue-compact').css('height', data.sizes.height+'px');
  		}
  	});
  }

  var loadPlace = function(){
      if(data.displayOptions){
          document.getElementById('placewidget').className = data.displayOptions;
      }
      nokia.places.settings.setAppContext({appId: data.appId, authenticationToken: data.authenticationToken});  //remove

  	if(data.placeId){
  		nokia.places.manager.getPlaceData({
  			placeId: data.placeId,
  			onComplete: function(respData, status){
  				if(status === 'OK'){
  				    if(data.place_data){
  				        initWidget(data.place_data);
                      }else{
  						if ($GET['latitude'] && $GET['longitude']) {
  							respData.location.position.latitude = parseFloat($GET['latitude']);
  							respData.location.position.longitude = parseFloat($GET['longitude']);
  						}
  						if($GET['name']){
  							respData.name = $GET['name'];
  						}
                          initWidget(respData);
  		            }
  			    }

  			}

      	});
  	}else{

  		var coords = {
  			latitude: parseFloat($GET['latitude']),
  			longitude: parseFloat($GET['longitude'])
  		};

  		var title = $GET['title'];

  		var pureCoords = {};
          pureCoords.location = {};
          pureCoords.location.position = coords;
          pureCoords.categories = [];
          pureCoords.categories.push({
              icon: 'http://download.vcdn.nokia.com/p/d/places2/icons/categories/06.icon'
          });
          pureCoords.name = title || (coords.latitude + ', ' + coords.longitude);
          pureCoords.view = 'http://m.nokia.me?c=' + coords.latitude + ',' + coords.longitude + '&i&z=6';
          initWidget(pureCoords);
  	}

  };


  loadPlace();

}());



