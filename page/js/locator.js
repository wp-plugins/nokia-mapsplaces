function Locator(params){
	
	var self = this;
	this.located = false;
	var onComplete,
	   logMessages = true;
	
	//methods to use in lookup, in order of execution
	this.methods = [ipLookUp,detectFromBrowser,fallToPrague];
	
	if(params){
		if(params.map){
			this.map = params.map
		}
	}
    
	function logMessage(message){
	    if(logMessages){
	        if(window.console && window.console.log){
	            window.console.log(message);
	        }
	    }
	}
	
	
	///////// Detection Methods /////////
	function ipLookUp()
	{
		//logMessage("Trying IP Lookup");		
		jQuery.ajax({
			url:"http://maps.nokia.com/services/iplookup/get?callback=?",
			dataType:"json",
			timeout : 1000, //because events are not fired on request error,
			error: function(jqXHR, testStatus, errorThrown){
				return self.fail();
			},
			success: function(data, textStatus, jqXHR){
				if(data.errors){
					return self.fail();
				}
				if(data.location){
					data.position = {};
					data.position.longitude = data.location.longitude;
					data.position.latitude = data.location.latitude;
					delete data.location;
					self.success(data);
					
					if(self.map){
						self.map.setZoomLevel(9);
					}
				}else{
					return self.fail();
				}
			}
		});
	}

	function detectFromBrowser(){
		//logMessage("Trying Browser Detect");
		var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
		userLang = userLang.split('-');
		var searchTerm;
		if(userLang.length == 2){
			searchTerm = userLang[1];
			
		}
		else if(userLang.length == 1){
			var mappings = {
				af : "Republic of South Africa",
				be : "Belarus",
				bg : "Bulgaria",
				ca : "Catalonia, Spain",
				cs : "Czech Republic",
				da : "Denmark",
				de : "Germany",
				el : "Greece",
				en : "United States",
				es : "Spain",
				et : "Estonia",
				fa : "Iran",
				fi : "Finland",
				fr : "France",
				ga : "Ireland",
				he : "Israel",
				hi : "India",
				hr : "Croatia",
				hu : "Hungary",
				id : "Indonesia",
				is : "Iceland",
				it : "Italy",
				ja : "Japan",
				jv : "Java",
				ka : "Georgia",
				ko : "Korea",
				lt : "Lithuania",
				lv : "Latvia",
				mn : "Mongolia",
				my : "Burma",
				nl : "Netherlands",
				no : "Norwegia",
				pa : "Punjab",
				pl : "Poland",
				pt : "Portugal",
				ro : "Romania",
				ru : "Russia",
				sc : "Sardinia",
				si : "Sri Lanka",
				sk : "Slovakia",
				sl : "Slovenia",
				so : "Somalia",
				sq : "Albania",
				su : "Java",
				sv : "Sweden",
				sw : "Africa",
				te : "Andhra Pradesh",
				th : "Thailand",
				tk : "Turkmenistan",
				tr : "Turkey",
				uk : "Ukraine",
				ur : "Pakistan",
				uz : "Uzbekistan",
				vi : "Vietnam",
				wa : "Belgium",
				yo : "Africa",
				za : "China",
				zh : "China",
				zu : "Africa"
			};
			
			if(mappings[userLang[0]])
				searchTerm = mappings[userLang[0]];

		}
		
		
		if(searchTerm){
			
			var searchCenter = { latitude: 52.516274, longitude: 13.377678 }; //Berlin
		
			nokia.places.search.manager.findPlaces({
				searchTerm: searchTerm,
				onComplete: function (data, status) {
					if(status == "OK"){
						return self.success(data.results.items[0]);
					}
					else{
						return self.fail();
					}
				},
				searchCenter: searchCenter
			});
		}
		else{
			self.fail();
		}
	}
	
	function geoLocate(){
		//logMessage("Trying geolocation");
		
		var geoLocation = (navigator) ? navigator.geolocation : null;
		if(!geoLocation)
			return self.fail();
		
		geoLocation.getCurrentPosition(function (position){
                var searchCenter = {};
				searchCenter.position={
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                self.success(searchCenter);
            },
            function () {
				
                self.fail();
            }
			); 
	}

	function fallToPrague(){
		//logMessage("Last resort :(");
		
		var prague = {
					position:{
						latitude:50.07908,
						longitude:14.43322
					}
				};
		self.success(prague);
		
		if(self.map){
			self.map.setZoomLevel(1);
		}
	}

	//////////////////// End Methods /////////////////////

	this.attachMethod = function(fn,order){
		if(order)
			self.methods.splice(order,0,fn);
		else
			self.methods.push(fn);
	};

	this.success = function(data){
		/*
		*	This function is called when any location is successfully retrieved.
		*	data is an object, which could have position, or boundingBox properties, and their associated child properties
		*/
		
		if(this.located)
			return;
		else
			this.located = true;
			
		if(data.boundingBox){
			//logMessage("FOUND A BBOX");
			if(self.map){				
				var bbox = new nokia.maps.geo.BoundingBox(
					new nokia.maps.geo.Coordinate(data.boundingBox.topLeft.latitude, data.boundingBox.topLeft.longitude),
					new nokia.maps.geo.Coordinate(data.boundingBox.bottomRight.latitude, data.boundingBox.bottomRight.longitude)
				);
				self.map.zoomTo(bbox);	
			}
		}
		else if(data.position){	
			//logMessage("FOUND "+data.position.latitude+":"+data.position.longitude);	
			if(self.map){
				self.map.setCenter(data.position);
				
			}
		}
		if(onComplete)onComplete(data);
	}

	this.fail = function(){
		self.next();
	}
	
	this.locate = function(params){
		if(params){
			if(params.onComplete)
				onComplete = params.onComplete;
		}
		self.next();
	}

	this.next = function(){
		if(self.methods.length){
			self.methods.shift()(self);
		}else
		{
			logMessage("All available methods failed");
		}
	}
};