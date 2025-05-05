
import type React from "react"

import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router"

import type { Route } from "./+types/fellow-single"

export default function ThisPage () {
	return <div className="container md:grid-layout">
		<div className="start-col-2 end-col-last lg:start-col-3">
			<Heading />
			<Content className="mt-4 md:mt-8 lg:mt-10 lg:w-9c-8g" />
		</div>
	</div>
}



function Heading () {
	return <>
		<h1 className="mt-8 text-h1 font-bold uppercase">
			<span className="text-primary">North</span>
			<br />
			<span className="text-secondary">Rahul Bhusan</span>
		</h1>
		<p className="mt-4 md:mt-8 lg:mt-10 font-mono text-sm md:text-p font-bold">2024 Godrej Design Lab Fellow</p>
	</>
}

function Content ( { className }: React.ComponentProps<"div"> ) {
	return <div className={ className }>
		<div className="md:flex md:gap-1g">
			<div>
				<figure className="max-md:size-[--content-width] rounded-md overflow-hidden">
					<img src="/media/rahul-bhusan.png" alt="Rahul Bhusan" className="md:w-2c-1g lg:w-3c-2g md:aspect-square object-cover" />
				</figure>
			</div>
			<div className="mt-4 md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
				<p className="text-p">NORTH is driven by the profound sense of responsibility its architects and artists feel, to safeguard the wisdom of their homeland and to create meaningful spaces which enable conscious living. The collective designs and builds structures, conducts experiential workshops, and hosts people through regenerative travel at their campus in Naggar, Himachal Pradesh.</p>

				<p className="text-p">Based upon a decade of on-the-ground research and documentation into centuries-old vernacular buildings and the cultures that surround them, NORTH’s design practice is rooted in research, innovation, and practical exploration. On campus is a diverse team of engineers, designers, architects, craftspeople and artists, all on a journey of learning-by-making, continually experimenting with traditional building techniques and natural materials to harmonize with today’s culture, while also nodding to the future.</p>

				<p className="text-p">NORTH sees sustainability as a fundamental quality, core to every action. Every project starts with a simple question: “why?” That question drives humility, an openness to learn from nature, and an insistence to build with intention.</p>

				<p className="text-p">Through the Fellowship with Godrej Design Lab, NORTH’s founder, Rahul Bushan, has started a larger project to collect his design insights and life lessons into a book. While the story may be personal and specific, the lessons are highly relevant to a world in search of sustainable solutions and meaningful living.</p>

				<p className="text-p">“These learnings and lessons come from my natural building practice, from growing up in small mountain villages in the Himalayas and from being the black sheep of a family who has worked government jobs for generations — only to start my own business as a creative. Through the lens of my journey, the book will share mountain living wisdom and how to apply the lessons of vernacular architecture in a practical way. It will hopefully be used as a creative guide for entrepreneurs, young architects and people who strive to go above and beyond. It is a journey on how to live a life with purpose.”</p>
			</div>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black" />

			<h3 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-primary">From the GDL Team</h3>

			<p className="font-mono text-p font-bold">Rahul’s passion is clear – he is driven by an intense curiosity in how environment and design combine to create, shape, and reflect culture. In channeling this passion, Rahul has been able to muster a highly creative and talented team to not just preserve vernacular architecture in amber, but to understand how it actively works with the environment, culture, living and then to recontextualize it into projects which are built for today and the future.</p>

			<p className="font-mono text-p font-bold">In an industry and a place grappling with the push-and-pull of “past” and “future,” “organic” and “synthetic,” “urban” and “rural,” we were excited to be part of a project which aims to explore, uncover, and share how a young architect has experienced and responded to this context.</p>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black" />

			<h2 className="text-h1 font-bold uppercase">
				<span className="text-primary">About the Book</span>
				<br />
				<span className="text-secondary">in my own words</span>
			</h2>

			<div className="md:ml-2c-2g md:w-5c-4g lg:ml-3c-3g lg:w-6c-5g | space-y-6 md:space-y-8">
				<p className="text-p">What does it mean to build something lasting— not just in stone or wood, but in values, culture, and purpose? Why do stories of belonging captivate and ground us in something larger than ourselves?</p>

				<p className="text-p">Born in the mountains of Himachal Pradesh, this book is an answer to these questions. A journey through mountains and memories, architecture and artistry, culture and community. It is my testament to how ancient wisdom and modern vision can come together to craft something transformative.</p>

				<p className="text-p">At its heart, the book is a modest endeavour to share the lessons, values and wisdom that living in the ‘Valley of Gods’ is teaching me. From these principles, my architectural practice has formed a tentative voice, my research has found meaning outside written pages into reality as natural homes, and every day is filled with purpose to build a life and a community, rooted in coexistence.</p>

				<p className="text-p">Inside the current manuscript, you will find vernacular architecture research, Himachali craft documentation, on-site experiments with natural buildings, illustrations of mountain life and beyond, intangible cultural heritage, age-old transcribed and translated folk songs, mystical oral stories passed down from generations, a life-changing trek studying high altitude roots and plants used for medicinal and shamanistic purposes, detailed architectural drawings, sketches of tools and objects worn with time—all bound together into a single, tumultuous and passion-filled narrative.</p>

				<p className="text-p">Not just a memoir or a technical manual—it is becoming an experiential guide for dreamers and doers. For entrepreneurs, it offers lessons on creating purpose-driven businesses, rooted in authenticity rather than the rush of commercialism. For architects, it presents a new outlook, encouraging them to find their niche in a saturated world. And for creatives, it shows how one’s roots can become the foundation for something monumental.</p>

				<p className="text-p">It hopes to be an experience, a guide, a piece of living history that motivates us to find the answers and a more fulfilling life deep within our roots.</p>
			</div>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black" />

			<div className="md:flex md:gap-1g">
				<h2 className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary">Design Team</h2>

				<div className="max-md:mt-6 w-5c-4g lg:w-6c-5g | space-y-6 md:space-y-8">
					<p className="font-mono text-p font-bold">NORTH Design Team</p>

					<ul className="columns-2 md:columns-2c-2g lg:columns-3c-1g font-mono text-p font-bold">
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Swara Goswani</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Ritika Bhushan</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Tirth Raj</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Sreeram S</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Kainat Bashir</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Saloni Tehri</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Arpita Sharma</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Oshi Ubeja</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Puran Thapa</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Aashi Suhane</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Parnika Malik</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Himanshu Kene</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Himanshu Wanjari</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Sukhwinder Kaur</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Kishan Hirpara</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Jitendra Jadawat</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Anushka Sawant</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Aditya Kangankar</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Lahari Pandiri</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Mallika Singh</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Manasa Saravanan</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Heeya Mashru</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Samkit Racca</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Sindura</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Aayush Sharma</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Thakar Chand</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Suari Devi</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Khubram Rana</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Robert Stephens</p></li>
					</ul>
				</div>
			</div>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black/30" />

			<div className="md:flex md:gap-1g">
				<h2 className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary">Book Design</h2>

				<div className="max-md:mt-6 w-5c-4g lg:w-6c-5g | space-y-6 md:space-y-8">
					<ul className="columns-2 md:columns-2c-2g font-mono text-p font-bold">
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">WARI WATAI</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Ram Sinai</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Ragini Mundra</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Nikita Dhamija</p></li>
					</ul>
				</div>
			</div>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black/30" />

			<div className="md:flex md:gap-1g">
				<h2 className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary">Illustration</h2>

				<div className="max-md:mt-6 w-5c-4g lg:w-6c-5g | space-y-6 md:space-y-8">
					<ul className="font-mono text-p font-bold">
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Abhimanyu Ghimiray</p></li>
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Mansi Thakkar</p></li>
					</ul>
				</div>
			</div>
		</div>

		<div className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10">
			<hr className="border-black/30" />

			<div className="md:flex md:gap-1g">
				<h2 className="md:w-2c-1g lg:w-3c-2g text-h4 font-bold uppercase text-secondary">Printing House</h2>

				<div className="max-md:mt-6 w-5c-4g lg:w-6c-5g | space-y-6 md:space-y-8">
					<ul className="font-mono text-p font-bold">
						<li className="flex gap-2 before:content-['•'] before:mt-[0.25em] lg:before:mt-[0.5rem] before:text-2xs"><p className="inline">Pragati Offset</p></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
}
