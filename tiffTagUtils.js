const {
	ImageWidth,
	ImageLength,
	Compression,
	PhotometricInterpretation,
	StripOffsets,
	RowsPerStrip,
	StripByteCounts,
	XResolution,
	YResolution,
	ResolutionUnit,
	BitsPerSample,
	ColorMap,
	SamplesPerPixel,
} = require('./tiffTags');

/**
 * A bilevel image contains two colors—black and white.
 */
const getRequiredTagsForBilevelImages = function() {
	return {
		ImageWidth,
		ImageLength,
		Compression,
		PhotometricInterpretation,
		StripOffsets,
		RowsPerStrip,
		StripByteCounts,
		XResolution,
		YResolution,
		ResolutionUnit,
	};
};

/**
 * Grayscale images are a generalization of bilevel images. Bilevel images can
 * store only black and white image data, but grayscale images can also store
 * shades of gray.
 */
const getRequiredTagsForGrayscaleImages = function() {
	return {
		ImageWidth,
		ImageLength,
		BitsPerSample,
		Compression,
		PhotometricInterpretation,
		StripOffsets,
		RowsPerStrip,
		StripByteCounts,
		XResolution,
		YResolution,
		ResolutionUnit,
	};
};

/**
 * Palette-color images are similar to grayscale images. They still have one
 * component per pixel, but the component value is used as an index into a full
 * RGB-lookup table.
 */
const getRequiredTagsForPaletteColorImages = function() {
	return {
		ImageWidth,
		ImageLength,
		BitsPerSample,
		Compression,
		PhotometricInterpretation,
		StripOffsets,
		RowsPerStrip,
		StripByteCounts,
		XResolution,
		YResolution,
		ResolutionUnit,
		ColorMap,
	};
};

/**
 * In an RGB image, each pixel is made up of three components: red, green, and
 * blue. There is no ColorMap.
 */
const getRequiredTagsForRGBImages = function() {
	return {
		ImageWidth,
		ImageLength,
		BitsPerSample,
		Compression,
		PhotometricInterpretation,
		StripOffsets,
		SamplesPerPixel,
		RowsPerStrip,
		StripByteCounts,
		XResolution,
		YResolution,
		ResolutionUnit,
	};
};

module.exports = {
	getRequiredTagsForGrayscaleImages,
	getRequiredTagsForBilevelImages,
	getRequiredTagsForPaletteColorImages,
	getRequiredTagsForRGBImages,
};
