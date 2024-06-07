import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";


import Logo from "../../assets/Logo/Logo-Full-Light.png";


import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
    "Articles",
    "Blog",
    "Chart Sheet",
    "Code challenges",
    "Docs",
    "Projects",
    "Videos",
    "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
    return (
        <div className="bg-richblack-800">
            <div className="flex lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
                <div className="border-b w-full flex flex-col lg:flex-row pb-5 border-richblack-700">
                    {/* Section 1 */}
                    <div className="lg:w-1/2 flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
                        <div className="w-[30%] flex flex-col gap-3 mb-7 lg:pl-0">
                            <img src={Logo} alt="" className="object-contain" />
                            <p className="text-richblack-50 font-semibold text-[16px]">
                                Company
                            </p>
                            <div className="flex flex-col gap-2">
                                {["About", "Careers", "Affiliates"].map((element, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                            <Link to={element.toLowerCase()}>{element}</Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-3 text-lg">
                                <FaFacebook className="hover:text-richblack-50" />
                                <FaGoogle className="hover:text-richblack-50" />
                                <FaTwitter className="hover:text-richblack-50" />
                                <FaYoutube className="hover:text-richblack-50" />
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <p className="text-richblack-50 font-semibold text-[16px]">
                                Resources
                            </p>

                            <div className="flex flex-col gap-2 mt-2">
                                {Resources.map((element, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                            <Link to={element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Support
                            </h1>
                            <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                <Link to={"/help-center"}>Help Center</Link>
                            </div>
                        </div>

                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <p className="text-richblack-50 font-semibold text-[16px]">
                                Plans
                            </p>

                            <div className="flex flex-col gap-2 mt-2">
                                {Plans.map((element, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                            <Link to={element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Community
                            </p>

                            <div className="flex flex-col gap-2 mt-2">
                                {Community.map((element, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                            <Link to={element.split(" ").join("-").toLowerCase()}>
                                                {element}
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="lg:w-1/2 flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
                        {FooterLink2.map((element, i) => {
                            return (
                                <div key={i} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                                    <p className="text-richblack-50 font-semibold text-[16px]">
                                        {element.title}
                                    </p>
                                    <div className="flex flex-col gap-2 mt-2">
                                        {element.links.map((link, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                    <Link to={link.link}>{link.title}</Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-14 text-sm">
                {/* Section 1 */}
                <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
                    <div className="flex flex-row">
                        {BottomFooter.map((element, i) => {
                            return (
                                <div
                                    key={i}
                                    className={` ${BottomFooter.length - 1 === i
                                        ? ""
                                        : "border-r border-richblack-700"} cursor-pointer hover:text-richblack-50 transition-all duration-200
                                         px-3 `}>
                                    <Link to={element.split(" ").join("-").toLocaleLowerCase()}>
                                        {element}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">Made with ❤️ by Ujjwal © 2023 StudyNotion</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;