<?php
/** This file is part of Nokia Maps Places Wordpress plugin

Copyright (c) 2011 Nokia Corporation and/or its subsidiary(-ies).*
All rights reserved.

Contact:  Nokia Corporation marek.krysiuk@nokia.com

You may use this file under the terms of the BSD license as follows:

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer. 
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution. 
* Neither the name of Nokia Corporation and its Subsidiary(-ies) nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
  Plugin Name: Nokia Maps Places
  Plugin URI: http://api.maps.nokia.com/places/
  Description: With this plugin you are able to add a places and addresses into a post or a page.
  Version: 1.0.0
  Author: Nokia Corporation
  Author Email: marek.krysiuk@nokia.com
  License: BSD License
 */

/**
 * add_placesapi_core
 * 
 * @package Nokia Places Plugin
 * Insert placesapi core Javascript files into wordpress except admin pages
 *
 */
if (!is_admin()) {
    wp_enqueue_script('placesapi', plugins_url('/placesapi/jsPlacesAPI.js', __FILE__));
    wp_enqueue_script('placesapi_config', plugins_url('/placesapi/configuration.js', __FILE__), array('placesapi'));
} else {
    /**
     * add_colorbox_core
     * 
     * @package Nokia Places Plugin
     * Insert colorbox core Javascript files into admin pages
     *
     */
    wp_register_script('colorbox', plugins_url('/tinymce/colorbox/jquery.colorbox.js', __FILE__), array('jquery'));
    wp_enqueue_style('colorbox', plugins_url('/page/colorbox.css', __FILE__));
}

/**
 * get_nokiaplaces_url
 * 
 * @package Nokia Places Plugin
 * Get plugin_url > used in tinymce.php
 *
 */
function nokiaplaces_url($path = '') {
    global $wp_version;
    if (version_compare($wp_version, '2.8', '<')) { // Using WordPress 2.7
        $folder = dirname(plugin_basename(__FILE__));
        if ('.' != $folder)
            $path = path_join(ltrim($folder, '/'), $path);

        return plugins_url($path);
    }
    return plugins_url($path, __FILE__);
}

include_once ( dirname(__FILE__) . '/tinymce/tinymce.php' );

/**
 * allow_iframe
 * 
 * Allows iframe in editor
 *
 */
function add_iframe($initArray) {
    $initArray['extended_valid_elements'] = "iframe[id|frameborder|height|scrolling|src|width]";
    return $initArray;
}

add_filter('tiny_mce_before_init', 'add_iframe');

/**
 *  
 * @package Nokia Places Plugin
 * Register Nokia places shortcode and the way extracting it
 *
 */
// [nokia-maps template="template" place="placeId"]
//or [nokia-maps template="template" place_data="jsonObject"]
function nokia_place_shortcode($atts) {
    
    $map = array(
        'placeid' => '',
        'place_data_params' => '',
        'template' => '',
        'sizes' => '',
        'display_options' => '',
    );
    
    if($atts['place_data_params']){
        for($i = 1; $i <= $atts['place_data_params']; $i++){
            $map['place_data_'.$i] = '';
        }
    }
    
    $atts = shortcode_atts($map, $atts);
    $str = http_build_query($atts);
    
    preg_match("#height':\s?'(\d+)'#", $atts['sizes'], $size);
    
    $insert_code = create_nokia_places_post($str, $size[1]);
    return $insert_code;
}

add_shortcode('nokia-maps', 'nokia_place_shortcode');

/**
 * insert_nokiaplace
 * 
 * @package Nokia Places Plugin
 * Insert nokia places basic place
 *
 */
function create_nokia_places_post($query, $height) {
    //Replace shortcode with div+js core
    $frame_id = md5($query);
    return "<iframe id='places_api_view{$frame_id}' frameborder='no' scrolling='no' height='{$height}' width='100%' src='wp-content/plugins/nokia-mapsplaces/page/place.php?{$query}&amp;iframeid={$frame_id}'>IFRAMES not supported</iframe>";
}

/**
 * insert_custom_template_div
 * 
 * @package Nokia Places Plugin
 * 
 */
function insert_custom_template() {
    include_once ( dirname(__FILE__) . '/templates/custom/custom.html' );
}

?>