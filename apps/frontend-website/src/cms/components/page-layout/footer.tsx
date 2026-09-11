
import {
	Link,
} from "react-router"

import { GodrejLogo } from "~/__lib/this/ui/components/godrej-logo"
import { WYSIWYG } from "../wysiwyg"

interface FooterNavigationProps extends React.ComponentProps<"footer"> {
	blurb: unknown;
	navigation: Array<{ label: string, url: string }>;
}
export function Footer ( { blurb = [ ], navigation, className }: FooterNavigationProps ) {
	return <footer className={ className }>
		<nav className="bg-primary relative after:absolute after:top-0 after:right-0 after:w-1/3 after:h-full md:after:bg-mine-shaft overflow-hidden">
			<div className="container md:grid-layout">
				<div className="py-6 lg:py-9 start-col-1 end-col-5 lg:end-col-7">
					<div className="md:w-2c-1g lg:w-3c-2g text-white">
						<WYSIWYG.Renderer content={ blurb } className="!mt-0 [&_p]:text-h3 md:[&_p]:text-h4 lg:[&_p]:text-h5" />
					</div>
					<div className="mt-10 md:mt-15.5 lg:mt-28 text-white">
						<ul className="flex flex-col md:flex-row flex-wrap gap-1g pb-4 md:pb-0 md:pr-8 lg:pr-12 | text-p md:text-sm font-bold uppercase">
							{ navigation.map( ( { label, url }, i ) => <li key={ i } className="md:w-[calc((100%-(2*var(--gutter-width)))/3)] border-t border-secondary border-solid pt-4.5 md:pt-3"><Link to={ url }>{ label }</Link></li> ) }
						</ul>
					</div>
				</div>
				<div className="relative start-gutter-5 lg:start-gutter-7 end-col-last lg:ml-0 py-4.5 md:pl-8 md:py-6 lg:pl-12 lg:py-10 bg-mine-shaft text-white z-10 | before:absolute before:top-0 before:right-full before:w-1/2 before:h-full before:bg-mine-shaft md:before:hidden after:absolute after:top-0 after:left-full after:w-1/2 after:h-full after:bg-mine-shaft">
					<div className="md:flex flex-col justify-between h-full bg-mine-shaft">
						<Link to={ "/" }>
							<GodrejLogo className="max-md:w-25 md:w-1c h-auto fill-white" />
						</Link>
						<div className="mt-10">
							<p className="md:mt-auto font-mono text-2xs md:text-sm/[normal] font-bold">Copyright © Godrej Enterprises Group. All rights reserved</p>
							<ul className="mt-4 md:mt-3 flex md:max-lg:flex-wrap justify-between | font-mono text-2xs md:text-sm font-bold">
								<li><Link to="https://www.godrejenterprises.com/legal" target="_blank">Legal</Link></li>
								<li><Link to="https://www.godrejenterprises.com/legal/disclaimer" target="_blank">Disclaimer</Link></li>
								<li><Link to="https://www.godrejenterprises.com/legal/privacy-policy" target="_blank">Privacy Policy</Link></li>
								<li><Link to="https://www.godrejenterprises.com/legal/terms-and-conditions" target="_blank">Terms &amp; Conditions</Link></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav>
	</footer>
}
