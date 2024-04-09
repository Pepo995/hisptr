/*eslint-disable */
import { useEffect, useState } from "react";
import HomeHeader from "@components/HomeHeader";
import BlogImage from "@images/blog2.png";
import {
  Col,
  Input,
  Row,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Search } from "react-feather";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { blogListApiCall } from "@redux/action/BlogAction";
import { convertDate, onSearchHandler } from "@utils/Utils";
import NoDataFound from "@components/Common/NoDataFound";
import ShimmerBlogCard from "@components/Shimmer/ShimmerBlogCard";
import InfiniteScroll from "react-infinite-scroll-component";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const Blog: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const perPage = 6;
  /**
   * It makes an API call to the backend to get the list of blogs
   */
  const getBlogs = async () => {
    setIsLoading(true);
    const data = {
      page: page,
      per_page: perPage,
      sort_order: "desc",
      sort_field: "id",
      search: search,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogListApiCall(data) as unknown as AnyAction);
    setBlog(res?.data?.data?.content);
    setTotal(res?.data?.data?.count);
    setIsLoading(false);
  };
  /* A react hook that is used to perform side effects in function components. */
  useEffect(() => {
    getBlogs();
  }, [search]);
  /**
   * It checks if the total number of blogs is greater than the current page number multiplied by the
   * number of blogs per page. If it is, it makes an API call to get the next page of blogs and adds them
   * to the current list of blogs
   */
  const scrollToEnd = async () => {
    if (total !== 0 && total > page * perPage) {
      const data = {
        page: page + 1,
        per_page: perPage,
      };

      // eslint-disable-next-line @typescript-eslint/await-thenable
      const response = await dispatch(blogListApiCall(data) as unknown as AnyAction);
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...blog, ...response?.data?.data?.content];
        setBlog(arr);
      } else {
      }
    } else {
      setHasMore(false);
    }
  };
  const blogList =
    blog &&
    (blog.length !== 0 ? (
      blog.map((item, key) => {
        return (
          <Col lg={4} md={6} key={key}>
            <Card className="blog-card-border">
              <img alt="Sample" src={item?.main_image} className="image-height img-fluid" />
              <CardBody className="p-0 ">
                <CardSubtitle className="mb-2 sy-tx-primary mt-sm-3 mt-2" tag="h5">
                  By {item?.auther_name} on {convertDate(item?.created_at, 1)}
                </CardSubtitle>
                <CardTitle className="f-600 h1 sy-tx-black mb-1"> {item?.title}</CardTitle>

                <CardText className="sy-tx-ligt-grey h-25">
                  <div
                    className="html-data-blog"
                    dangerouslySetInnerHTML={{ __html: item?.content }}
                  />
                </CardText>
                <Link href={`/customer/blog-detail/${item?.id}`}>
                  {" "}
                  <p className="sy-tx-primary f-700">Read Post</p>
                </Link>
              </CardBody>
            </Card>
          </Col>
        );
      })
    ) : (
      <Col>
        <div className="my-5">
          <NoDataFound message={"BLOG"} />
        </div>
      </Col>
    ));
  return (
    <>
      <div>
        <HomeHeader />
        <div className="blog-header">
          <img src={BlogImage} className="img-fluid w-100" />
          <div className="blog-content">
            <p className="font-56px sy-tx-white text-uppercase f-900">Blogs</p>
          </div>
        </div>
        <div className="container">
          <div className=" find-blog mt-sm-5">
            <div className="font-56px text-center mt-3 text-uppercase mt-sm-5 mb-md-5 mb-3 sy-tx-black ">
              Find Trending <span className="sy-tx-primary"> Blogs</span>
            </div>

            <InputGroup className="mt-sm-5 mb-sm-5 mb-3  serach-input">
              <Input
                placeholder="Search"
                onChange={(e) => onSearchHandler(e, setSearch)}
                className="mb-0 mt-0 common-input input-ff"
              />
              <InputGroupText className="common-input">
                <Search />
              </InputGroupText>
            </InputGroup>
          </div>

          <div className="blogs-card">
            <InfiniteScroll
              className="infinity-scroll"
              scrollableTarget={"blog-card"}
              dataLength={blog && blog.length}
              hasMore={hasMore}
              loader={
                blog && total && blog.length !== 0 && total !== blog.length ? (
                  <div div className="mt-sm-5 d-flex justify-content-center">
                    <Button className="custom-btn10" onClick={scrollToEnd}>
                      Load More
                    </Button>
                  </div>
                ) : null
              }
            >
              <Row>{!isLoading ? blogList : <ShimmerBlogCard />}</Row>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
};

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Blog;
