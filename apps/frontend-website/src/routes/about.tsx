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

      <OurTeam className="mt-4 md:mt-8 lg:mt-10 md:flex md:flex-col md:gap-1g" />
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
          <div className="mt-4 md:mt-0 md:gap-1g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
              fellowship program
            </h3>
            <p className="text-p mt-2 md:mt-4 lg:mt-8">
              The Godrej Design Lab Fellowship Program aims to engage with
              India’s vibrant design space by empowering pioneering talent to
              showcase their passion, expertise, and vision.
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <a className="text-p font-mono underline uppercase" href="#">
              Read More
            </a>
          </div>
        </div>
        <div className="my-4 md:my-0 md:mt-0 md:w-2c-1g lg:w-3c-2g">
          <img
            className="rounded"
            src="https://i.ibb.co/wZVvM7XY/BGP01876-1.png"
            alt=""
          />
        </div>
      </div>
      <hr className="border-black" />

      {/* below this is secound section */}

      <div className=" md:flex md:gap-1g">
        <div className="md:w-5c-4g lg:w-6c-5g md:flex md:flex-col md:justify-between">
          <div className="mt-4 md:mt-0 md:gap-1g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
              Conscious Collective
            </h3>
            <p className="text-p mt-2 md:mt-4 lg:mt-8">
              Our flagship event is an initiative to create awareness and drive
              solutions towards better living. With a focus on Conscious Spaces
              and Sustainable Materials we aim to build a community of
              like-minded professionals who will reimagine a more sustainable
              future and act as ambassadors to explore possibilities for better
              living for people and planet.
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <a className="text-p font-mono underline uppercase" href="#">
              Read More
            </a>
          </div>
        </div>
        <div className="my-4 md:my-0 md:w-2c-1g lg:w-3c-2g">
          <img
            className="rounded"
            src="https://i.ibb.co/gLwSnXVJ/CCC-Cover-1.png"
            alt=""
          />
        </div>
      </div>

      <hr className="border-black" />

      {/* below this is secound section */}

      <div className=" md:flex md:gap-1g">
        <div className="md:w-5c-4g lg:w-6c-5g md:flex md:flex-col md:justify-between">
          <div className="mt-4 md:mt-0 md:gap-1g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold uppercase text-red">
              Campus Connect
            </h3>
            <p className="text-p mt-2 md:mt-4 lg:mt-8">
              At Conscious Collective, an initiative by Godrej Design Lab, we
              seek to bring together professionals from the industry to
              celebrate this conscious future. Our objective is to bring
              together like- minded professionals who will re-imagine a more
              sustainable future and act as ambassadors to explore possibilities
              of a world that is much healthier and greener for us and for our
              future generations.
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <a className="text-p font-mono underline uppercase" href="#">
              Read More
            </a>
          </div>
        </div>
        <div className="my-4 md:my-0 md:mt-0 md:w-2c-1g lg:w-3c-2g">
          <img
            className="rounded"
            src="https://i.ibb.co/bMb84mPs/9165f49b04a9564d82d41783f60e8d293e31f339.png"
            alt=""
          />
        </div>
      </div>
      <hr className="border-black" />
    </section>
  );
}

function OurTeam({ className }: React.ComponentProps<"section">) {
  return (
    <section className={className}>
      <div className="md:w-6c-5g lg-9c-8c">
        <h2 className="text-h1 font-bold uppercase">
          <span className="text-blue-gray">Our Team</span>
        </h2>
      </div>
      <div className="flex flex-col gap-1g">
        <div className="md:flex">
          <div className="my-4 md:my-0 md:my-0 md:w-2c-2g md:mr-4 lg:mr-8 ">
            <img
              className="rounded"
              src="https://i.ibb.co/99t7FMpR/image-15.png"
              alt=""
            />
          </div>
          <div className="md:w-6c-5g lg:w-7c-6g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold ">
              Nyrika Holkar
            </h3>
            <p className="mt-1 md:mt-2 lg:mt-4 sm:text-sm md:text-p uppercase font-mono">
              EXECUTIVE DIRECTOR, GODREJ ENTERPRISES GROUP
            </p>
            <p className="text-p mt-1 md:mt-2 lg:mt-4">
              Nyrika Holkar is an Indian businessperson, philanthropist, and a
              fourth-generation member of the Godrej family. As brand custodian
              she is instrumental in shaping the impact of the Godrej
              Enterprises Group towards our purpose to ‘Pioneer progress for
              generations’.
            </p>
          </div>
        </div>
        {/* this is the second section */}
        <div className="md:flex">
          <div className="my-4 md:my-0 md:my-0 md:w-2c-2g md:mr-4 lg:mr-8 ">
            <img
              className="rounded"
              src="https://i.ibb.co/99t7FMpR/image-15.png"
              alt=""
            />
          </div>
          <div className="md:w-6c-5g lg:w-7c-6g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold ">
              Summet Bhojani
            </h3>
            <p className="mt-1 md:mt-2 lg:mt-4 sm:text-sm md:text-p uppercase font-mono">
              HEAD OF BRAND & STRATEGIC INSIGHTS GROUP, GODREJ ENTERPRISES GROUP
            </p>
            <p className="text-p mt-1 md:mt-2 lg:mt-4">
              Sumeet Bhojani leads Brand & Strategic Insights Group which works
              across the Godrej Enterprises Group to drive excellence in
              marketing, communication, consumer insights, and to drive our
              purpose to pioneer progress for generations.
            </p>
          </div>
        </div>

        {/* this is the third section */}

        <div className="md:flex">
          <div className="my-4 md:my-0 md:my-0 md:w-2c-2g md:mr-4 lg:mr-8 ">
            <img
              className="rounded"
              src="https://i.ibb.co/TNDc3b3/BGP01866-1.png"
              alt=""
            />
          </div>
          <div className="md:w-6c-5g lg:w-7c-6g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold ">
              Henry Skupniewicz
            </h3>
            <p className="mt-1 md:mt-2 lg:mt-4 sm:text-sm md:text-p uppercase font-mono">
              HEAD OF GODREJ DESIGN LAB, GODREJ ENTERPRISES GROUP
            </p>
            <p className="text-p mt-1 md:mt-2 lg:mt-4">
              Henry Skupniewicz has extensive experience working within the
              design community across India including teaching at and founding
              the FabLab at CEPT University in Ahmedabad. Henry studied
              Computational Design at the Massachusetts Institute of Technology.
            </p>
          </div>
        </div>
        {/* this is the fourth section */}
        <div className="md:flex">
          <div className="my-4 md:my-0 md:my-0 md:w-2c-2g md:mr-4 lg:mr-8 ">
            <img
              className="rounded"
              src="https://i.ibb.co/21n9YS7t/Ashita-Misquitta-1.png"
              alt=""
            />
          </div>
          <div className="md:w-6c-5g lg:w-7c-6g">
            <h3 className="text-h4 md:text-h2 lg:text-h4 font-bold ">
              Ashita Misquitta
            </h3>
            <p className="mt-1 md:mt-2 lg:mt-4 sm:text-sm md:text-p uppercase font-mono">
              COMMUNICATIONS AT GODREJ DESIGN LAB, GODREJ ENTERPRISES GROUP
            </p>
            <p className="text-p mt-1 md:mt-2 lg:mt-4">
              Ashita Misquitta is a brand strategist and communications
              specialist. She is passionate about story-telling and bringing
              alive narratives that excite and inspire.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

