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
        $placesApi_media_button = ' %s' . "<a id='add_place' onclick='switch_tb_position();' href='{$path}/page/index.php?height=500&width=970&TB_iframe=true' class='thickbox' alt='foo' title='Add a map - Powered by Nokia'><img src='" . $placesApi_media_button_image . "' /></a>";
        
        $tb_position = "
            <script type='text/javascript'>
                function switch_tb_position(){
                    var old_tb_position = tb_position;
                    var old_tb_remove = tb_remove;

                    tb_remove = function(){
                                tb_position = old_tb_position;
                                tb_remove = old_tb_remove;
                                tb_remove();
                    }

                    tb_position = function() {
                            var tbWindow = jQuery('#TB_window'), width = jQuery(window).width(), H = jQuery(window).height(), W = ( 1020 < width ) ? 1020 : width, adminbar_height = 0;

                            if ( jQuery('body.admin-bar').length ){
                                adminbar_height = 28;
                            }

                            if ( tbWindow.size() ) {
                                    tbWindow.width( W - 50 ).height( H - 45 - adminbar_height );
                                    jQuery('#TB_iframeContent').width( W - 50 ).height( H - 75 - adminbar_height );
                                    tbWindow.css({'margin-left': '-' + parseInt((( W - 50 ) / 2),10) + 'px'});
                                    if ( typeof document.body.style.maxWidth != 'undefined' )
                                            tbWindow.css({'top': 20 + adminbar_height + 'px','margin-top':'0'});
                            };

                    };
                }
            </script>
            ";            

        
        
        return sprintf($context, $placesApi_media_button.$tb_position);
    }

    function add_nokiaplaces_core() {
        // Don't bother doing this stuff if the current user lacks permissions
        if (!current_user_can('edit_posts') && !current_user_can('edit_pages')){
            return;
        }

        add_action('media_buttons_context', array(&$this, 'placesApi_media_button'));
    }

}

// Call it now
$tinymce_nokiaplaces = new nokia_places_core ();
?>