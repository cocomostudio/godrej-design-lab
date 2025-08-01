
export function replace_by_cloned_source ( options ) {
	const clone = options.clone
	return function ( target, source ) {
		return clone( source )
	}
}
