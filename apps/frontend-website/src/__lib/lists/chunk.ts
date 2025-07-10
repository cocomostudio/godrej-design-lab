
export function chunk<T> (
	list: T[] | null | undefined,
	chunk_size: number = 1
): T[][] {
	const list_length = Array.isArray( list )
			? list.length
			: 0

	if (
		! list_length
		|| chunk_size < 1
	) {
		return [ ]
	}

	let index = 0
	let resIndex = 0
	let result: T[][] = Array( Math.ceil( list_length / chunk_size ) )

	while ( index < list_length ) {
		const end_slice_index = index + chunk_size
		result[ resIndex++ ] = ( list as T[] ).slice( index, end_slice_index )
		index = end_slice_index
	}
	return result
}
