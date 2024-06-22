import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // Import autoplay CSS
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
    const [reviews, setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
        (async () => {
            const { data } = await apiConnector(
                "GET",
                ratingsEndpoints.REVIEWS_DETAILS_API
            );
            if (data?.success) {
                setReviews(data?.data);
            }
        })();
    }, []);

    return (
        <div className="text-white">
            <div className="my-[50px] max-w-maxContentTab lg:max-w-maxContent">
                <Swiper
                    slidesPerView={3}
                    spaceBetween={25}
                    loop={true}
                    freeMode={true}
                    autoplay={{
                        delay: 1000,
                        disableOnInteraction: false,
                    }}
                    modules={[FreeMode, Pagination, Autoplay]}
                    className="w-full lg:h-[200px] sm:h-[350px]">
                    {reviews.map((review, i) => (
                        <SwiperSlide key={i} className="flex justify-center items-center">
                            <div className="flex flex-col gap-3 bg-richblack-800 p-4 text-[14px] text-richblack-25 rounded-lg h-full w-full">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            review?.user?.image
                                                ? review?.user?.image
                                                : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName[0]}${review?.user?.lastName[0]}`
                                        }
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                                        <h2 className="text-[12px] font-medium text-richblack-500">
                                            {review?.course?.courseName}
                                        </h2>
                                    </div>
                                </div>
                                <p className="font-medium text-richblack-25">
                                    {review?.review.split(" ").length > truncateWords
                                        ? `${review?.review
                                            .split(" ")
                                            .slice(0, truncateWords)
                                            .join(" ")} ...`
                                        : `${review?.review}`}
                                </p>
                                <div className="flex items-center gap-2 ">
                                    <h3 className="font-semibold text-yellow-100">
                                        {review.rating.toFixed(1)}
                                    </h3>
                                    <ReactStars
                                        count={5}
                                        value={review.rating}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default ReviewSlider;
