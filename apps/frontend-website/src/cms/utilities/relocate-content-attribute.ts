
type WithContent<T> = T & { content: unknown };

export function relocate_content_attribute <T extends Record<string, unknown>> ( obj: WithContent<T> ): Omit<T, "content"> & { __content: unknown } {
	const { content, ...rest } = obj;
	return {
		__content: content,
		...rest
	}
}
