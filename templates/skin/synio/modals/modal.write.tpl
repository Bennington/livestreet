{extends file='modals/modal_base.tpl'}

{block name='options'}
	{assign var='noTitle' value=true}
	{assign var='noFooter' value=true}
{/block}

{block name='id'}modal-write{/block}
{block name='class'}modal-write js-modal-default{/block}
{block name='title'}{$aLang.block_create}{/block}
	
{block name='content'}
	{strip}
		<ul class="write-list">
			{if $iUserCurrentCountTopicDraft}
			<li class="write-item-type-draft">
				<a href="{router page='topic'}saved/" class="write-item-image"></a>
				<a href="{router page='topic'}saved/" class="write-item-link">{$iUserCurrentCountTopicDraft} {$iUserCurrentCountTopicDraft|declension:$aLang.draft_declension:'russian'}</a>
			</li>
			{/if}
			<li class="write-item-type-topic">
				<a href="{router page='topic'}add" class="write-item-image"></a>
				<a href="{router page='topic'}add" class="write-item-link">{$aLang.block_create_topic_topic}</a>
			</li>
			<li class="write-item-type-blog">
				<a href="{router page='blog'}add" class="write-item-image"></a>
				<a href="{router page='blog'}add" class="write-item-link">{$aLang.block_create_blog}</a>
			</li>
			<li class="write-item-type-message">
				<a href="{router page='talk'}add" class="write-item-image"></a>
				<a href="{router page='talk'}add" class="write-item-link">{$aLang.block_create_talk}</a>
			</li>
			{hook run='write_item' isPopup=true}
		</ul>
	{/strip}
{/block}