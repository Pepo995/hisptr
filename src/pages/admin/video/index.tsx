import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import { Edit } from "react-feather";
import DeleteModal from "@components/Modal/DeleteModal";
import Breadcrumbs from "@components/breadcrumbs";

import { useDispatch } from "react-redux";
import { videoListingApiCall } from "@redux/action/MediaAction";
import InfiniteScroll from "react-infinite-scroll-component";
import { VIDEO } from "@constants/CommonConstants";

import ReactPlayer from "react-player";

import { onSearchHandler } from "@utils/Utils";
import { checkPermisson } from "@utils/platformUtils";
import ShimmerCard from "@components/Shimmer/ShimmerCard";
import NoDataFound from "@components/Common/NoDataFound";
import PlayVideo from "@images/play.svg";
import { useRouter } from "next/router";
import VideoModal from "@components/FindVideo/VideoModal";
import EditVideo from "@components/FindVideo/EditVideo";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import AddVideo from "@components/FindVideo/AddVideo";

const VideoList: NextPageWithLayout = () => {
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const perPage = 9;
  const sort_order = "asc";
  const type = "video";
  const [videoList, setVideoList] = useState([]);
  const [total, setTotal] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [deleteId, setDeleteID] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [url, setUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const mediaAccess = checkPermisson(router.pathname);

  /**
   * It fetches the video list from the server.
   */
  const getVideos = async () => {
    setIsLoading(true);
    setVideoList([]);
    setTotal(null);
    const data = {
      page: 1,
      per_page: perPage,
      /*eslint-disable-next-line */
      sort_order: sort_order,
      /*eslint-disable-next-line */
      search: search,
      /*eslint-disable-next-line */
      type: type,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const response = await dispatch(videoListingApiCall(data) as unknown as AnyAction);
    if (response.status === 200) {
      setVideoList(response.data.data.content);
      setTotal(response.data.data.count);
    }
    setIsLoading(false);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    getVideos();
  }, [search]);

  const listData =
    videoList &&
    (videoList.length !== 0 ? (
      videoList.map((item, key) => {
        return (
          <Col md={4} key={key}>
            <Card className="pdf-card p-2 bg-white">
              <div
                onClick={() => {
                  /*eslint-disable-next-line */
                  setUrl(item.media), setIsOpen(true);
                }}
                className="cursor-pointer"
              >
                <div className="d-flex justify-content-center video-position">
                  <ReactPlayer url={item.media} height="100%" playing={false} light={false} />
                  <div
                    className="play-video p-75"
                    onClick={() => {
                      /*eslint-disable-next-line */
                      setUrl(item.media), setIsOpen(true);
                    }}
                  >
                    <img src={PlayVideo} className="img-fluid" />
                  </div>
                </div>
              </div>
              <CardBody className="p-0 mt-2">
                <CardTitle
                  className="h1 sy-tx-primary mb-50 cursor-pointer"
                  onClick={() => {
                    /*eslint-disable-next-line */
                    setUrl(item.media), setIsOpen(true);
                  }}
                >
                  {item.title}
                </CardTitle>
                <CardText id={`${"registerTip"}${key}`}>{item.description}</CardText>
                <UncontrolledTooltip target={`${"registerTip"}${key}`}>
                  {" "}
                  {item.description}{" "}
                </UncontrolledTooltip>
              </CardBody>

              <div className="d-flex mt-75 ">
                <div>
                  {mediaAccess?.edit_access === 1 && (
                    <button
                      onClick={() => {
                        /*eslint-disable-next-line */
                        callbackEdit(), setEditId(item.id);
                      }}
                      type="button"
                      className="btn btn-icon btn btn-transparent btn-sm"
                    >
                      <Edit className="me-25" />
                    </button>
                  )}
                  {mediaAccess?.delete_access === 1 && (
                    <button
                      type="button"
                      className="btn btn-icon btn btn-transparent btn-sm"
                      onClick={() => {
                        setDeleteID({ id: item.id, type: VIDEO });
                      }}
                    >
                      <DeleteModal
                        description={item.title}
                        id={deleteId}
                        code={VIDEO}
                        refresh={getVideos}
                      />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        );
      })
    ) : (
      <Col>
        <NoDataFound message={VIDEO} />
      </Col>
    ));
  /**
   * A function that is called when the user scrolls to the bottom of the page. It fetches the next page
   * of data from the API and appends it to the existing data.
   */
  const scrollToEnd = async () => {
    if (total !== 0 && total > page * perPage) {
      const data = {
        page: page + 1,
        per_page: perPage,
        /*eslint-disable-next-line */
        sort_order: sort_order,
        /*eslint-disable-next-line */
        search: search,
        /*eslint-disable-next-line */
        type: type,
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const response = await dispatch(videoListingApiCall(data) as unknown as AnyAction);
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...videoList, ...response.data.data.content];
        setVideoList(arr);
      } else {
      }
    } else {
      setHasMore(false);
    }
  };
  //callback add view
  const callbackAdd = () => setAdd(!add);
  //callback edit view
  const callbackEdit = () => setEdit(!edit);

  return (
    <>
      <div className={add || edit ? "d-none " : "d-block"}>
        <Breadcrumbs title="Video" data={[{ title: "Media" }, { title: "Video List" }]} />
        <div className="resource-header-content">
          <Row>
            <Col md="8">
              <Label for="status-select">Search</Label>
              <Input
                type="search"
                isClearable={true}
                placeholder="Search now "
                onChange={(e) => onSearchHandler(e, setSearch, setPage)}
              />
            </Col>

            <Col Col md="4" className="mt-2 text-right">
              {mediaAccess?.add_access === 1 && (
                <Button className="custom-btn3" onClick={callbackAdd}>
                  + Add Video
                </Button>
              )}
            </Col>
          </Row>
        </div>
        <div className="pdf-margin-top" id="video-data">
          <InfiniteScroll
            className="infinity-scroll"
            scrollableTarget={"video-data"}
            dataLength={videoList && videoList?.length}
            hasMore={hasMore}
            height={800}
            width={500}
            loader={
              videoList && total && videoList?.length !== 0 && total !== videoList?.length ? (
                <div div className="mt-sm-5 d-flex justify-content-center">
                  <Button className="custom-btn2" onClick={scrollToEnd}>
                    Load More
                  </Button>
                </div>
              ) : null
            }
          >
            <Row>{!isLoading ? listData : <ShimmerCard />}</Row>
          </InfiniteScroll>
        </div>

        {url && setIsOpen ? <VideoModal url={url} setIsOpen={setIsOpen} open={isOpen} /> : null}
      </div>
      {add ? <AddVideo open={add} callbackAdd={callbackAdd} refresh={getVideos} /> : null}
      {edit ? (
        <EditVideo open={edit} callbackEdit={callbackEdit} id={editId} refresh={getVideos} />
      ) : null}
    </>
  );
};

VideoList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default VideoList;
