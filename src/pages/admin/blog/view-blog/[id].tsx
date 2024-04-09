import { useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import { Button, Card, CardBody, CardSubtitle, CardTitle, Col, Row } from "reactstrap";
import { Edit } from "react-feather";

import DeleteModal from "@components/Modal/DeleteModal";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { blogGetByIdApiCall } from "@redux/action/BlogAction";
import { BLOG } from "@constants/CommonConstants";

import { convertDate } from "@utils/Utils";
import ShimmerViewBlog from "@components/Shimmer/ShimmerViewBlog";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import Link from "next/link";

import { checkPermisson } from "@utils/platformUtils";

const ViewBlog: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const blogAccess = checkPermisson("blog");
  /**
   * It's a function that gets the blog details by id and sets the response to the blog details
   * @param id - The id of the blog you want to fetch.
   */
  const getBlogDetails = async (id) => {
    setIsLoading(true);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(blogGetByIdApiCall(id) as unknown as AnyAction);
    setResponse(res?.data?.data?.blog);
    setIsLoading(false);
  };
  /* This is a react hook. It is used to run a function when the component is mounted. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/blog");
    } else if (router.query.id !== undefined) {
      getBlogDetails(router.query.id);
    }
  }, []);
  return (
    <div>
      <Helmet>
        <title>Hipstr - Blog Details</title>
      </Helmet>
      {!isLoading ? (
        <div>
          <Row className="mb-sm-2">
            <Col lg={5}>
              <Breadcrumbs
                title="Blogs"
                data={[{ title: "Blog List", link: "/admin/blog" }, { title: "Blog Details" }]}
              />
            </Col>
            <Col lg={7} className="text-end">
              {blogAccess?.edit_access === 1 && (
                <Link
                  href={{
                    pathname: `/admin/blog/edit-blog/${router.query.id}`,
                  }}
                >
                  <Button className="custom-btn11 ">
                    <Edit />
                  </Button>
                </Link>
              )}
              {blogAccess?.delete_access === 1 && (
                <Button className="mx-1 custom-btn12">
                  <DeleteModal
                    description={response?.title}
                    id={router.query.id}
                    code={BLOG}
                    refresh={() => router.replace("/blog")}
                  />
                </Button>
              )}
            </Col>
          </Row>
          <div className="blog-card">
            <Card className="bg-white">
              <img
                top
                src={response?.main_image}
                alt="card1"
                className="image-height-d img-fluid"
              />
              <CardBody>
                <CardTitle tag="h4">{response?.title}</CardTitle>
                <CardSubtitle className="sy-tx-primary mb-sm-1">
                  By <span className="sy-tx-primary f-600">{response?.auther_name}</span>{" "}
                  <span className="border-right mx-1"></span> {convertDate(response?.created_at, 2)}
                </CardSubtitle>
                <Card className="bg-white">
                  <div
                    className="w-100 view-blog"
                    dangerouslySetInnerHTML={{ __html: response?.content }}
                  />
                </Card>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        <ShimmerViewBlog />
      )}
    </div>
  );
};

ViewBlog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ViewBlog;
