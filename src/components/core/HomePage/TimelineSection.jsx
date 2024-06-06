import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";

const TimeLine = [
    {
        Logo: Logo1,
        Heading: "Leadership",
        Description: "Fully committed to the success company",
    },
    {
        Logo: Logo2,
        Heading: "Responsibility",
        Description: "Students will always be our top priority",
    },
    {
        Logo: Logo3,
        Heading: "Flexibility",
        Description: "The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        Heading: "Solve the problem",
        Description: "Code your way to a solution",
    },
];


const TimelineSection = () => {
    return (
        <div>
            <div className='flex flex-col lg:flex-row gap-20 mb-20 items-center'>
                <div className='flex flex-col gap-14 lg:gap-3 lg:w-[45%]'>
                    {TimeLine.map((ele, i) => {
                        return (
                            <div className="flex flex-col lg:gap-3" key={i}>
                                <div className="flex gap-6" key={i}>

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default TimelineSection