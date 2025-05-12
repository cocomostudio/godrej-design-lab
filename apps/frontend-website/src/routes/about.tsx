import type React from "react";

export default function About() {
    return <>
    <div className="container md:grid-layout">
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

        {/* <section className="start-col-1 end-col-last"> */}
        <div className="mt-4 md:mt-8 lg:mt-10 start-col-2 end-col-last lg:start-col-3">
            <h1 className="text-h1 font-bold uppercase">
                <span className="text-red">Why Godrej Design Lab</span>
            </h1>
		</div>

        <div className="start-col-4 end-col-last my-4 md:my-8 lg:my-10">
            <p className="text-h3 font-normal">Godrej has been part of life in India for more than 125 years. Our focus on driving design-led innovation resulted in products like the world’s first springless locks, the India’s first locally manufactured refrigerators and typewriters. Today we continue to drive innovation to build solutions that improve lives in our customer’s homes and towards the development of our country.</p>
        </div>




	</div>
    </>
}