
export function DocumentMeta ({ title, site_title, description, cover }) {
	const full_title = title + " | " + site_title
	return <>
		<title>{ full_title }</title>
		<meta property="og:title" content={ full_title } />
		{ description && <meta property="og:description" content={ description } /> }
		{ cover && <meta property="og:image" content={ cover.url } /> }
	</>
}
