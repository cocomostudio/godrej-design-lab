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
        <span className="text-blue-gray">About</span>
        <br />
        <span className="text-red">Godrej Design Lab</span>
      </h1>
    </>
  );
}

function Content({ className }: React.ComponentProps<"main">) {
  return (
    <main className={className}>
      <IntroSection className="md:flex md:flex-col md:gap-1g" />

      <WhyGDL className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" />

      <WhatWeDO className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" />

      {/* <Belive className="flex"/> */}

      {/* <TestimonialSection className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10" />

		<FellowsWordsSection className="mt-6 md:mt-8 lg:mt-10 | space-y-6 md:space-y-8 lg:space-y-10" />

		<CreditsSection /> */}
    </main>
  );
}

function IntroSection({ className }: React.ComponentProps<"section">) {
  return (
    <section className={className}>
      <div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
        <p className="text-p">
          Godrej Design Lab is an initiative of Godrej Enterprise Group to
          encourage and advance design excellence and exploration. It is our way
          to reach out and collaborate on multiple fronts with the ever growing
          Indian design ecosystem. Since 2015, we have worked with talented
          individuals, firms, and organizations to explore how design can
          innovate and impact, making pioneering strides in the areas of product
          and architectural design, material development and social impact.
        </p>
      </div>
      <hr className="border-black" />
    </section>
  );
}

function WhyGDL({ className }: React.ComponentProps<"section">) {
  return (
    <section className={className}>
      <div className="md:w-6c-5g lg-9c-8c">
        <h2 className="text-h1 font-bold uppercase">
          <span className="text-red">Why Godrej Design Lab</span>
        </h2>
      </div>

      <div className="mt-4 md:ml-2c-2g lg:ml-3c-3g md:mt-0 md:w-5c-4g lg:w-6c-5g | space-y-8 lg:space-y-10">
        <p className="text-p">
          Godrej has been part of life in India for more than 125 years. Our
          focus on driving design-led innovation resulted in products like the
          world’s first springless locks, the India’s first locally manufactured
          refrigerators and typewriters. Today we continue to drive innovation
          to build solutions that improve lives in our customer’s homes and
          towards the development of our country.
        </p>
      </div>

      <div className="md:ml-1c-1g md:w-6c-5g lg:w-8c-7g flex items-center md:font-[735] md:leading-[110] h-[420px] md:h-[560px] lg:h-[660px]">
        <h2 className="text-h1 font-bold">
          <span className="text-red">
            We believe in the power of design to make impactful change by
            creating meaning through creative problem solving, connection and
            delight.
          </span>
        </h2>
      </div>
      <hr className="border-black" />
    </section>
  );
}

function WhatWeDO({ className }: React.ComponentProps<"section">) {
  return (
    <section className={className}>
      <div className="md:w-6c-5g lg-9c-8c">
        <h2 className="text-h1 font-bold uppercase">
          <span className="text-blue-gray">What we do</span>
        </h2>
      </div>
      <div className=" md:flex md:gap-1g">
        <div className="md:w-5c-4g lg:w-6c-5g md:flex md:flex-col md:justify-between">
          <div className="md:gap-1g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
              fellowship program
            </h3>
            <p className="text-p mt-4 md:8 lg:10">
              The Godrej Design Lab Fellowship Program aims to engage with
              India’s vibrant design space by empowering pioneering talent to
              showcase their passion, expertise, and vision.
            </p>
          </div>
          <div>
            <a className="text-p text-mono underline" href="#">Read More</a>
          </div>
        </div>
        <div className="md:w-2c-1g lg:w-3c-2g">
          <img className="rounded" src="https://i.ibb.co/wZVvM7XY/BGP01876-1.png" alt="" />
        </div>
      </div>
    </section>
  );
}
/* <div className="container md:grid-layout">
        <div className="start-col-1 end-col-1 hidden md:block">
            <h2>This is for sidebar</h2>
        </div>

	    <div className="start-col-2 end-col-last lg:start-col-3">
            <h1 className="text-h1 font-bold uppercase">
                <span className="text-blue-gray">About</span>
                <br />
                <span className="text-red">Godrej Design Lab</span>
            </h1>
		</div>

        <div className="start-col-4 end-col-last my-4 md:my-8 lg:my-10">
            <p className="text-h3 font-normal">Godrej Design Lab is an initiative of Godrej Enterprise Group to encourage and advance design excellence and exploration. It is our way to reach out and collaborate on multiple fronts with the ever growing Indian design ecosystem. Since 2015, we have worked with talented individuals, firms, and organizations to explore how design can innovate and impact, making pioneering strides in the areas of product and architectural design, material development and social impact.</p>
        </div>

        <hr className="border-black start-col-2 end-col-last" />

        <div className="mt-4 md:mt-8 lg:mt-10 start-col-2 end-col-last lg:start-col-3">
            <h1 className="text-h1 font-bold uppercase">
                <span className="text-red">Why Godrej Design Lab</span>
            </h1>
		</div>

        <div className="start-col-4 end-col-last my-4 md:my-8 lg:my-10">
            <p className="text-h3 font-normal">Godrej has been part of life in India for more than 125 years. Our focus on driving design-led innovation resulted in products like the world’s first springless locks, the India’s first locally manufactured refrigerators and typewriters. Today we continue to drive innovation to build solutions that improve lives in our customer’s homes and towards the development of our country.</p>
        </div>
	</div> */
