{extends file='modals/modal_base.tpl'}

{block name='options'}
	{assign var='noContent' value=true}
	{assign var='noFooter' value=true}
{/block}

{block name='id'}window_upload_img{/block}
{block name='class'}modal-image-upload js-modal-default{/block}
{block name='title'}{$aLang.uploadimg}{/block}

{block name='header_after'}
	<ul class="nav nav-pills nav-pills-tabs" data-type="tabs">
		<li data-type="tab" data-option-target="tab-upload-pc" class="active"><a href="#">{$aLang.uploadimg_from_pc}</a></li>
		<li data-type="tab" data-option-target="tab-upload-link"><a href="#">{$aLang.uploadimg_from_link}</a></li>
	</ul>
{/block}

{block name='content_after'}
	<div data-type="tab-content">
		<form method="POST" action="" enctype="multipart/form-data" id="tab-upload-pc" onsubmit="return false;" data-type="tab-pane" class="tab-pane" style="display: block">
			<div class="modal-content">
				<p><label for="img_file">{$aLang.uploadimg_file}:</label>
				<input type="file" name="img_file" id="img_file" value="" class="input-text input-width-full" /></p>

				{hook run="uploadimg_source"}

				<p>
					<label for="form-image-align">{$aLang.uploadimg_align}:</label>
					<select name="align" id="form-image-align" class="input-width-full">
						<option value="">{$aLang.uploadimg_align_no}</option>
						<option value="left">{$aLang.uploadimg_align_left}</option>
						<option value="right">{$aLang.uploadimg_align_right}</option>
						<option value="center">{$aLang.uploadimg_align_center}</option>
					</select>
				</p>

				<p><label for="form-image-title">{$aLang.uploadimg_title}:</label>
				<input type="text" name="title" id="form-image-title" value="" class="input-text input-width-full" /></p>

				{hook run="uploadimg_additional"}
			</div>
			
			<div class="modal-footer">
				<button type="submit" class="button button-primary" onclick="ls.ajaxUploadImg('tab-upload-pc');">{$aLang.uploadimg_submit}</button>
				<button type="button" class="button" data-type="modal-close">{$aLang.uploadimg_cancel}</button>
			</div>
		</form>


		<form method="POST" action="" enctype="multipart/form-data" id="tab-upload-link" onsubmit="return false;" data-type="tab-pane" class="tab-pane">
			<div class="modal-content">
				<p><label for="img_file">{$aLang.uploadimg_url}:</label>
				<input type="text" name="img_url" id="img_url" value="http://" class="input-text input-width-full" /></p>

				<p>
					<label for="form-image-url-align">{$aLang.uploadimg_align}:</label>
					<select name="align" id="form-image-url-align" class="input-width-full">
						<option value="">{$aLang.uploadimg_align_no}</option>
						<option value="left">{$aLang.uploadimg_align_left}</option>
						<option value="right">{$aLang.uploadimg_align_right}</option>
						<option value="center">{$aLang.uploadimg_align_center}</option>
					</select>
				</p>

				<p><label for="form-image-url-title">{$aLang.uploadimg_title}:</label>
					<input type="text" name="title" id="form-image-url-title" value="" class="input-text input-width-full" /></p>

				{hook run="uploadimg_link_additional"}
			</div>

			<div class="modal-footer">
				<button type="submit" class="button button-primary" onclick="ls.topic.insertImageToEditor(jQuery('#img_url').val(),jQuery('#form-image-url-align').val(),jQuery('#form-image-url-title').val());">{$aLang.uploadimg_link_submit_paste}</button>
				<button type="submit" class="button button-primary" onclick="ls.ajaxUploadImg('tab-upload-link');">{$aLang.uploadimg_link_submit_load}</button>
				<button type="button" class="button" data-type="modal-close">{$aLang.uploadimg_cancel}</button>
			</div>
		</form>
	</div>
{/block}