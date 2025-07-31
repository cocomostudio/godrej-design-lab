import type React from "react";

export default function ThisPage() {
	return (
		<div className="container md:grid-layout">
			<div className="start-col-2 end-col-last lg:start-col-3">
				<Content className="mt-4 md:mt-8 lg:mt-10 lg:w-9c-8g" />
			</div>
		</div>
	);
}

function Content({ className }: React.ComponentProps<"main">) {
	return (
		<main className={className}>
			<HeroSection />
			<FellowShip className="md:w-7c-6g lg:w-10c-9g mt-6 md:mt-8 lg:mt-10 " />
			<ConsciousCollective className="md:w-7c-6g lg:w-10c-9g mt-6 md:mt-8 lg:mt-10 " />
			<Reports className="md:w-7c-6g lg:w-10c-9g mt-6 md:mt-8 lg:mt-10" />
			<DesignSeries className="md:w-7c-6g lg:w-10c-9g mt-6 md:mt-8 lg:mt-10" />
		</main>
	);
}

function HeroSection({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="mt-4 md:w-7c-6g lg:w-10c-9g md:flex md:flex-col space-y-8 lg:space-y-10 ">
				<div className="bg-[url(https://i.ibb.co/F459gzYq/Rectangle-16.png)] bg-center md:h-[400px] bg-no-repeat bg-cover rounded-[18px]">
					<div className="bg-gradient-to-t from-transparent to-[#6B682E] rounded-[18px]">
						<div className="px-3 py-5 md:p-6 lg:p-8 md:w-3c-2g lg:w-5c-4g flex flex-col justify-between h-[400px] ">
							<div>
								<h1 className="text-h2 font-medium uppercase text-white">
									INDIAN INTERVENTIONS IN THE VENICE BIENNALE
								</h1>
							</div>
							<div className=" md:w-3c-2g lg:w-4c-3g mb-15 md:mb-0">
								<p className="text-p text-white">
									The subcontinent's proposed role in the future of sustainable
									practices was front and centre at the international biennale.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-0 md:ml-3c-3g lg:ml-4c-4g md:w-4c-3g lg:w-6c-5g">
					<div className="bg-[url(https://i.ibb.co/pjznmfJh/Vector.png)] w-full bg-no-repeat bg-contain -mt-20 md:-mt-48">
						<h3 className="text-h5 md:text-h4 lg:text-h3 first-line:font-bold text-white md:py-4 md:px-6 lg:py-6 lg:px-8">
							Godrej Design Lab is a platform 
							which encourages and advances 
							design excellence and exploration.
						</h3>
						<div className="flex justify-end md:py-6 md:px-6 lg:py-10 lg:px-8">
							<button className="text-blue-500 text-xs lg:text-sm bg-white px-3 py-3 md:px-4 md:py-3 rounded-md">
								Learn More
							</button>
						</div>
					</div>
				</div>
				<hr className="border-black mt-8 md:mt-8" />
			</div>
		</section>
	);
}

function FellowShip({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="flex items-start md:items-center justify-between gap-2">
				<h2 className="text-h1 font-bold uppercase text-midnight-blue flex-1">
					Fellowship
				</h2>
				<button className="shrink-0 px-3.25 py-2.75 md:px-5 md:py-2.5 lg:px-6 lg:py-3.75 rounded-md lg:rounded-lg font-bold bg-dodger-blue text-xs lg:text-sm text-white uppercase">
					See all
				</button>
			</div>

			<div className="flex flex-col md:flex-row flex-grow mt-6 md:mt-8 lg:mt-10 gap-2g md:gap-1g">
				<div className="flex-1">
					<img 
						className="rounded-xl w-full transition-all duration-1000 ease-in-out hover-transition-one"
						src="https://i.ibb.co/LhrsXjDr/image-6.png"
						alt="Home 2"
					/>
					<div className="mt-4 md:mt-5 lg:mt-6">
						<h4 className="text-p font-bold">
							Fellowship 2024
						</h4>
						<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
							The final reveal. Our 2024 fellows have been working on refining
							and building their designs of design impact through the last year.
							Come take a look.
						</p>
					</div>
				</div>
				<div className="flex-1">
					<img
						className="rounded-xl w-full transition-all duration-1000 ease-in-out hover-transition-two"
						src="https://i.ibb.co/9zRXMYs/image-7.png"
						alt="Home 2"
					/>
					<div className="mt-4 md:mt-5 lg:mt-6">
						<h4 className="text-p font-bold">
							Fellowship 2024
						</h4>
						<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
							The final reveal. Our 2024 fellows have been working on refining
							and building their designs of design impact through the last year.
							Come take a look.
						</p>
					</div>
				</div>
			</div>
			<hr className="border-black mt-6 md:mt-8 lg:mt-10" />
		</section>
	);
}

function ConsciousCollective({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="flex items-start md:items-center justify-between gap-2">
				<h2 className="text-h1 font-bold uppercase text-midnight-blue flex-1">
					Conscious collective
				</h2>
				<button className="shrink-0 px-3.25 py-2.75 md:px-5 md:py-2.5 lg:px-6 lg:py-3.75 rounded-md lg:rounded-lg font-bold bg-dodger-blue text-xs lg:text-sm text-white uppercase">
					See all
				</button>
			</div>
			<div className="mt-6 md:mt-8 lg:mt-10">
				<img
					className="rounded-3xl w-full"
					src="https://i.ibb.co/LhrsXjDr/image-6.png"
					alt="Home 2"
				/>
			</div>
			<div className="md:ml-3c-4g lg:ml-5c-5g md:w-4c-3g lg:w-5c-4g mt-4 md:mt-5 lg:mt-6">
				<h4 className="text-p font-bold">Fellowship 2024</h4>
				<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
					The final reveal. Our 2024 fellows have been working on refining and
					building their designs of design impact through the last year. Come
					take a look.
				</p>
			</div>
			<hr className="border-black mt-6 md:mt-8 lg:mt-10" />
		</section>
	);
}

function Reports({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="flex items-start md:items-center justify-between gap-2">
				<h2 className="text-h1 font-bold uppercase text-midnight-blue flex-1">
					Reports
				</h2>
				<button className="shrink-0 px-3.25 py-2.75 md:px-5 md:py-2.5 lg:px-6 lg:py-3.75 rounded-md lg:rounded-lg font-bold bg-dodger-blue text-xs lg:text-sm  text-white uppercase">
					See all
				</button>
			</div>

			<div className="flex flex-col md:flex-row flex-grow mt-6 md:mt-8 lg:mt-10 gap-2g md:gap-1g">
				<div className="flex-1">
					<img
						className="rounded-xl w-full transition-all duration-1000 ease-in-out hover-transition-three"
						src="https://i.ibb.co/LhrsXjDr/image-6.png"
						alt="Home 2"
					/>
					<div className="mt-4 md:mt-5 lg:mt-6">
						<h4 className="text-p font-bold">
							Fellowship 2024
						</h4>
						<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
							The final reveal. Our 2024 fellows have been working on refining
							and building their designs of design impact through the last year.
							Come take a look.
						</p>
					</div>
				</div>

				<div className="flex-1">
					<img
						className="rounded-xl w-full transition-all duration-1000 ease-in-out hover-transition-four"
						src="https://i.ibb.co/9zRXMYs/image-7.png"
						alt="Home 2"
					/>
					<div className="mt-4 md:mt-5 lg:mt-6">
						<h4 className="text-p font-bold">
							Fellowship 2024
						</h4>
						<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
							The final reveal. Our 2024 fellows have been working on refining
							and building their designs of design impact through the last year.
							Come take a look.
						</p>
					</div>
				</div>
			</div>
			<hr className="border-black mt-6 md:mt-8 lg:mt-10" />
		</section>
	);
}

function DesignSeries({ className }: React.ComponentProps<"section">) {
	return (
		<section className={className}>
			<div className="flex items-start md:items-center justify-between gap-2">
				<h2 className="text-h1 font-bold uppercase flex-1">
					design series
				</h2>
				<button className="shrink-0 px-3.25 py-2.75 md:px-5 md:py-2.5 lg:px-6 lg:py-3.75 rounded-md lg:rounded-lg font-bold bg-dodger-blue text-xs lg:text-sm  text-white uppercase">
					See all
				</button>
			</div>
			<div className="mt-6 md:mt-8 lg:mt-10">
				<img
					className="rounded-3xl w-full"
					src="https://i.ibb.co/LhrsXjDr/image-6.png"
					alt="Home 2"
				/>
			</div>
			<div className="md:ml-3c-4g lg:ml-5c-5g md:w-4c-3g lg:w-5c-4g mt-4 md:mt-5 lg:mt-6">
				<h4 className="text-p font-bold">Fellowship 2024</h4>
				<p className="text-p mt-3.5 md:mt-3 lg:mt-4">
					The final reveal. Our 2024 fellows have been working on refining and
					building their designs of design impact through the last year. Come
					take a look.
				</p>
			</div>
		</section>
	);
}
