/*eslint-disable */
import { useEffect, useState } from "react";
import HomeHeader from "@components/HomeHeader";
import { Col, Row, Card, CardText, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { blogGetByIdApiCall, blogListApiCall } from "@redux/action/BlogAction";
import { convertDate } from "@utils/Utils";
import ShimmerViewBlog from "@components/Shimmer/ShimmerViewBlog";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { AnyAction } from "@reduxjs/toolkit";
import NoDataFound from "@components/Common/NoDataFound";

const BlogDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useRouter().query;
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlog, setIsBlog] = useState(false);
  const [blog, setBlog] = useState(null);
  /**
   * It's a function that gets the blog details by id and sets the response to the blog details
   * @param id - The id of the blog you want to fetch.
   */
  const getBlogDetails = async (id: string) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogGetByIdApiCall(id) as unknown as AnyAction);
    setResponse(res?.data?.data?.blog);
    setIsLoading(false);
  };
  /**
   * It fetches the blog list from the API.
   */
  const getBlogs = async () => {
    setIsBlog(true);
    const data = {
      page: 1,
      per_page: 4,
      sort_order: "desc",
      sort_field: "id",
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogListApiCall(data) as unknown as AnyAction);
    setBlog(res?.data?.data?.content);
    setIsBlog(false);
  };
  /* It's a react hook that runs when the component is mounted. */
  useEffect(() => {
    getBlogDetails(id as string);
    getBlogs();
  }, []);
  return (
    <>
      <div>
        <div className="container-fluid ">
          <div className="myaccount-header">
            <HomeHeader />
          </div>
        </div>
        <div className="container blog-detail">
          <Row>
            <Col>
              <p className="sy-tx-black">
                <Link href="/customer/blog" className="sy-tx-black blog">
                  Blog{" "}
                </Link>
                / <span className="sy-tx-primary">Blog details</span>{" "}
              </p>
            </Col>
          </Row>
          {!isLoading ? (
            <>
              <div className="d-flex justify-content-between flex-wrap">
                <div className="font-42px mt-3  mt-sm-5 mb-sm-4 mb-3 f-600 sy-tx-black">
                  {response?.title}
                  <p className="sy-tx-primary mt-sm-2">
                    By {response?.auther_name} on {convertDate(response?.created_at, 1)}
                  </p>
                </div>
              </div>
              <div className="blog-card-detail">
                <Card className="blog-card-border">
                  <img alt="Sample" src={response?.main_image} className="image-hig img-fluid" />
                  <CardBody className="p-0 mt-1">
                    <CardText className="sy-tx-black">
                      <div dangerouslySetInnerHTML={{ __html: response?.content }} />
                    </CardText>
                  </CardBody>
                </Card>
              </div>
            </>
          ) : (
            <ShimmerViewBlog />
          )}
          <div className="font-56px text-center mt-3 text-uppercase mt-sm-5 mb-sm-5 mb-3 sy-tx-black">
            Find Trending <span className="sy-tx-primary"> Blogs</span>
          </div>
          <div className="slider-activation position-relative">
            {!isBlog ? (
              <Swiper
                slidesPerView={3}
                spaceBetween={30}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Navigation]}
                className="mySwiper"
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  991: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  100: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                }}
              >
                {blog &&
                  (blog.length !== 0 ? (
                    blog.map((item, key) => {
                      return (
                        <SwiperSlide key={key}>
                          <Card className="blog-card-border">
                            <img
                              alt="Sample"
                              src={item?.main_image}
                              className="image-height img-fluid"
                            />
                            <CardBody className="p-0 ">
                              <CardSubtitle className="mb-2 sy-tx-primary mt-sm-3 mt-2" tag="h5">
                                By {item?.auther_name} on {convertDate(item?.created_at, 1)}
                              </CardSubtitle>
                              <CardTitle className="f-600 h1 sy-tx-black mb-1">
                                {" "}
                                {item?.title}
                              </CardTitle>

                              <CardText className="sy-tx-ligt-grey">
                                <div
                                  className="html-data-blog"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.content,
                                  }}
                                />
                              </CardText>
                              <p
                                className="sy-tx-primary f-700 cursor-pointer"
                                onClick={() => {
                                  router.replace(`/customer/blog-detail/${item?.id}`),
                                    window.location.reload(false);
                                }}
                              >
                                Read Post
                              </p>
                            </CardBody>
                          </Card>
                        </SwiperSlide>
                      );
                    })
                  ) : (
                    <Col>
                      <div className="my-5">
                        <NoDataFound message={"BLOG"} />
                      </div>
                    </Col>
                  ))}
              </Swiper>
            ) : (
              <ShimmerViewBlog />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

BlogDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default BlogDetail;
