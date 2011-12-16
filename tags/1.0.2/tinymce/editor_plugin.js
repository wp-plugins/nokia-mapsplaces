/*
* @package Nokia Places Plugin
* @title Tinymce plugin which adds nokia places visual to WYSIWYG editor
* @author Nikolai Tihhomirov
*/
( function() {
    tinymce.create( 'tinymce.plugins.wp_nokia_places', {
               
			
        init : function( ed, url ) {
            var t = this;
				
            // Add listeners to handle  nokia places
            t._handleNokiaPlaces( ed, url );
        },

        getInfo : function() {
            return {
                longname : 'Nokia places plugin',
                author : 'Nikolai Tihhomirov',
                infourl : 'nikolai.tihhomirov@ixonos.com',
                version : "1.0"
            };
        },
        
        //core
        _handleNokiaPlaces : function( ed, url ) {
                console.log(1112);
            if(navigator.userAgent.match(/firefox/gi)){
                console.log(111);
                return;
            }
            var string_match, iframe_regexp, shortcode_regexp, places_shortcode, places_iframe, helper_regexp, helper_iframe, placeids = [], templates = new Array, place_datas = new Array;
            var base_url = document.URL.replace( /([\w\W]*\/)wp-[\w\W]*/g, '$1' );

            shortcode_regexp = /\nokia-maps template=\"([\w]*)\" (?:(?:place=\"([\w-]+)\"\])|(?:place_data=\"([\w\s\/{}'%:.,-]*)\")\])/g;
            iframe_regexp = /\<iframe[\w\s"-=]*id=\"places_api_view[\d]+\"[\w\s"-=]*src=\"[\w\/:.-]*(default|custom)\.php\?(?:(?:placeid=([\w-]+))|(?:place_data=([\w\s\/{}'%:.,-]*)))[&amp;]+iframeid=[\d]\"[\w\s"-=]*\>[\w\s]*\<\/iframe\>/g;
                
            //main replace function
            function renderplaces( a, o ){
                var regexp;
                switch( a ){
                    case "shortcode":
                        regexp = shortcode_regexp;
                        break;
                    case "iframe":
                        regexp = iframe_regexp;
                        break;
                    default:
                        return;
                }
                                              
                string_match = o.content.match( regexp );
                if( string_match ){
                    //render all places
                    for( i=0; i<string_match.length; i=i+1 ){
                        templates[i] = string_match[i].replace( regexp, '$1' );
                        //check place_data or place_id?
                        if(string_match[i].match( /place_data=[\w\s\/{}"':.,-]*/ ))
                        {
                            //place_datas decodeURI
                            place_datas[i] = string_match[i].replace( regexp , '$3' );
                            place_datas[i] = decodeURI(place_datas[i]);
                            //Make unique iframe and shortcode 
                            places_shortcode = '[nokia-maps template="'+templates[i]+'" place_data="'+place_datas[i]+'"]';
                            places_iframe = '<iframe id="places_api_view'+i+'" width="506" frameborder="no" scrolling="no" src="'+base_url+'wp-content/plugins/nokia-mapsplaces/page/'+templates[i]+'.php?place_data='+encodeURI(place_datas[i])+'&amp;iframeid='+i+'">IFRAMES not supported</iframe>';
                        }else{
                            //place_id
                            placeids[i] = string_match[i].replace( regexp, '$2' );	
                            places_shortcode = '[nokia-maps template="'+templates[i]+'" place="'+placeids[i]+'"]';
                            places_iframe = '<iframe id="places_api_view'+i+'" width="506" frameborder="no" scrolling="no" src="'+base_url+'wp-content/plugins/nokia-mapsplaces/page/'+templates[i]+'.php?placeid='+placeids[i]+'&amp;iframeid='+i+'">IFRAMES not supported</iframe>';
                        }
                        
                        //Which way to replace
                        if( a == "shortcode" ){
                            o.content = o.content.replace( places_shortcode, places_iframe );
                        }else{
                            //Create unique iframe regexp
                            helper_regexp = '\<iframe\[\\w\\s\/\"&;:.?=-\]\*id=\"places_api_view'+i+'\"\[\\w\\s\/\{\}\'\"\&\%;:.,?=-\]\*\>\[\\w\\s\]\*\<\/iframe\>';
                            //Search for it
                            helper_iframe = o.content.match(helper_regexp);
                            //Replace it to shortcode
                            o.content = o.content.replace( helper_iframe, places_shortcode );
                        }
                    }
                }
            }
                                
            // Replace shortcode to iframe
            ed.onBeforeSetContent.add( function( ed, o ) {
                if ( o.content ) { 
                    renderplaces( 'shortcode', o );
                }
					
            });

            // Replace iframe to shortcode
            ed.onPostProcess.add( function( ed, o ) {
                if ( o.get ){
                    renderplaces( 'iframe', o );
                }                    
                    
            });

        }
		
    });
		

    // Register plugin
    tinymce.PluginManager.add( 'wp_nokia_places', tinymce.plugins.wp_nokia_places );
})();