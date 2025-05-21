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
			<HowWeSupport className="md:flex md:flex-col md:gap-1g" />
			<TFJ className="md:flex md:flex-col md:gap-1g" />
		</main>
	);
}

function IntroSection({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
				<p className="text-p">
					The Godrej Design Lab Fellowship Program aims to engage with India’s
					vibrant design space by empowering pioneering talent to showcase their
					passion, expertise, and vision. <br />
					<br />
					Since inception, the program has worked with 40+ talented individuals
					from across India on projects ranging from furniture and product
					design, to materials research, to social impact and education. We are
					proud to be part of each Fellow’s journey.
				</p>
			</div>

			<div className="md:flex md:justify-between gap-1g">
				<div className="mt-4 md:mt-0 grow">
					<img
						className="rounded-md w-full"
						src="https://i.ibb.co/Q7TtsgKp/fellowship-1.png"
						alt=""
					/>
				</div>
				<div className="mt-4 md:mt-0 grow">
					<img
						className="rounded-md w-full"
						src="https://i.ibb.co/r29Q3z9c/fellowship-1.png"
						alt=""
					/>
				</div>
			</div>

			<div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
				<p className="text-p">
					Over the years, we have seen a clear deepening of the talent pool in
					the Indian design ecosystem. We have also seen the ecosystem become
					more multifaceted, interdisciplinary, and purpose-driven. And over the
					years, the program, too, has changed and matured from a design
					showcase highlighting promising work in the interiors space, to a
					program wanting to reflect the diverse impact and forms that design
					takes. <br />
					<br />
					In its current form as a one-year, non-residential, grants-based
					program, the Fellowship aims to catalyze future leaders in the Indian
					design ecosystem to make innovative impact across multiple domains of
					design. To this end, the program has grown to include opportunities
					for Fellows to come together and learn from each other. Over time, the
					program will continue to evolve to respond and offer a pioneering
					space to the ever changing Indian design ecosystem.
				</p>
			</div>

			<div className="mt-4 md:mt-0">
				<img
					className="rounded-md w-full"
					src="https://i.ibb.co/35PHwz8D/fellowship-3.png"
					alt="Fellowship 2018 Naik & shah"
				/>
			</div>

			<hr className="border-black mt-6 md:mt-0" />
		</section>
	);
}

function HowWeSupport({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div>
				<h1 className="mt-8 text-h1 font-bold uppercase">
					<span className="text-maroon-red">How We Support</span>
				</h1>
			</div>
			<div className="md:flex mt-8 md:mt-4">
				<div className="md:w-2c-3g lg:w-3c-3g ">
					<h4 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
						funding
					</h4>
				</div>
				<div className="md:w-4c-3g lg:w-6c-5g">
					<p className="text-p mt-3.5 md:mt-0">
						Project funding ranges up to 10 Lakh INR. <br />
						<br />
						Our funding model is flexible and we evaluate based on projects
						scope, scale, and impact and must be backed up by a detailed budget.
					</p>
				</div>
			</div>
			<hr className="border-black/30 mt-6 md:mt-0" />
			<div className="md:flex mt-6 md:mt-0">
				<div className="md:w-2c-3g lg:w-3c-3g ">
					<h4 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
						SHOWCASING & Mentorship
					</h4>
				</div>
				<div className="md:w-4c-3g lg:w-6c-5g">
					<p className="text-p mt-3.5 md:mt-0">
						Beyond funding your project, we want to highlight our fellows’
						talent and impact with as many audiences as is possible including:
					</p>

					<ul className="text-p list-disc ml-8 md:ml-6 lg:ml-8 mt-6 lg:mt-8">
						<li>Fellowship Launch and Exhibition at Conscious Collective</li>
						<li>
							The Fellows’ Retreat — a long weekend with other Fellows and
							industry
						</li>
						<li>thought-leaders to kickstart the Fellowship.</li>
						<li>
							Project promotion on GDL social media throughout the year and
							beyond.
						</li>
					</ul>

					<p className="text-p mt-6 lg:mt-8">
						In addition to personal mentorship from the Godrej Design Lab team,
						we connect Fellows to our ever expanding network of past Fellows,
						technical experts, and thought leaders.
					</p>
				</div>
			</div>
			<hr className="border-black/30 mt-6 md:mt-0" />
			<div className="md:flex mt-6 md:mt-0">
				<div className="md:w-2c-3g lg:w-3c-3g ">
					<h4 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
						Additional Support
					</h4>
				</div>
				<div className="md:w-4c-3g lg:w-6c-5g">
					<p className="text-p mt-3.5 md:mt-0">
						Support from across the Godrej Enterprises Group universe and
						network including advice & consultation on ergonomics, engineering,
						manufacturing, sustainability/Green Certification.
					</p>
				</div>
			</div>
			<hr className="border-black mt-6 md:mt-0" />
		</section>
	);
}

function TFJ({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div>
				<h1 className="mt-8 text-h1 font-bold uppercase">
					<span className="text-maroon-red">The Fellowship Journey</span>
				</h1>
			</div>
			<div className="md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g ">
				<p className="text-p mt-3.5 md:mt-0">
					For us, the Fellowship Program is, fundamentally, about the people.
					And every year begins with an intensive process to survey
					up-and-coming talent from across the country. In our hunt for possible
					Fellows, we look to a myriad of sources for leads — industry experts,
					course catalogues, social media, shops and galleries — which lead not
					to applications or a competition, but to conversations. Where have
					they come from? What drives them today? Where do they want to go?
					<br />
					<br />
					In the course of the conversations, we try to understand how an
					intervention from the program could add value to their professional
					journey, their creative industry, and the larger discourse around
					design.
				</p>
			</div>

			<div className="mt-4 md:mt-0">
				<img
					className="rounded-md w-full"
					src="https://i.ibb.co/JRz7VTzL/BGP-07759-1.png"
					alt="Fellowship"
				/>
			</div>

			<div className="md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g md:flex md:flex-col md:gap-1g ">
				<p className="text-p mt-3.5 md:mt-0">
					In selecting Fellows, we build cohorts made of diverse projects which
					also speak to and build off of each other. Individually, they should
					have an entrepreneurial spirit, a differentiated voice, and an
					authentic curiosity. Collectively, they and their projects should
					represent the breadth of design practice.
				</p>

				<div className="mt-4 md:mt-0">
					<img
						className="rounded-md w-full"
						src="https://i.ibb.co/TMVN1V69/fellowship-4.png"
						alt="Fellowship"
					/>
				</div>

				<p className="text-p mt-4 md:mt-0">
					An important, evolving aspect of the program has been that of
					mentorship and co-mentorship. This year marked the first Fellows’
					Retreat which gave a unique opportunity for this year’s cohort to
					learn from each other’s experience and perspective. As up-and- coming
					professionals, we have found that Fellows have much to learn and gain
					from each other. While their particular projects and domains differ, a
					shared passion and goal to make change through design helped to knit
					together a strong community of support.
				</p>
			</div>
			<div className="md:flex md:justify-between gap-1g">
				<div className="mt-4 md:mt-0 grow">
					<img
						className="rounded-md w-full"
						src="https://i.ibb.co/d3RkMT1/Image-3910-1.png"
						alt=""
					/>
				</div>
				<div className="mt-4 md:mt-0 grow">
					<img
						className="rounded-md w-full"
						src="https://i.ibb.co/x8LKR2BM/Image-2870-1.png"
						alt=""
					/>
				</div>
			</div>

			<div className="md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g md:gap-1g ">
				<p className="text-p mt-3.5 md:mt-0">
					Over the course of the year, we have seen each Fellow and their larger
					teams grow, as projects progressed and evolved. And the change has not
					been only at the individual level. Across the cohort and within our
					own team, this year has led to a deeper, fuller understanding of the
					design landscape, new materials, cultural practices and, more
					generally, the amazing challenges and opportunities the Indian design
					space has in its future.
				</p>
			</div>
		</section>
	);
}
