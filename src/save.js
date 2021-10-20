/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/#useBlockProps
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save( { attributes } ) {
	const {
		text,
		items,

		title,
		maker,
		image_url,
		amazon_url,
		rakuten_url,
	} = attributes;

	return (
		<>
			<div { ...useBlockProps.save() }>
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
							<a href={ amazon_url } target="_blank" rel="noopener noreferrer">{ title }</a>
						</p>
						<p class="wp-block-create-block-fragment-amzn-info-btn">
							<a href={ amazon_url } target="_blank" rel="noopener noreferrer" class="wp-block-create-block-fragment-amzn-info-amazon">Amazonで見る</a>
							<a href={ rakuten_url } target="_blank"  rel="noopener noreferrer" class="wp-block-create-block-fragment-amzn-info-rakuten">楽天市場で見る</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
