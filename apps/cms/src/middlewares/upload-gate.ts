
/**
 |
 | Nothing that a computer can execute gets into the media library.
 |
 | The VAPT report found that the media library accepted arbitrary
 | files. That makes a Godrej domain a convenient place from which to
 | serve malware. This is the gate that closes it on the version
 | running today.
 |
 | **It checks what a file claims to be, not what it is.** The browser
 | declares the media type and the filename supplies the extension.
 | Both are the caller's to choose, so a caller who lies about both
 | still gets a payload past this. The gate that reads the file's own
 | signature does not exist below Strapi 5.33.3. It arrives with the
 | upgrade — see ticket `10-file-type-validated-by-signature` under
 | `__this-project/build-plans/2026-09-11__vapt-remediation/tickets/`.
 |
 | This one is kept afterwards rather than replaced. It states the
 | intent in a file somebody will read. It fails early, with a message
 | an editor can act on, rather than deep inside the upload service.
 | And it survives somebody widening the allow-list later.
 |
 | Ticket: `04-media-library-refuses-executables`.
 |
 */

import path from "node:path"

import type { Core } from "@strapi/strapi"

/**
 |
 | The allow-list: images, video, PDF. Everything else is refused.
 |
 | Two halves, because a file arrives wearing two claims and either one
 | can be the lie. Both halves have to pass.
 |
 | The extensions are written out rather than resolved through
 | `mime-types`. At the version this repository pins, that library does
 | not know `.avif`, and it answers `text/x-fortran` for a file with no
 | extension at all.
 |
 */
const PERMITTED_MEDIA_TYPE_PREFIXES = [ "image/", "video/" ]

const PERMITTED_MEDIA_TYPES = new Set( [
	"application/pdf",
] )

const PERMITTED_EXTENSIONS = new Set( [
	// Images
	"jpg", "jpeg", "jpe", "png", "gif", "webp", "avif",
	"bmp", "tif", "tiff", "ico", "heic", "heif",
	// Video
	"mp4", "m4v", "mov", "webm", "ogv", "avi",
	"mpeg", "mpg", "mkv", "3gp",
	// Documents
	"pdf",
] )

/**
 |
 | The two claims a file makes about itself, and the values of each
 | that some list cares about.
 |
 | The allow-list above is not one of these. It is asymmetric: both
 | claims have to pass it, and one half of it matches on a prefix. The
 | lists below are the other shape — either claim matching is enough.
 |
 */
type Claim_List = {
	media_types: Set<string>
	extensions: Set<string>
}

/**
 |
 | The deny-list.
 |
 | Redundant against the allow-list — anything here would be refused by
 | it anyway — and kept for two reasons. It is what the report asked
 | for in as many words. And it is what turns a shrug of a refusal into
 | one that names the actual problem. That is the difference between an
 | editor supplying a different file and an editor filing a bug.
 |
 */
const EXECUTABLES: Claim_List = {
	media_types: new Set( [
		// Windows
		"application/x-msdownload",
		"application/x-msdos-program",
		"application/x-dosexec",
		"application/x-msdos-batch",
		"application/vnd.microsoft.portable-executable",
		"application/x-ms-installer",
		"application/x-msi",
		"application/x-ms-shortcut",
		"application/hta",
		// Unix and macOS
		"application/x-executable",
		"application/x-elf",
		"application/x-sharedlib",
		"application/x-mach-binary",
		"application/x-apple-diskimage",
		// Packages
		"application/vnd.android.package-archive",
		"application/x-debian-package",
		"application/x-rpm",
		"application/java-archive",
		"application/x-java-archive",
		"application/java-vm",
		// Scripts
		"application/x-sh",
		"application/x-shellscript",
		"application/x-csh",
		"application/x-powershell",
		"application/x-httpd-php",
		"application/x-php",
		"application/x-perl",
		"application/x-python",
		"application/x-python-code",
		"application/x-ruby",
		"application/javascript",
		"application/x-javascript",
		"application/ecmascript",
		"text/x-sh",
		"text/x-shellscript",
		"text/x-php",
		"text/x-perl",
		"text/x-python",
		"text/x-ruby",
		"text/javascript",
	] ),

	extensions: new Set( [
		// Windows
		"exe", "dll", "com", "scr", "cpl", "sys", "drv", "ocx",
		"msi", "msp", "mst", "msix", "appx",
		"bat", "cmd", "pif", "hta", "gadget", "lnk", "reg",
		// Unix and macOS
		"so", "dylib", "elf", "bin", "out", "run", "app",
		"command", "appimage",
		// Packages
		"apk", "ipa", "deb", "rpm", "dmg", "pkg", "snap", "flatpak",
		"jar", "war", "ear", "class",
		// Scripts
		"sh", "bash", "zsh", "ksh", "csh", "fish",
		"ps1", "psm1", "psd1",
		"vb", "vbs", "vbe", "js", "jse", "mjs", "cjs",
		"wsf", "wsh", "ws",
		"php", "php3", "php4", "php5", "php7", "php8",
		"phtml", "phps", "phar",
		"py", "pyc", "pyo", "pyw",
		"pl", "pm", "cgi", "rb", "lua", "scpt",
		"asp", "aspx", "ashx", "asmx", "ascx",
		"jsp", "jspx", "cfm",
	] ),
}

/**
 |
 | SVG is refused on its own terms, with its own message.
 |
 | It matches the `image/` prefix, so the allow-list alone would let it
 | through. It is XML, and a browser executes the code an SVG can
 | carry. No field in the content model asks for one. Strapi itself
 | began denying it by default several versions after the one running
 | here.
 |
 */
const SVG: Claim_List = {
	media_types: new Set( [
		"image/svg+xml",
		"image/svg",
	] ),

	extensions: new Set( [
		"svg",
		"svgz",
	] ),
}

/**
 |
 | A declared type that declares nothing.
 |
 | Browsers send `application/octet-stream` for formats they do not
 | recognise. HEIC and AVIF are both on that list, and both come off an
 | editor's phone. Reading the string as a claim would therefore refuse
 | photographs, so it is read as the absence of a claim instead. The
 | extension then decides alone.
 |
 | That costs nothing. The extension has to be on the allow-list either
 | way, so a caller gains no ground by declaring this rather than
 | `image/png`.
 |
 */
const UNSTATED_MEDIA_TYPES = new Set( [
	"application/octet-stream",
	"binary/octet-stream",
	"application/unknown",
] )

const ACCEPTED_TYPES_SENTENCE =
	"The media library accepts images, video and PDF."

/**
 |
 | What one parsed file looks like on the request.
 |
 | `strapi::body` parses the multipart body with formidable — the
 | parser behind koa-body — and leaves each file on
 | `ctx.request.files`. Only the two fields this gate reads are named
 | here.
 |
 */
type Uploaded_File = {
	originalFilename?: string | null
	mimetype?: string | null
}

/**
 |
 | Registered after `strapi::body` and before the router. By the time
 | this runs the multipart body is parsed into files, and no controller
 | has seen them.
 |
 | It is not scoped to the upload plugin's paths. It fires on any
 | request carrying a file. That is the upload plugin's two routes
 | today, and it is the right default for whatever accepts a file next.
 |
 */
const upload_gate: Core.MiddlewareFactory = () => {
	return async function upload_gate_middleware ( ctx, next ) {
		const refusals = uploaded_files( ctx )
			.map( refusal_for )
			.filter( ( refusal ): refusal is string => refusal !== null )

		if ( refusals.length > 0 ) {
			/**
			 |
			 | 415, in Strapi's own error envelope. `ctx` carries a
			 | setter per HTTP status, and each one writes the shape
			 | the admin panel reads. The admin renders
			 | `error.message` underneath the asset that failed, so
			 | this string is the one an editor sees.
			 |
			 | The request stops here. `strapi::body` removes the
			 | temporary files it wrote on its way back out, so a
			 | refused upload leaves nothing on disk.
			 |
			 */
			return ( ctx as any ).unsupportedMediaType( refusals.join( " " ) )
		}

		await next()
	}
}

/**
 |
 | Every file on the request, whatever field name it arrived under.
 |
 | The upload plugin uses `files`. A single-file upload arrives as one
 | object rather than an array of one.
 |
 */
function uploaded_files ( ctx: any ): Uploaded_File[] {
	const fields = ctx?.request?.files

	if ( !fields || typeof fields !== "object" ) {
		return []
	}

	return Object.values( fields )
		.flat()
		.filter( ( entry ): entry is Uploaded_File =>
			entry !== null && typeof entry === "object" )
}

/**
 |
 | Why this file is not welcome, or `null` if it is.
 |
 | The order is the message's order rather than the check's. The
 | specific reasons come first, so that an editor who uploaded a shell
 | script is told it was a shell script rather than read the
 | allow-list.
 |
 */
function refusal_for ( file: Uploaded_File ): string | null {
	const name = filename_for_display( file.originalFilename )
	const extension = extension_of( file.originalFilename )
	const declared = declared_media_type_of( file.mimetype )

	if ( either_claim_matches( EXECUTABLES, extension, declared ) ) {
		return `${ name } was refused: it is an executable or a `
			+ `script. ${ ACCEPTED_TYPES_SENTENCE }`
	}

	if ( either_claim_matches( SVG, extension, declared ) ) {
		return `${ name } was refused: SVG is not accepted, because a `
			+ `browser will execute the code an SVG can carry. Supply `
			+ `a PNG or a JPEG instead.`
	}

	/**
	 |
	 | A name with no extension leaves the declared type to answer
	 | alone. It is allowed to: a file called `photo` that says it is
	 | a JPEG uploaded before this middleware existed, and refusing it
	 | now would be this ticket taking something away from an editor.
	 |
	 | The two lists above have already had their say, so the type
	 | doing the vouching cannot be an executable or an SVG.
	 |
	 */
	if ( extension === null ) {
		if ( declared !== null && is_permitted_media_type( declared ) ) {
			return null
		}

		return `${ name } was refused: its name carries no file `
			+ `extension, and it does not say what it is either. `
			+ ACCEPTED_TYPES_SENTENCE
	}

	if ( !PERMITTED_EXTENSIONS.has( extension ) ) {
		return `${ name } was refused: a .${ extension } file is not `
			+ `one of the types accepted here. `
			+ ACCEPTED_TYPES_SENTENCE
	}

	if ( declared !== null && !is_permitted_media_type( declared ) ) {
		return `${ name } was refused: it says it is a `
			+ `${ for_a_message( declared ) } file. `
			+ ACCEPTED_TYPES_SENTENCE
	}

	return null
}

/**
 |
 | Whether a file's extension or its declared type puts it on this
 | list. Either one is enough: a list of things to refuse has done its
 | job the moment one claim admits to being on it.
 |
 */
function either_claim_matches (
	list: Claim_List,
	extension: string | null,
	declared: string | null,
): boolean {
	return ( extension !== null && list.extensions.has( extension ) )
		|| ( declared !== null && list.media_types.has( declared ) )
}

function is_permitted_media_type ( declared: string ): boolean {
	return PERMITTED_MEDIA_TYPES.has( declared )
		|| PERMITTED_MEDIA_TYPE_PREFIXES.some(
			prefix => declared.startsWith( prefix ) )
}

/**
 |
 | The last extension in the filename, lowercased and without its dot.
 |
 | Only the last one. `payload.php.jpg` is therefore read as a JPEG and
 | accepted. A double extension matters on a server that decides how to
 | execute a file from its name. This stack is not one, and reading
 | every segment would refuse `node.js.logo.png`. The file's signature
 | settles that case, and that is ticket 10.
 |
 */
function extension_of ( filename: unknown ): string | null {
	if ( typeof filename !== "string" ) {
		return null
	}

	const extension = path.extname( filename ).slice( 1 ).toLowerCase()

	return extension === "" ? null : extension
}

/**
 |
 | The media type the client claimed, without its parameters. `null`
 | where the claim was empty, or where it amounts to "I do not know".
 |
 */
function declared_media_type_of ( mimetype: unknown ): string | null {
	if ( typeof mimetype !== "string" ) {
		return null
	}

	const declared = mimetype.split( ";" )[ 0 ].trim().toLowerCase()

	if ( declared === "" || UNSTATED_MEDIA_TYPES.has( declared ) ) {
		return null
	}

	return declared
}

/**
 |
 | The admin panel runs the refusal through `react-intl` before showing
 | it, and react-intl reads ICU. A brace opens a placeholder and an
 | angle bracket opens a rich-text tag. Either one, left unclosed,
 | costs the editor the whole message — which is the one thing this
 | middleware is for.
 |
 | Every caller-controlled string goes through here on its way into a
 | refusal. Both of them are: the filename, and the media type the
 | caller declared, which is a header value and just as free-form.
 |
 */
function for_a_message ( text: string ): string {
	return text.replace( /[{}<>]/g, "" )
}

function filename_for_display ( filename: unknown ): string {
	if ( typeof filename !== "string" || filename.trim() === "" ) {
		return "The file"
	}

	return for_a_message( filename )
}

export default upload_gate
