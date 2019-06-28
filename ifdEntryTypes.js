const BYTE = 0x01; // 8-bit unsigner integer.
const ASCII = 0x02; // 8-bit byte that contains a 7-bit ASCII code; the last byte must be 0x00.
const SHORT = 0x03; // 16-bit (2-byte) unsigned integer.
const LONG = 0x04; // 32-bit (4-byte) unsigned integer.
const RATIONAL = 0x05; // Two LONGs: the first represents the numerator of a fraction; the second, the denominator.
const SBYTE = 0x06; // An 8-bit signed (twos-complement) integer.
const UNDEFINED = 0x07; // An 8-bit byte the may contain anything, depending on the definition of the field.
const SSHORT = 0x08; // A 16-bit (2-byte) signed (twos-complement) integer.
const SLONG = 0x09; // A 32-bit (4-byte) signed (twos-complement) integer.
const SRATIONAL = 0x0a; // Two SLONG’s: the first represents the numerator of a fraction, the second the denominator.
const FLOAT = 0x0b; // Single precision (4-byte) IEEE format.
const DOUBLE = 0x0c; // Double precision (8-byte) IEEE format.
const IFD = 0x0d; // It's identical to LONG, but is only used to point to other valid IFDs.
const UNDEFINED = 0x00;

module.exports = {
	BYTE,
	ASCII,
	SHORT,
	LONG,
	RATIONAL,
	SBYTE,
	UNDEFINED,
	SSHORT,
	SLONG,
	SRATIONAL,
	FLOAT,
	DOUBLE,
	IFD,
	UNDEFINED,
};
