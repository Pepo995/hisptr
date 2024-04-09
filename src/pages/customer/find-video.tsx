/*eslint-disable */
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  UncontrolledTooltip,
  CardText,
  Button,
} from "reactstrap";

import HomeHeader from "@components/HomeHeader";
import ResourcesImg from "@images/resources.png";
import { useDispatch } from "react-redux";
import { videoListApiCall } from "@redux/action/ResourceAction";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoModal from "@components/FindVideo/VideoModal";
import ReactPlayer from "react-player";
import PlayVideo from "@images/play.svg";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { FilterAndPagination, Video, VideoListAction } from "@types";

const FindVideo: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const sort_order = "asc";
  const type = "video";
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [deleteId, setDeleteID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  //get video list
  const getVideos = async () => {
    setIsLoading(true);
    setVideoList([]);
    setTotal(0);
    const data: FilterAndPagination = {
      page: page,
      per_page: perPage,
      sort_order: sort_order,
      search: search,
      type: type,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(videoListApiCall(data) as unknown as VideoListAction);
    if (response.status === 200) {
      setVideoList(response.data.data.videos);
      setTotal(response.data.data.count);
    }
    setIsLoading(false);
  };
  //onload get video list
  useEffect(() => {
    getVideos();
  }, [search]);

  const listData =
    videoList &&
    videoList.length !== 0 &&
    videoList.map((item, key) => {
      return (
        <Col md={4} key={key} className="mb-3">
          <Card className="pdf-card p-3">
            <div
              onClick={() => {
                setUrl(item.media), setIsOpen(true);
              }}
            >
              <div className="d-flex justify-content-center cursor-pointer video-position">
                <ReactPlayer
                  className={"video-player"}
                  url={item.media}
                  playing={false}
                  light={false}
                />
                <div className="play-video p-2">
                  <img src={PlayVideo} className="img-fluid" />
                </div>
              </div>

              <CardBody className="p-0 mt-3">
                <CardTitle className="h1 sy-tx-primary f-600">{item.title}</CardTitle>
                <CardText id={`${"registerTip"}${key}`} className="overflow-ellipsis sy-tx-black">
                  {item.description}
                </CardText>
                <UncontrolledTooltip target={`${"registerTip"}${key}`}>
                  {" "}
                  {item.description}{" "}
                </UncontrolledTooltip>
              </CardBody>
            </div>
          </Card>
        </Col>
      );
    });
  //on click load more data
  const scrollToEnd = async () => {
    if (total && total > page * perPage) {
      const data: FilterAndPagination = {
        page: page + 1,
        per_page: perPage,
        sort_order: sort_order,
        search: search,
        type: type,
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const response = await dispatch(videoListApiCall(data) as unknown as VideoListAction);
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...videoList, ...response.data.data.videos];
        setVideoList(arr);
      } else {
      }
    } else {
      setHasMore(false);
    }
  };
  return (
    <>
      <div className="bg-color">
        <HomeHeader />
        <div className="resources-header ">
          <img src={ResourcesImg} className="img-fluid w-100" />
          <div className="resources-conent">
            <p className="font-56px sy-tx-white text-uppercase f-900 mb-0">Videos</p>
          </div>
        </div>

        <div className="container">
          <div className="font-56px text-center mt-5 text-uppercase">
            Find <span className="sy-tx-primary">Videos</span>
          </div>
          {
            !isLoading ? (
              <div className="pdf-margin-top" id="video-data">
                <InfiniteScroll
                  className="infinity-scroll"
                  scrollableTarget="video-data"
                  dataLength={videoList && videoList.length}
                  hasMore={hasMore}
                  loader={
                    videoList && total && videoList.length !== 0 && total !== videoList.length ? (
                      <div className="mt-sm-5 d-flex justify-content-center">
                        <Button className="custom-btn10" onClick={scrollToEnd}>
                          Load More
                        </Button>
                      </div>
                    ) : null
                  }
                  next={() => {}}
                >
                  <Row>{listData}</Row>
                </InfiniteScroll>
              </div>
            ) : null
            //loader
          }
        </div>
      </div>
      {url && setIsOpen ? <VideoModal url={url} setIsOpen={setIsOpen} open={isOpen} /> : null}
    </>
  );
};
FindVideo.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default FindVideo;
