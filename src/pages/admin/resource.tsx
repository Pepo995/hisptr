//imports from packages
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

import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { Edit } from "react-feather";
import PdfImg from "@images/pdf-file.svg";
import DeleteModal from "@components/Modal/DeleteModal";
import Breadcrumbs from "@components/breadcrumbs";
import { contentListingApiCall } from "@redux/action/MediaAction";
import { RESOURCES } from "@constants/CommonConstants";
import ShimmerCard from "@components/Shimmer/ShimmerCard";

import { onSearchHandler } from "@utils/Utils";
import NoDataFound from "@components/Common/NoDataFound";
import { useRouter } from "next/router";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import AddResources from "@components/Resources/AddResources";
import EditResources from "@components/Resources/EditResources";
import { checkPermisson } from "@utils/platformUtils";
import { type Content, type ContentListAction, type FilterAndPagination } from "@types";

const Resources: NextPageWithLayout = () => {
  //states
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ID, setID] = useState<{ id: number; type: string }>();
  const [loadMore, setloadMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 9;
  const [description, setDescription] = useState<string>();
  const [allResourceList, setAllResourceList] = useState<Content[]>([]);
  const dispatch = useDispatch();
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  const mediaAccess = checkPermisson(router.pathname);
  /**
   * It fetches the resource data from the API and sets the state of the component
   */
  const fetchResourceData = async () => {
    setIsLoading(true);
    setAllResourceList([]);
    setTotal(0);
    const data: FilterAndPagination = {
      type: "resources",
      page: page,
      per_page: perPage,
      sort_order: "asc",
      search: search,
    };
    const response = await dispatch(contentListingApiCall(data) as unknown as ContentListAction);

    setAllResourceList(response.data.data.content);

    setTotal(response.data.data.count);
    setIsLoading(false);
  };
  /**
   * A function that is called when the user scrolls to the bottom of the page. It loads more data from
   * the API.
   */
  const loadData = async () => {
    if (!!total && total > page * perPage) {
      const data: FilterAndPagination = {
        page: page + 1,
        per_page: perPage,
        search: search,
        type: "resources",
      };
      const response = await dispatch(contentListingApiCall(data) as unknown as ContentListAction);
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...allResourceList, ...response.data.data.content];
        setAllResourceList(arr);
      } else {
      }
    } else {
      setloadMore(false);
    }
  };
  /* A react hook that is called when the component is mounted. It is used to fetch the data from the API. */
  useEffect(() => {
    void fetchResourceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, perPage]);
  //callback add view
  const callbackAdd = () => setAdd(!add);
  //callback edit view
  const callbackEdit = () => setEdit(!edit);

  return (
    <>
      <div className={add || edit ? "d-none " : "d-block"}>
        <Breadcrumbs title="Resources" data={[{ title: "Media" }, { title: "Resources List" }]} />
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
                  + Add Resources
                </Button>
              )}
            </Col>
          </Row>
        </div>

        {!isLoading ? (
          <div className="pdf-margin-top" id="pdf-Scrolling">
            <InfiniteScroll
              className="infinite-Scrolling"
              dataLength={allResourceList?.length}
              loader={
                allResourceList?.length !== total ? (
                  <div className="mt-sm-5 d-flex justify-content-center">
                    <Button className="custom-btn2" onClick={() => loadData()}>
                      Load More
                    </Button>
                  </div>
                ) : null
              }
              hasMore={loadMore}
              scrollableTarget="pdf-Scrolling"
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              next={() => {}}
            >
              <Row>
                {allResourceList && allResourceList?.length > 0 ? (
                  allResourceList.map((item: Content, i) => (
                    <Col md={4} key={`item-${i}`}>
                      {!isLoading ? (
                        <Card className="pdf-card p-2 bg-white">
                          <div className="pdf-content d-flex justify-content-center align-items-center cursor-pointer">
                            <a href={item.media} target={"_blank"}>
                              <PdfImg />
                            </a>
                          </div>
                          <CardBody className="p-0 mt-2">
                            <CardTitle className="h1 sy-tx-primary mb-50">
                              <a
                                href={item.media}
                                target={"_blank"}
                                className="hover-text sy-tx-primary"
                              >
                                {" "}
                                {item?.title || "----"}
                              </a>
                            </CardTitle>
                            <CardText id={`${"resTip"}${i}`}>
                              {item?.description || "----"}
                            </CardText>
                            <UncontrolledTooltip target={`${"resTip"}${i}`}>
                              {" "}
                              {item.description}{" "}
                            </UncontrolledTooltip>
                          </CardBody>
                          <div className="d-flex mt-75 ">
                            <div>
                              {mediaAccess?.edit_access === 1 && (
                                <button
                                  type="button"
                                  className="btn btn-icon btn btn-transparent btn-sm"
                                  onClick={() => {
                                    setEditId(item.id);
                                    callbackEdit();
                                  }}
                                >
                                  <Edit className="me-25" />
                                </button>
                              )}
                              {mediaAccess?.delete_access === 1 && (
                                <button
                                  type="button"
                                  className="btn btn-icon btn btn-transparent btn-sm"
                                  onClick={() => {
                                    setID({ id: item.id, type: "resources" });
                                    setDescription(item.title);
                                  }}
                                >
                                  <DeleteModal
                                    description={description}
                                    id={ID}
                                    code={RESOURCES}
                                    refresh={() => fetchResourceData()}
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ) : (
                        <ShimmerCard />
                      )}
                    </Col>
                  ))
                ) : (
                  <Col>
                    <NoDataFound message={RESOURCES} />
                  </Col>
                )}
              </Row>
            </InfiniteScroll>
          </div>
        ) : (
          <ShimmerCard />
        )}
      </div>
      {add ? (
        <AddResources open={add} callbackAdd={callbackAdd} refresh={fetchResourceData} />
      ) : null}
      {edit ? (
        <EditResources
          open={edit}
          callbackEdit={callbackEdit}
          id={editId}
          refresh={fetchResourceData}
        />
      ) : null}
    </>
  );
};

Resources.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Resources;
