/**
 *  
 * @package Nokia Places Plugin
 * @title Iframe resize function inside WYSIWYG editor
 * @author Nikolai Tihhomirov
 *
 */

function reSize(){
    var count = 0;
    
    //wait for json to load
//    var resizeInterval = setInterval(function(){
//        if(count++ > 10){
//            clearInterval(resizeInterval);
//        }
    var resizeInterval = setTimeout(function(){
        
        //Get unique frameid from meta tag
        var iframeid = document.getElementById('iframeid').getAttribute('content');
        //now get parent iframe
        var places_iframe = parent.document.getElementById('places_api_view'+iframeid);
        if(!places_iframe){
            return false;
        }
        
        //Calculate right size
        var y = document.body.scrollHeight;
        
        if(y == places_iframe.height){
            return false;
        }
        
        places_iframe.height = y;
    }, 100);
}