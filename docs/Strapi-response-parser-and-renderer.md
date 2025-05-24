
# about
Covers how to build a parser and renderer for a recursive data structure.
The data Strapi returns from its API is roughly a hierarchical data structure, which isn't to dissimilar from a virtual DOM data structure that React works with.

# Introduction
The payload that Strapi returns is somewhat along these lines:
```js
[
	{
		__type: "paragraph",
		fontFamily: "sans-serif",
		content: "This is a paragraph."
	},
	{
		__type: "section",
		content: [
			{
				__type: "paragraph",
				fontFamily: "monospace",
				content: "This is also a paragraph."
			},
		]
	}
]
```

# Building a recursive tree renderer
## 01. Create React components
```jsx
function Paragraph ( { fontFamily, children } ) {
	return <p style={{ fontFamily }}>{ children }</p>
}

function Section ( { children } ) {
	return <section>{ children }</section>
}
```

## 02. Create a type-to-component mapping
```js
const componentMap = {
	paragraph: Paragraph,
	section: Section
}
```

## 03. Implement the (recursive) render function
```jsx
function renderNode ( node ) {
	if ( typeof node === "string" ) {
		return node
	}

	const { __type, children, ...props } = node
	const Component = componentMap[ __type ]

	if ( ! Component ) {
		console.warn( `Unknown component type: ${ __type }` );
		return null
	}

	const childElements = Array.isArray( children )
		? children.map( ( child, index ) => <React.Fragment key={ index }>{ renderNode( child ) }</React.Fragment> )
		: renderNode( children )

	return <Component { ...props }>
		{ childElements }
	</Component>
}

function renderTree ( data ) {
	return data.map( function ( node, index ) {
		return <React.Fragment key={ index }>
			{ renderNode( node ) }
		</React.Fragment>
	} )
}
```

# Usage
```jsx
const treeData = [
	/* your data structure here */
]

function App () {
	return <div>
		{ renderTree( treeData ) }
	</div>
}
```
