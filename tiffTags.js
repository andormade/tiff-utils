const { BYTE, LONG, SHORT, ASCII, RATIONAL, IFD } = require('./ifdEntryTypes');

/**
 * Replaces the old SubfileType field, due to limitations in the definition of
 * that field.
 * NewSubfileType is mainly useful when there are multiple subfiles in a single
 * TIFF file.
 * This field is made up of a set of 32 flag bits. Unused bits are expected to
 * be 0. Bit 0 is the low-order bit.
 * Currently defined values are:
 *
 * Bit 0 is 1 if the image is a reduced-resolution version of another image in
 * this TIFF file; else the bit is 0.
 *
 * Bit 1 is 1 if the image is a single page of a multi-page image (see the
 * PageNumber field description); else the bit is 0.
 *
 * Bit 2 is 1 if the image defines a transparency mask for another image in
 * this TIFF file. The PhotometricInterpretation value must be 4,
 * designating a transparency mask.
 *
 * These values are defined as bit flags because they are independent of each
 * other.
 * Default is 0.
 */
const NewSubfileType = {
	tag: 254,
	type: LONG,
	count: 1,
	default: 0,
};

/**
 * The number of columns in the image, i.e., the number of pixels per row.
 */
const ImageWidth = {
	tag: 256,
	type: [SHORT, LONG],
};

/**
 * The number of rows (sometimes described as scanlines) in the image.
 */
const ImageLength = {
	tag: 257,
	type: [SHORT, LONG],
};

/**
 * Number of bits per component.
 *
 * Note that this field allows a different number of bits per component for
 * each component corresponding to a pixel. For example, RGB color data
 * could use a different number of bits per component for each of the three
 * color planes. Most RGB files will have the same number of BitsPerSample for
 * each component. Even in this case, the writer must write all three values.
 *
 * Default = 1.
 * See also SamplesPerPixel.
 */
const BitsPerSample = {
	tag: 258,
	type: SHORT,
	default: 1,
	count: SamplesPerPixel => SamplesPerPixel,
};

/**
 * Compression scheme used on the image data.
 *
 * 1 = No compression, but pack data into bytes as tightly as possible leaving
 * no unused bits except at the end of a row.
 *
 * If BitsPerSample = 16 for all samples then the sample values are stored as
 * an array of type: SHORT
 *
 * If BitsPerSample = 32 for all samples then the sample values are stored as
 * an array of type: LONG
 *
 * Otherwise BYTE
 *
 * Each row is padded to the next BYTE/SHORT/LONG boundary, consistent with the
 * preceding BitsPerSample rule.
 *
 * If the image data is stored as an array of SHORTs or LONGs, the byte
 * ordering must be consistent with that specified in bytes 0 and 1 of the TIFF
 * file header. Therefore, little-endian format files will have the least
 * significant bytes preceding the most significant bytes, while big-endian
 * format files will have the opposite order.
 *
 * If the number of bits per component is not a power of 2, and you are willing
 * to give up some space for better performance, use the next higher power of
 * 2. For example, if your data can be represented in 6 bits, set BitsPerSample
 * to 8 instead of 6, and then convert the range of the values from [0,63] to
 * [0,255].
 *
 * Rows must begin on byte boundaries. (SHORT boundaries if the data is stored
 * as SHORTs, LONG boundaries if the data is stored as LONGs).
 *
 * Some graphics systems require image data rows to be word-aligned or
 * double-wordaligned, and padded to word-boundaries or double-word boundaries.
 * Uncompressed TIFF rows will need to be copied into word-aligned or
 * double-word-aligned row buffers before being passed to the graphics routines
 * in these environments.
 *
 *
 * 2 = CCITT Group 3 1-Dimensional Modified Huffman run-length encoding.
 * See Section 10 in the specification. BitsPerSample must be 1, since this
 * type of compression is defined only for bilevel images.
 *
 *
 * 32773 = PackBits compression, a simple byte-oriented run-length scheme.
 * See Section 9 of the specification for details.
 *
 * Data compression applies only to the image data, pointed to by StripOffsets.
 *
 * Default = 1.
 */
const Compression = {
	tag: 259,
	type: SHORT,
	default: 1,
};

/**
 * The color space of the image data.
 *
 * 0 = WhiteIsZero. For bilevel and grayscale images: 0 is imaged as white.
 * 2**BitsPerSample-1 is imaged as black. This is the normal value for
 * Compression=2
 *
 * 1 = BlackIsZero. For bilevel and grayscale images: 0 is imaged as black.
 * 2**BitsPerSample-1 is imaged as white. If this value is specified for
 * Compression=2, the image should display and print reversed.
 *
 * 2 = RGB. In the RGB model, a color is described as a combination of the three
 * primary colors of light (red, green, and blue) in particular concentrations.
 * For each of the three components, 0 represents minimum intensity, and
 * 2**BitsPerSample - 1 represents maximum intensity. Thus an RGB value of
 * (0,0,0) represents black, and (255,255,255) represents white, assuming 8-bit
 * components. For PlanarConfiguration = 1, the components are stored in the
 * indicated order: first Red, then Green, then Blue. For
 * PlanarConfiguration = 2, the StripOffsets for the component planes are stored
 * in the indicated order: first the Red component plane StripOffsets, then the
 * Green plane StripOffsets, then the Blue plane StripOffsets.
 *
 * 3 = Palette color. In this model, a color is described with a single
 * component. The value of the component is used as an index into the red, green
 * and blue curves in the ColorMap field to retrieve an RGB triplet that defines
 * the color. When PhotometricInterpretation=3 is used, ColorMap must be present
 * and SamplesPerPixel must be 1.
 *
 * 4 = Transparency Mask. This means that the image is used to define an
 * irregularly shaped region of another image in the same TIFF file.
 * SamplesPerPixel and BitsPerSample must be 1. PackBits compression is
 * recommended. The 1-bits define the interior of the region; the 0-bits define
 * the exterior of the region.
 *
 * A reader application can use the mask to determine which parts of the image
 * to display. Main image pixels that correspond to 1-bits in the transparency
 * mask are imaged to the screen or printer, but main image pixels that
 * correspond to 0-bits in the mask are not displayed or printed.
 *
 * The image mask is typically at a higher resolution than the main image, if
 * the main image is grayscale or color so that the edges can be sharp.
 *
 * There is no default for PhotometricInterpretation, and it is required. Do not
 * rely on applications defaulting to what you want.
 */
const PhotometricInterpretation = {
	tag: 262,
	type: SHORT,
	count: 1,
};

/**
 * The width of the dithering or halftoning matrix used to create a dithered or
 * halftoned bilevel file.
 * No default. See also Threshholding.
 */
const CellWidth = {
	tag: 264,
	type: SHORT,
	count: 1,
};

/**
 * The length of the dithering or halftoning matrix used to create a dithered or
 * halftoned bilevel file.
 * This field should only be present if Threshholding = 2
 * No default. See also Threshholding
 */
const CellLength = {
	tag: 265,
	type: SHORT,
	count: 1,
	default: 1,
};

/**
 * The logical order of bits within a byte.
 *
 * 1 = pixels are arranged within a byte such that pixels with lower column
 * values are stored in the higher-order bits of the byte.
 *
 * 1-bit uncompressed data example: Pixel 0 of a row is stored in the high-order
 * bit of byte 0, pixel 1 is stored in the next-highest bit, ..., pixel 7 is
 * stored in the loworder bit of byte 0, pixel 8 is stored in the high-order bit
 * of byte 1, and so on.
 *
 * CCITT 1-bit compressed data example: The high-order bit of the first
 * compression code is stored in the high-order bit of byte 0, the next-highest
 * bit of the first compression code is stored in the next-highest bit of byte
 * 0, and so on.
 *
 * 2 = pixels are arranged within a byte such that pixels with lower column
 * values are stored in the lower-order bits of the byte.
 *
 * We recommend that FillOrder=2 be used only in special-purpose applications.
 * It is easy and inexpensive for writers to reverse bit order by using a
 * 256-byte lookup table. FillOrder = 2 should be used only when
 * BitsPerSample = 1 and the data is either uncompressed or compressed using
 * CCITT 1D or 2D compression, to avoid potentially ambigous situations.
 *
 * Support for FillOrder=2 is not required in a Baseline TIFF compliant reader
 *
 * Default is FillOrder = 1.
 */
const FillOrder = {
	tag: 266,
	type: SHORT,
	count: 1,
};

/**
 * A string that describes the subject of the image.
 *
 * For example, a user may wish to attach a comment such as “1988 company
 * picnic” to an image.
 */
const ImageDescription = {
	tag: 270,
	type: ASCII,
};

/**
 * Manufacturer of the scanner, video digitizer, or other type of equipment
 * used to generate the image. Synthetic images should not include this field.
 * See also Model, Software.
 */
const Make = {
	tag: 271,
	type: ASCII,
};

/**
 * The model name or number of the scanner, video digitizer, or other type of
 * equipment used to generate the image.
 * See also Make, Software.
 */
const Model = {
	tag: 272,
	type: ASCII,
};

/**
 * For each strip, the byte offset of that strip.
 *
 * The offset is specified with respect to the beginning of the TIFF file. Note
 * that this implies that each strip has a location independent of the
 * locations of other strips. This feature may be useful for editing
 * applications. This required field is the only way for a reader to find the
 * image data. (Unless TileOffsets is used; see TileOffsets.)
 *
 * Note that either SHORT or LONG values may be used to specify the strip
 * offsets. SHORT values may be used for small TIFF files. It should be noted,
 * however, that earlier TIFF specifications required LONG strip offsets and
 * that some software may not accept SHORT values.
 *
 * For maximum compatibility with operating systems such as MS-DOS and Windows,
 * the StripOffsets array should be less than or equal to 64K bytes in length,
 * and the strips themselves, in both compressed and uncompressed forms, should
 * not be larger than 64K bytes.
 *
 * No default. See also StripByteCounts, RowsPerStrip, TileOffsets,
 * TileByteCounts.
 */
const StripOffsets = {
	tag: 273,
	type: [SHORT, LONG],
};

/**
 * The orientation of the image with respect to the rows and columns.
 *
 * 1 = The 0th row represents the visual top of the image, and the 0th column
 * represents the visual left-hand side.
 *
 * 2 = The 0th row represents the visual top of the image, and the 0th column
 * represents the visual right-hand side.
 *
 * 3 = The 0th row represents the visual bottom of the image, and the 0th
 * column represents the visual right-hand side.
 *
 * 4 = The 0th row represents the visual bottom of the image, and the 0th
 * column represents the visual left-hand side.
 *
 * 5 = The 0th row represents the visual left-hand side of the image, and the
 * 0th column represents the visual top.
 *
 * 6 = The 0th row represents the visual right-hand side of the image, and the
 * 0th column represents the visual top.
 *
 * 7 = The 0th row represents the visual right-hand side of the image, and the
 * 0th column represents the visual bottom.
 *
 * 8 = The 0th row represents the visual left-hand side of the image, and the
 * 0th column represents the visual bottom.
 *
 * Default is 1.
 * Support for orientations other than 1 is not a Baseline TIFF requirement.
 */
const Orientation = {
	tag: 274,
	type: [SHORT],
	count: 1,
	default: 1,
};

/**
 * The number of components per pixel.
 *
 * SamplesPerPixel is usually 1 for bilevel, grayscale, and palette-color
 * images.
 * SamplesPerPixel is usually 3 for RGB images.
 *
 * Default = 1.
 * See also BitsPerSample, PhotometricInterpretation, ExtraSamples.
 */
const SamplesPerPixel = {
	tag: 277,
	type: [SHORT],
	count: 1,
	default: 1,
};

/**
 * The number of rows per strip.
 *
 * TIFF image data is organized into strips for faster random access and
 * efficient I/O buffering.
 * RowsPerStrip and ImageLength together tell us the number of strips in the
 * entire image. The equation is:
 *
 * StripsPerImage = floor ((ImageLength + RowsPerStrip - 1) / RowsPerStrip).
 *
 * StripsPerImage is not a field. It is merely a value that a TIFF reader will
 * want to compute because it specifies the number of StripOffsets and
 * StripByteCounts for the image.
 *
 * Note that either SHORT or LONG values can be used to specify RowsPerStrip.
 * SHORT values may be used for small TIFF files. It should be noted, however,
 * that earlier TIFF specification revisions required LONG values and that some
 * software may not accept SHORT values.
 *
 * The default is 2**32 - 1, which is effectively infinity. That is, the entire
 * image is one strip.
 *
 * Use of a single strip is not recommended. Choose RowsPerStrip such that each
 * strip is about 8K bytes, even if the data is not compressed, since it makes
 * buffering simpler for readers.
 * The “8K” value is fairly arbitrary, but seems to work well.
 *
 * See also ImageLength, StripOffsets, StripByteCounts, TileWidth, TileLength,
 * TileOffsets, TileByteCounts.
 */
const RowsPerStrip = {
	tag: 278,
	type: [SHORT, LONG],
	count: 1,
	default: 2 * 32 - 1,
};

/**
 * For each strip, the number of bytes in the strip after compression.
 *
 * This tag is required for Baseline TIFF files.
 * No default.
 * See also StripOffsets, RowsPerStrip, TileOffsets, TileByteCounts.
 */
const StripByteCounts = {
	tag: 279,
	type: [SHORT, LONG],
};

/**
 * The minimum component value used.
 *
 * Default is 0. See also MaxSampleValue.
 */
const MinSampleValue = {
	tag: 280,
	type: SHORT,
	count: SamplesPerPixel => SamplesPerPixel,
	default: 0,
};

/**
 * The maximum component value used.
 *
 * This field is not to be used to affect the visual appearance of an image when
 * it is displayed or printed. Nor should this field affect the interpretation
 * of any other field; it is used only for statistical purposes.
 *
 * Default is 2**(BitsPerSample) - 1.
 */
const MaxSampleValue = {
	tag: 281,
	type: SHORT,
	count: SamplesPerPixel => SamplesPerPixel,
	default: BitsPerSample => Math.pow(2, BitsPerSample) - 1,
};

/**
 * The number of pixels per ResolutionUnit in the ImageWidth direction.
 *
 * It is not mandatory that the image be actually displayed or printed at the
 * size implied by this parameter. It is up to the application to use this
 * information as it wishes.
 *
 * No default.
 * See also YResolution, ResolutionUnit.
 */
const XResolution = {
	tag: 282,
	type: RATIONAL,
	count: 1,
};

/**
 * The number of pixels per ResolutionUnit in the ImageLength direction.
 *
 * No default. See also XResolution, ResolutionUnit.
 */
const YResolution = {
	tag: 283,
	type: RATIONAL,
	count: 1,
};

/**

 * How the components of each pixel are stored.
 *
 * 1 = Chunky format. The component values for each pixel are stored
 * contiguously.
 * The order of the components within the pixel is specified by
 * PhotometricInterpretation. For example, for RGB data, the data is stored as
 * RGBRGBRGB…
 *
 * 2 = Planar format. The components are stored in separate “component planes.”
 * The values in StripOffsets and StripByteCounts are then arranged as a
 * 2-dimensional array, with SamplesPerPixel rows and StripsPerImage columns.
 * (All of the columns for row 0 are stored first, followed by the columns of
 * row 1, and so on.)
 *
 * PhotometricInterpretation describes the type of data stored in each component
 * plane. For example, RGB data is stored with the Red components in one
 * component plane, the Green in another, and the Blue in another.
 *
 * PlanarConfiguration=2 is not currently in widespread use and it is not
 * recommended for general interchange. It is used as an extension and Baseline
 * TIFF readers are not required to support it.
 *
 * If SamplesPerPixel is 1, PlanarConfiguration is irrelevant, and need not be
 * included.
 *
 * If a row interleave effect is desired, a writer might write out the data as
 * PlanarConfiguration=2—separate sample planes—but break up the planes into
 * multiple strips (one row per strip, perhaps) and interleave the strips.
 *
 * Default is 1. See also BitsPerSample, SamplesPerPixel.
 */
const PlanarConfiguration = {
	tag: 284,
	type: SHORT,
	count: 1,
	default: 1,
};

/**
 * For each string of contiguous unused bytes in a TIFF file, the byte offset of
 * the string.
 * Not recommended for general interchange.
 * See also FreeByteCounts.
 */
const FreeOffsets = {
	tag: 288,
	type: LONG,
};

/**
 * For each string of contiguous unused bytes in a TIFF file, the number of
 * bytes in the string.
 * Not recommended for general interchange.
 * See also FreeOffsets.
 */
const FreeByteCounts = {
	tag: 289,
	type: LONG,
};

/**
 * The precision of the information contained in the GrayResponseCurve.
 *
 * Because optical density is specified in terms of fractional numbers, this
 * field is necessary to interpret the stored integer information. For example,
 * if GrayScaleResponseUnits is set to 4 (ten-thousandths of a unit), and a
 * GrayScaleResponseCurve number for gray level 4 is 3455, then the resulting
 * actual value is 0.3455.
 *
 * Optical densitometers typically measure densities within the range of 0.0 to
 * 2.0.
 *
 * 1 = Number represents tenths of a unit.
 * 2 = Number represents hundredths of a unit.
 * 3 = Number represents thousandths of a unit.
 * 4 = Number represents ten-thousandths of a unit.
 * 5 = Number represents hundred-thousandths of a unit.
 *
 * Modifies GrayResponseCurve.
 * See also GrayResponseCurv.
 *
 * For historical reasons, the default is 2. However, for greater accuracy, 3 is
 * recommended.
 */
const GrayResponseUnit = {
	tag: 290,
	type: SHORT,
	count: 1,
	default: 2,
};

/**
 * For grayscale data, the optical density of each possible pixel value.
 *
 * The 0th value of GrayResponseCurve corresponds to the optical density of a
 * pixel having a value of 0, and so on.
 *
 * This field may provide useful information for sophisticated applications, but
 * it is currently ignored by most TIFF readers.
 *
 * See also GrayResponseUnit, PhotometricInterpretation.
 */
const GrayResponseCurve = {
	tag: 291,
	type: SHORT,
	count: BitsPerSample => Math.pow(2, BitsPerSample),
};

/**
 * The unit of measurement for XResolution and YResolution.
 *
 * To be used with XResolution and YResolution.
 *
 * 1 = No absolute unit of measurement. Used for images that may have a
 * non-square aspect ratio, but no meaningful absolute dimensions.
 *
 * The drawback of ResolutionUnit=1 is that different applications will import
 * the image at different sizes. Even if the decision is arbitrary, it might be
 * better to use dots per inch or dots per centimeter, and to pick XResolution
 * and YResolution so that the aspect ratio is correct and the maximum
 * dimension of the image is about four inches (the “four” is arbitrary.)
 *
 * 2 = Inch.
 * 3 = Centimeter.
 * Default is 2.
 */
const ResolutionUnit = {
	tag: 296,
	type: SHORT,
	count: 1,
	default: 2,
};

/**
 * Name and version number of the software package(s) used to create the image.
 *
 * See also Make, Model.
 */
const Software = {
	tag: 305,
	type: ASCII,
};

/**
 * Date and time of image creation.
 *
 * The format is: “YYYY:MM:DD HH:MM:SS”, with hours like those on a 24-hour
 * clock, and one space character between the date and the time. The length of
 * the string, including the terminating NUL, is 20 bytes.
 */
const DateTime = {
	tag: 306,
	type: ASCII,
	count: 20,
};

/**
 * Person who created the image.
 */
const Artist = {
	tag: 315,
	type: ASCII,
};

/**
 * The computer and/or operating system in use at the time of image creation.
 * See also Make, Model, Software.
 */
const HostComputer = {
	tag: 316,
	type: ASCII,
};

/**
 * This field defines a Red-Green-Blue color map (often called a lookup table)
 * for palette color images. In a palette-color image, a pixel value is used to
 * index into an RGB-lookup table.
 * For example, a palette-color pixel having a value of 0 would be displayed
 * according to the 0th Red, Green, Blue triplet.
 * In a TIFF ColorMap, all the Red values come first, followed by the Green
 * values, then the Blue values.
 * In the ColorMap, black is represented by 0,0,0 and white is represented by
 * 65535, 65535, 65535.
 */
const ColorMap = {
	tag: 320,
	type: SHORT,
	count: BitsPerSample => 3 * 2 * BitsPerSample,
};

/**
 * Each value is an offset (from the beginning of the TIFF file, as always) to
 * a child IFD. Child images provide extra information for the parent
 * image such as a subsampled version of the parent image.
 *
 * TIFF data type 13, “IFD,” is otherwise identical to LONG, but is only used
 * to point to other valid IFDs.
 */
const SubIFDs = {
	tag: 330,
	type: [LONG, IFD],
};

/**
 * Description of extra components.
 *
 * Specifies that each pixel has m extra components whose interpretation is
 * defined by one of the values listed below. When this field is used, the
 * SamplesPerPixel field has a value greater than the PhotometricInterpretation
 * field suggests.
 *
 * For example, full-color RGB data normally has SamplesPerPixel=3. If
 * SamplesPerPixel is greater than 3, then the ExtraSamples field describes the
 * meaning of the extra samples. If SamplesPerPixel is, say, 5 then ExtraSamples
 * will contain 2 values, one for each extra sample.
 *
 * ExtraSamples is typically used to include non-color information, such as
 * opacity, in an image. The possible values for each item in the field's value
 * are:
 *
 * 0 = Unspecified data
 * 1 = Associated alpha data (with pre-multiplied color)
 * 2 = Unassociated alpha data
 *
 * Associated alpha data is opacity information; it is fully described in
 * Section 21. Unassociated alpha data is transparency information that
 * logically exists independent of an image; it is commonly called a soft matte.
 * Note that including both unassociated and associated alpha is undefined
 * because associated alpha specifies that color components are pre-multiplied
 * by the alpha component, while unassociated alpha specifies the opposite.
 *
 * By convention, extra components that are present must be stored as the “last
 * components” in each pixel. For example, if SamplesPerPixel is 4 and there is
 * 1 extra component, then it is located in the last component location
 * (SamplesPerPixel-1) in each pixel.
 *
 * Components designated as “extra” are just like other components in a pixel.
 * In particular, the size of such components is defined by the value of
 * the BitsPerSample field.
 *
 * With the introduction of this field, TIFF readers must not assume a
 * particular SamplesPerPixel value based on the value of the
 * PhotometricInterpretation field. For example, if the file is an RGB file,
 * SamplesPerPixel may be greater than 3.
 *
 * The default is no extra samples. This field must be present if there are
 * extra samples.
 *
 * See also SamplesPerPixel, AssociatedAlpha.
 */
const ExtraSamples = {
	tag: 338,
	type: SHORT,
};

/**
 * XMP is an extensible way to include metadata such as meaningful descriptions
 * and titles, searchable keywords, and up-to-date author and copyright
 * information.
 */
const XMP = {
	tag: 700,
	type: BYTE,
};

/**
 * Copyright notice of the person or organization that claims the copyright to
 * the image. The complete copyright statement should be listed in this field
 * including any dates and statements of claims. For example, “Copyright, John
 * Smith, 19xx. All rights reserved.”
 */
const Copyright = {
	tag: 33432,
	type: ASCII,
};

module.exports = {
	NewSubfileType,
	ImageWidth,
	ImageLength,
	BitsPerSample,
	Compression,
	PhotometricInterpretation,
	CellWidth,
	CellLength,
	FillOrder,
	ImageDescription,
	Make,
	Model,
	StripOffsets,
	Orientation,
	SamplesPerPixel,
	RowsPerStrip,
	StripByteCounts,
	MinSampleValue,
	MaxSampleValue,
	XResolution,
	YResolution,
	PlanarConfiguration,
	FreeOffsets,
	FreeByteCounts,
	GrayResponseUnit,
	GrayResponseCurve,
	ResolutionUnit,
	Software,
	DateTime,
	Artist,
	HostComputer,
	ColorMap,
	SubIFDs,
	ExtraSamples,
	XMP,
	Copyright,
};
