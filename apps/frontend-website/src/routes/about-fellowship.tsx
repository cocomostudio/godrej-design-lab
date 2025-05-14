import type React from "react";

export default function ThisPage() {
	return (
		<div className="container md:grid-layout">
			<div className="start-col-2 end-col-last lg:start-col-3">
				<Heading />
				<Content className="mt-4 md:mt-8 lg:mt-10 lg:w-9c-8g" />
			</div>
		</div>
	);
}

function Heading() {
	return (
		<>
			<h1 className="mt-8 text-h1 font-bold uppercase">
				<span className="text-maroon-red">About</span>
				<br />
				<span className="text-red">The Fellowship Program</span>
			</h1>
		</>
	);
}

function Content({ className }: React.ComponentProps<"main">) {
	return (
		<main className={className}>
			<IntroSection className="md:flex md:flex-col md:gap-1g" />

			<HowWeSupport />


			{/* <WhyGDL className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" />

	  <WhatWeDO className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" />

	  <OurTeam className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" /> */}
		</main>
	);
}

function IntroSection({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
				<p className="text-p">
					The Godrej Design Lab Fellowship Program aims to engage with India’s vibrant design space by empowering pioneering talent to showcase their passion, expertise, and vision. <br /><br />

					Since inception, the program has worked with 40+ talented individuals from across India on projects ranging from furniture and product design, to materials research, to social impact  and education. We are proud to be part of each Fellow’s journey.
				</p>
			</div>

			<div className="md:flex md:justify-between gap-5">
				<div>
					<img className="rounded" src="https://i.ibb.co/r29Q3z9c/fellowship-1.png" alt="" />
				</div>
				<div>
					<img className="rounded" src="https://i.ibb.co/Q7TtsgKp/fellowship-1.png" alt="" />
				</div>
			</div>

			<div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
				<p className="text-p">
					Over the years, we have seen a clear deepening of the talent pool in the Indian design ecosystem. We have also seen the ecosystem become more multifaceted, interdisciplinary, and purpose-driven. And over the years, the program, too, has changed and matured from a design showcase highlighting promising work in the interiors space, to a program wanting to reflect the diverse impact and forms that design takes. <br /><br />

					In its current form as a one-year, non-residential, grants-based program, the Fellowship aims to catalyze future leaders in the Indian design ecosystem to
					make innovative impact across multiple domains of design. To this end, the program has grown to include opportunities for Fellows to come together and learn from each other. Over time, the program will continue to evolve to respond and offer a pioneering space to the ever changing Indian design ecosystem.
				</p>
			</div>
			<div>
				<img className="rounded w-full" src="https://i.ibb.co/35PHwz8D/fellowship-3.png" alt="Fellowship 2018 Naik & shah" />
			</div>
			<hr className="border-black" />
		</section>
	);
}

function HowWeSupport({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div>
				<h1 className="mt-8 text-h1 font-bold uppercase">
					<span className="text-maroon-red">How we Support</span>
				</h1>
			</div>
		</section>
	);
}