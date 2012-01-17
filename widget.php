<?php
/*
  Plugin Name: Nokia Maps Places
  Plugin URI: http://wordpress.org/extend/plugins/nokia-mapsplaces/
  Description: With this plugin you are able to add a places and addresses into a post or a page.
  Version: 1.0.2
  Author: Nokia Corporation
  Author Email: marek.krysiuk@nokia.com
  License: BSD License
 */

wp_enqueue_script( 'thickbox' );
wp_enqueue_style( 'thickbox' );

class NokiaMapsPlacesWidget extends WP_Widget {
	/** constructor */

   	function NokiaMapsPlacesWidget() {
		$this->WP_Widget('nokiaMapsPlacesWidget', 'Nokia Maps & Places', array('description' => 'Show your place in sidebar'));
	}
        
	/** @see WP_Widget::widget */
	function widget($args, $instance) {
		extract($args);
		$title = apply_filters('widget_title', $instance['title']);
		if ($title){
                    echo $before_title . $title . $after_title;
                }
                $this->displayWidget($instance);
                
                echo $after_widget;
	}

	/** @see WP_Widget::update */
	function update($new_instance, $old_instance) {
		$instance = $old_instance;
		$instance['placeData'] = strip_tags($new_instance['placeData']);
		return $instance;
	}

	/** @see WP_Widget::form */
	function form($instance) {
            $this->displayWidget($instance);
            $placeData = esc_attr($instance['placeData']);
            
            $path = nokiaplaces_url();
            ?>
            <p>
            <input id="<?php echo $this->get_field_id('placeData'); ?>" name="<?php echo $this->get_field_name('placeData'); ?>" type="hidden" value="<?php echo $placeData; ?>" />
            <a id='add_place' style="text-decoration: none;" href='<?php echo $path; ?>/page/index.php?widgetMode=<?php echo $this->get_field_id('placeData'); ?>&TB_iframe=true&height=500&width=660' class='thickbox' alt='foo' title='Add a map - Powered by Nokia'><input id="addPlace" class="button-primary" type="button" value="Choose a place" name="addPlace"></a>
            </p>
            <?php 
	}
        
        function displayWidget($instance){
            if(!$instance['placeData']){
                return false;
            }
            
            echo do_shortcode($instance['placeData']);
        }
}

function widget_init(){
     register_widget("NokiaMapsPlacesWidget");
}

add_action('widgets_init', 'widget_init');
?>