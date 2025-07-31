
export function HorizontalRule ( { shade }: { shade: "light" | "dark" } ) {
	return <hr className={ `mt-6 md:mt-8 lg:mt-10 ${ shade === "light" ? "border-black/30" : "border-black" }` } />
}
