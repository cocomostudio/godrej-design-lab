
# about
We cover how to register and create a new route.
Refer to the React Router [docs](https://reactrouter.com/start/framework/routing) for more in-depth coverage on this.


# Procedure
Say you want to create a new page — "Contact Us" and you want the URL slug to be `/contact-us`. Here's how you'd go about doing this:

## 01. Add a new route entry in the `routes.ts` file
```routes.ts
export default [
	index( "routes/home.tsx" ),
	layout( "./layouts/primary-layout.tsx", [
		route( "about", "routes/about.tsx" ),
		route( "contact-us", "routes/contact-us.tsx" ),
	] )
] satisfies RouteConfig
```
If you don't want the route to inherit the header and footer, simply place the entry outside of the `layout` function:
```routes.ts
export default [
	index( "routes/home.tsx" ),
	layout( "./layouts/primary-layout.tsx", [
		route( "about", "routes/about.tsx" ),
	] ),
	route( "contact-us", "routes/contact-us.tsx" ),
] satisfies RouteConfig
```
The layout — `./layouts/primary-layout.tsx` is where the header and footer that is shared by all pages on the website is implemented.

The `routes/contact-us.tsx` file is where you declared you're to place the route handling code. But it can be any file. You can put the route handler in `some/other/directory/xyx.tsx`.

## 02. Create the route file
As you've mentioned in the previous step, you'll have to creat the following file: `route/contact-us.tsx`
```route/contact-us.tsx
export default function ThisPage () {
	return <div>
		<h1>Contact us</h1>
		<main>
			<p>...</p>
		</main>
	</div>
}
```
React Router expects route files **that return UI** to have a _default export_. If returning an API response, then you don't need to have a default export. Refer to the docs linked above for that.
The _default export_ is essentially a React function component. You can write your regular React code here.
