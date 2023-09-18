import Slider from "react-slick";
import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { callApi } from "../../utils/api";
import { useState } from "react";
import { DrinkFestival } from "./../../Type/types";

function SlideComponent() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };
  const [bannerList, setBannerList] = useState<DrinkFestival[]>([]);
  useEffect(() => {
    callApi("get", "api/drinkFestival/all").then(res => {
      setBannerList(res.data);
    });
  }, []);

  return (
    <>
      <Slider {...settings} style={{ height: "auto", width: "100%" }}>
        {bannerList.map(banner => {
          return (
            <div>
              <a href={banner.redirectUri}>
                <img src={banner.image} alt="" style={{ maxWidth: "100%" }} />
              </a>
            </div>
          );
        })}
      </Slider>
    </>
  );
}
export default SlideComponent;
