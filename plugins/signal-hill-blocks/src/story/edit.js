/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck, MediaPlaceholder } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const ALLOWED_MEDIA_TYPES = [ 'audio' ];

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({
	attributes,
	setAttributes,
	context: { postType, postId },
}) {

	const [ meta, updateMeta ] = useEntityProp(
		'postType',
		'story',
		'meta',
		postId
	);

	const { audioId, mediaArr, transcript } = meta;

	const audio = useSelect((select) => {
        return select('core').getMedia(audioId);
    }, [audioId]);

	const media = useSelect((select) => {
		return select('core').getMedia(mediaArr);
	}, [mediaArr]);

	const audioPlaceholder = <MediaPlaceholder
		onSelect = {
			( el ) => {
				setAttributes( { theImage: el.url } );
			}
		}
		allowedTypes = { [ 'image' ] }
		multiple = { false }
		labels = { { title: 'The Image' } }
	>
		"extra content"
	</MediaPlaceholder>;

	return (
		<div { ...useBlockProps() }>
			<div style={{display: 'flex', alignItems: 'center'}}>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) =>
							updateMeta( {
								...meta,
								audioId: audio.id,
							} )
						}
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ audioId }
						render={ ( { open } ) => (
							<Button onClick={ open }>Select Audio</Button>
						) }
					/>
				</MediaUploadCheck>
			</div>
			<div style={{display: 'flex', alignItems: 'center'}}>
				{media ? <img src={media.source_url} style={{width: '100px', height: '100px'}}/> : null }
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) =>
							updateMeta( {
								...meta,
								mediaArr: media.id,
							} )
						}
						allowedTypes={ [ 'image' ] }
						value={ mediaArr }
						render={ ( { open } ) => (
							<Button onClick={ open }>Select Image</Button>
						) }
					/>
				</MediaUploadCheck>	
				<p>Transcript:
					<RichText
						tagName="span"
						placeholder={ __( 'Transcript', 'signal-hill' ) }
						allowedFormats={ [] }
						disableLineBreaks
						value={ transcript }
						onChange={ ( newTranscriptContent ) =>
							updateMeta( {
								...meta,
								transcript: newTranscriptContent,
							} )
						}
					/>
				</p>
			</div>
		</div>
	);
}
