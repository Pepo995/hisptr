/*eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

import InfiniteScroll from "react-infinite-scroll-component";
import HomeHeader from "@components/HomeHeader";
import ResourcesImg from "@images/resources.png";
import PdfImg from "@images/pdf-file.svg";
import { useDispatch } from "react-redux";
import { resourceListingApiCall } from "@redux/action/ResourceAction";
import ShimmerCard from "@components/Shimmer/ShimmerCard";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { FilterAndPagination, Content, ResourceListAction } from "@types";

const Resources: NextPageWithLayout = () => {
  //states
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ID, setID] = useState();
  const [loadMore, setloadMore] = useState(true);
  const [loadMoreData, setLoadMoreData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [description, setDescription] = useState();
  const [allResourceList, setAllResourceList] = useState<Content[]>([]);
  const dispatch = useDispatch();
  const [total, setTotal] = useState<number>(0);
  // const allResourceList = useSelector((state:any) => state.mediaReducer.resources)
  const fetchResourceData = async () => {
    setIsLoading(true);
    const data = {
      type: "resources",
      page: page,
      per_page: perPage,
      search: search,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(resourceListingApiCall(data) as unknown as ResourceListAction);
    setAllResourceList(response.data.data.resources);
    setTotal(response.data.data.count);
    setIsLoading(false);
  };

  const loadData = async () => {
    if (total && total > page * perPage) {
      const data: FilterAndPagination = {
        page: page + 1,
        per_page: perPage,
        search: search,
        type: "resources",
      };
      const response = await dispatch(
        resourceListingApiCall(data) as unknown as ResourceListAction,
      );
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...allResourceList, ...response.data.data.resources];
        setAllResourceList(arr);
      } else {
      }
    } else {
      setloadMore(false);
    }
  };
  useEffect(() => {
    fetchResourceData();
  }, []);
  return (
    <>
      <HomeHeader />

      <div className="resources-header ">
        <img src={ResourcesImg.src} className="img-fluid w-100" />
        <div className="resources-conent">
          <p className="font-56px sy-tx-white text-uppercase f-900 mb-0">Resources</p>
        </div>
      </div>

      <div className="container">
        <div className="font-56px text-center mt-5 text-uppercase">
          Find <span className="sy-tx-primary ">Resources</span>
        </div>

        {!isLoading ? (
          <div className="pdf-margin-top">
            <InfiniteScroll
              className="infinity-scroll"
              dataLength={allResourceList.length}
              loader={
                allResourceList.length !== total ? (
                  <div className="mt-sm-5 d-flex justify-content-center">
                    <Button className="custom-btn10" onClick={() => loadData()}>
                      Load More
                    </Button>
                  </div>
                ) : null
              }
              hasMore={loadMore}
              scrollableTarget="pdf-Scrolling"
              next={() => {}}
            >
              <Row>
                {allResourceList && allResourceList.length > 0
                  ? allResourceList.map((item, key) => {
                      return (
                        <Col md={4} key={key}>
                          <Card className="pdf-card p-3">
                            <div className="pdf-content d-flex justify-content-center align-items-center">
                              <a href={item.media} target={"_blank"}>
                                <img alt="Card image" src={PdfImg} className=" img-fluid " />
                              </a>
                            </div>
                            <CardBody className="p-0 mt-3">
                              <CardTitle className="h1 sy-tx-primary f-600">
                                <a href={item.media} target={"_blank"}>
                                  {item?.title || "----"}
                                </a>
                              </CardTitle>
                              <CardText
                                id={`${"registerTip"}${key}`}
                                className="overflow-ellipsis sy-tx-black"
                              >
                                {item?.description || "----"}
                              </CardText>
                              <UncontrolledTooltip target={`${"registerTip"}${key}`}>
                                {" "}
                                {item.description}{" "}
                              </UncontrolledTooltip>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    })
                  : "No Data Found"}
              </Row>
            </InfiniteScroll>
          </div>
        ) : (
          <ShimmerCard />
        )}
      </div>
    </>
  );
};
Resources.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Resources;
