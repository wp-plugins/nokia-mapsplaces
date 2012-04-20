<?php

/**
 * add_placesApi_button
 * 
 * @package Nokia Places Plugin
 * @title Media insert/upload section button imlementation
 * @author Nikolai Tihhomirov
 *
 */
class nokia_places_core {

    var $pluginname = 'wp_nokia_places';
    var $path = '';

    function nokia_places_core() {
        // Set path to editor_plugin.js
        $this->path = nokiaplaces_url($path = 'tinymce/');

        // init process 
        add_action('init', array(&$this, 'add_nokiaplaces_core'));
    }

    function placesApi_media_button($context) {
        $path = nokiaplaces_url();
        
        $placesApi_media_button_image = $this->path . 'content/favicon.png';
        $placesApi_media_button = ' %s' . "<a id='add_place' href='{$path}/page/index.php?TB_iframe=true&height=500&width=660' class='thickbox' alt='foo' title='Add a map - Powered by Nokia'><img src='" . $placesApi_media_button_image . "' /></a>";
        return sprintf($context, $placesApi_media_button);
    }

    function add_nokiaplaces_core() {

        // Don't bother doing this stuff if the current user lacks permissions
        if (!current_user_can('edit_posts') && !current_user_can('edit_pages'))
            return;

        // Add only in Rich Editor mode
        if (get_user_option('rich_editing') == 'true') {
            add_filter('media_buttons_context', array(&$this, 'placesApi_media_button'));
        }
    }

}

// Call it now
$tinymce_nokiaplaces = new nokia_places_core ();
?>