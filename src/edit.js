import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import './editor.scss';

import {
    InspectorControls,
} from '@wordpress/block-editor';


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		onReplace,
		mergeBlocks,
	} = props;

	const {
		text,
		page,
		totalCount,
		items,
		title,
		maker,
		image_url,
		amazon_url,
		rakuten_url,
	} = attributes;

	const { nonce, noimage_url, amazon_associate_id, rakuten_affiliate_id } = fragment_amzn_init_data;

	const onChangeKeyword = ( val ) => {
		setAttributes( { text: val } )
	};

	const onClickItem = ( item ) => {
		setAttributes( { title: item.title } )
		setAttributes( { image_url: item.image_url } )
		setAttributes( { amazon_url: item.url } )
		setAttributes( { rakuten_url: 'http://hb.afl.rakuten.co.jp/hgc/' + rakuten_affiliate_id + '/?pc=http%3A%2F%2Fsearch.rakuten.co.jp%2Fsearch%2Fmall%2F' + encodeURI(item.title) } )
	};

	const onClickMore = (page) => {
		page += 1;
		setAttributes( { page: page } )
		search(page);
	};

	const onSubmitQuery = function( e ) {
		e.preventDefault();

		setAttributes( { page: 1 } )
		setAttributes( { items: [] } )
		setAttributes( { totalCount: 0 } );
		search(1);
	};

	const search = function(page) {
		if (text === "") return;
		let formData = new URLSearchParams();
		formData.append('keywords', text);
		formData.append('page', page);
		formData.append('security', nonce);
		fetch('/wp-admin/admin-ajax.php?action=fragment_amzn_search_amazon_items', {
			method: "POST",
			body: formData,
		}).then(function(response) {
			return response.json();
		}).then(function(data) {
			let tmpitems = []
			data.SearchResult.Items.forEach(function(item) {
				tmpitems.push({
					"title": item.ItemInfo.Title.DisplayValue,
					"url": item.DetailPageURL,
					"image_url": item.Images.Primary.Medium.URL,
					"maker": ""
				})
			});
			if (page != 1 && items.length > 0) {
				tmpitems = items.concat(tmpitems);
			}
			setAttributes({ items: tmpitems });
			setAttributes({ totalCount: data.SearchResult.TotalResultCount });
		}).catch((val) => {
			console.log(val);
			alert("問題が発生しました。AWSのアクセスキー・シークレット、またはパートナータグが間違えている可能性があります。");
		});
	};

	if (image_url == "" || image_url == undefined) {
		setAttributes( {image_url: noimage_url} );
	}

	return (
		<>
			<InspectorControls key="setting">
				<div id="wp-block-create-block-fragment-amzn-controls">
					<fieldset>
						<form className="inline-input" onSubmit={ onSubmitQuery }>
							<TextControl
								value={ text }
								onChange={ onChangeKeyword }
								placeholder="商品名を入力してEnter"
							/>
							<input type="hidden" value={page} name="page" />
						</form>
					</fieldset>
					<fieldset class="wp-block-create-block-fragment-amzn-items">
						<ul>
							{
								items.map((item) =>
									<li>
										<img src={ item.image_url } />
										<p>{ item.maker }</p>
										<p><a href={ item.url } target="_blank">{ item.title }</a></p>
										<div class="btn-area">
											<button value={item} onClick={() => onClickItem(item)}>選択する</button>
										</div>
									</li>
								)
							}
						</ul>
						{items.length < totalCount && <button value={page} onClick={() => onClickMore(page)} class="wp-block-create-block-fragment-amzn-next">もっと見る</button>}
					</fieldset>
				</div>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<div class="wp-block-create-block-fragment-amzn-inner">
					<div class="wp-block-create-block-fragment-amzn-img">
						<p class="wp-block-create-block-fragment-amzn-img-box">
							<span>
								<img src={ image_url } />
							</span>
						</p>
					</div>
					<div class="wp-block-create-block-fragment-amzn-info">
						<p class="wp-block-create-block-fragment-amzn-info-maker">{ maker }</p>
						<p class="wp-block-create-block-fragment-amzn-info-title">
							<a href={ amazon_url ? amazon_url : ""} target={ amazon_url ? "_blank" : ""} rel="noopener noreferrer">{ title }</a>
						</p>
						<p class="wp-block-create-block-fragment-amzn-info-btn">
							<a href={ amazon_url ? amazon_url : ""} target={ amazon_url ? "_blank" : ""} rel="noopener noreferrer" class="wp-block-create-block-fragment-amzn-info-amazon">Amazonで見る</a>
							<a href={ rakuten_url ? rakuten_url : ""} target={ rakuten_url ? "_blank" : ""} rel="noopener noreferrer" class="wp-block-create-block-fragment-amzn-info-rakuten">楽天市場で見る</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
