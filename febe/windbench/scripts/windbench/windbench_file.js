/**
 * @file
 * Provides JavaScript additions to the managed file field type.
 *
 * This file provides progress bar support (if available), popup windows for
 * file previews, and disabling of other file fields during Ajax uploads (which
 * prevents separate file fields from accidentally uploading files).
 */

(function ($) {
	
/**
 * Attach behaviors to managed file element upload fields.
 */
Drupal.behaviors.windbenchValidateAutoAttach = {
  attach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        var extensions = settings.file.elements[selector];
        $(selector, context).bind('change', {extensions: extensions}, Drupal.windbench.validateFilename);
      });
    }
  }
};
	

	


Drupal.windbench = Drupal.windbench || {
  /**
   * Client-side file input validation of file name.
   */
	validateFilename: function (event) {
		//alert(Drupal.settings.windbench.value);
		//alert(Drupal.settings.og.og_context.label);
	  
		file_name = this.value.replace('C:\\fakepath\\', '');
		$('.windbench-upload-js-error').remove();
		if(this.id.substr(0,27) == 'edit-field-quest-files-und-'){
			//alert(this.id);
			var error = Drupal.t("windbench_file.js");
			$(this).closest('div.form-managed-file').prepend('<div class="messages error windbench-upload-js-error">' + error + '</div>');
			//this.value = '';
			return false;
		}
	/*  
	var uplaod_botton;
	var input_fields = document.getElementsByTagName('input');
	for(var i= 0, length = input_fields.length; i<length; i++){
		var id = input_fields[i].id
		if(id.substr(0,27) == 'edit-field-quest-files-und-'){
			if(id.search("upload-button")){
				alert("Found the button");
				upload_button = input_fields[i];
			}
			else{
				alert("Found the file field");
				file_field = input_fields[i];
			}
		}
	
	}*/
	

	/*
	file_field.onchange = function(){
		//alert("2");
		file_name = file_field.value.replace('C:\\fakepath\\', '');
		if(file_name != "logotipo2.png"){
			alert(file_name);
			//alert($(this).value);
			var error = "Icorrect name";
			$(this).closest('div.form-managed-file').prepend('<div class="messages error file-upload-js-error">' + error + '</div>');
			this.value = '';
			upload_button.disabled = true;
			return false;
		}
		else{
			upload_button.disabled = false;
			return true;
		}*/
	}
};


})(jQuery);
