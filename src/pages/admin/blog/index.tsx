import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

import { useDispatch } from "react-redux";
import { convertDate } from "@utils/Utils";
import { checkPermisson } from "@utils/platformUtils";
import { blogListApiCall } from "@redux/action/BlogAction";
import NoDataFound from "@components/Common/NoDataFound";
import { BLOG } from "@constants/CommonConstants";
import InfiniteScroll from "react-infinite-scroll-component";

import ShimmerBlogCard from "@components/Shimmer/ShimmerBlogCard";

import { Helmet } from "react-helmet";
import Link from "next/link";
const Blog: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const blogAccess = checkPermisson("blog");
  const perPage = 9;

  /**
   * It makes an API call to the backend to get the list of blogs
   */
  const getBlogs = async () => {
    setIsLoading(true);
    const data = {
      /*eslint-disable-next-line */
      page: page,
      per_page: perPage,
      sort_order: "desc",
      sort_field: "id",
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogListApiCall(data) as unknown as AnyAction);
    setBlog(res?.data?.data?.content);
    setTotal(res?.data?.data?.count);
    setIsLoading(false);
  };
  /* A react hook which is used to run a function when the component is mounted. */
  useEffect(() => {
    getBlogs();
  }, []);

  /**
   * It checks if the total number of blogs is greater than the current page number multiplied by the
   * number of blogs per page. If it is, it makes an API call to get the next page of blogs. If the API
   * call is successful, it adds the new blogs to the existing list of blogs. If the API call is
   * unsuccessful, it does nothing
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

  /* A ternary operator. It checks if the blog array is empty or not. If it is not empty, it maps through
  the array and returns the blog cards. If it is empty, it returns a message saying that there are no
  blogs. */
  const blogList =
    blog &&
    (blog?.length !== 0 ? (
      blog.map((item, key) => {
        return (
          <Col lg={4} key={key}>
            <Card className="bg-white">
              <CardImg top className="image-height" src={item?.main_image} alt="card1" />
              <CardBody>
                <CardTitle tag="h4">{item?.title}</CardTitle>
                <CardSubtitle className="sy-tx-primary mb-sm-1">
                  By <span className="sy-tx-primary f-600">{item?.auther_name}</span>{" "}
                  <span className="border-right-red mx-1"></span> {convertDate(item?.created_at, 2)}
                </CardSubtitle>
                <CardText>
                  <div
                    className="html-data-blog"
                    dangerouslySetInnerHTML={{ __html: item?.content }}
                  />
                </CardText>
                <hr />
                <Link
                  href={{
                    pathname: `/admin/blog/view-blog/${item?.id}`,
                  }}
                >
                  <p className="sy-tx-primary f-600">Read More</p>
                </Link>
              </CardBody>
            </Card>
          </Col>
        );
      })
    ) : (
      <Col>
        <NoDataFound message={BLOG} />
      </Col>
    ));

  return (
    <>
      <Helmet>
        <title>Hipstr - Blogs</title>
      </Helmet>
      <div>
        <Row className="mb-sm-2">
          <Col lg={4}>
            <Breadcrumbs title="Blogs" data={[{ title: "Blog List" }]} />
          </Col>
          <Col lg={8} className="text-end">
            {blogAccess?.add_access === 1 && (
              <Link href="/admin/blog/add-blog">
                <Button className="custom-btn3">Add New Blog</Button>
              </Link>
            )}
          </Col>
        </Row>
        <div className="blog-card">
          <InfiniteScroll
            className="infinity-scroll"
            scrollableTarget={"blog-card"}
            dataLength={blog && blog?.length}
            hasMore={hasMore}
            loader={
              blog && total && blog.length !== 0 && total !== blog?.length ? (
                <div div className="mt-sm-5 d-flex justify-content-center">
                  <Button className="custom-btn2" onClick={scrollToEnd}>
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
    </>
  );
};
Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Blog;
