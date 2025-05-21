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
    </main>
  );
}

function HeroSection({ className }: React.ComponentProps<"section">) {
  return (
    <section className={className}>
      <div className="mt-4 md:w-7c-6g lg:w-10c-9g md:flex md:flex-col space-y-8 lg:space-y-10 ">
        <div className="bg-[url(https://i.ibb.co/F459gzYq/Rectangle-16.png)] md:h-[400px] bg-no-repeat bg-cover rounded-md ">
          <div className="md:p-6 lg:p-8 md:w-4c-3g lg:w-6c-5g flex flex-col justify-between h-[400px]">
            <div>
              <h1 className="text-h2 font-medium uppercase text-white">
                INDIAN <br />
                INTERVENTIONS IN <br /> THE VENICE BIENNALE
              </h1>
            </div>
            <div className=" md:w-3c-2g lg:w-4c-3g ">
              <p className="text-p text-white">
                The subcontinent's proposed role in the future of sustainable
                practices was front and centre at the international biennale.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-0 md:ml-3c-3g lg:ml-4c-4g md:w-4c-3g lg:w-6c-5g">
          <div className="bg-[url(https://i.ibb.co/pjznmfJh/Vector.png)] w-full bg-no-repeat bg-contain -mt-20 md:-mt-48">
            <h3 className="text-h3 text-white md:py-4 md:px-6 lg:py-6 lg:px-8">
              <span className="font-bold">Godrej Desing Lab is platfrom</span><br />
              <span> encourages and advances <br />
              design excellence and exploration.</span>
            </h3>
            <div className="flex justify-end md:py-6 md:px-6 lg:py-10 lg:px-8">
              <button className="text-blue-500 bg-white md:px-4 md:py-3">Learn More</button>
            </div>
          </div>
        </div>
       
        {/* <div className=" mt-0 md:ml-3c-3g lg:ml-4c-4g md:w-4c-3g lg:w-6c-5g md:-mt-40">
          <div className="bg-[url(https://i.ibb.co/p6Bj4sfZ/Vector.png)] md:bg-[url(https://i.ibb.co/pjznmfJh/Vector.png)] bg-no-repeat md:h-[300px] w-full md:bg-right md:bg-contain text-white">
            <h3 className="text-h3 md:py-6 md:px-8">
              <span>Godrej Design Lab is a platform</span>
              <br />
              <span className="font-light">
                encourages and advances <br />
                design excellence and exploration.
              </span>
            </h3>
            <div>
              <button>Learn More</button>
            </div>
          </div>
        </div> */}
      </div>
      <hr className="border-black mt-8 md:mt-8" />
      <div className="bg-green-300 h-[500px]">
        <h3>This is test div </h3>
      </div>
    </section>
  );
}
