import { useEffect, useState } from "react";
import { Edit } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";
import { useRouter } from "next/router";
import { faqListing } from "@redux/action/FaqsActions";
import { useDispatch } from "react-redux";
import ShimmerFaq from "@components/Shimmer/ShimmerFaq";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import DeleteModal from "@components/Modal/DeleteModal";
import { FAQ } from "@constants/CommonConstants";
import InfiniteScroll from "react-infinite-scroll-component";
import { onSearchHandler } from "@utils/Utils";
import NoDataFound from "@components/Common/NoDataFound";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import AddFaq from "@components/Faq/AddFaq";
import EditFaq from "@components/Faq/Editfaq";
import { checkPermisson } from "@utils/platformUtils";
import { type AnyAction } from "@reduxjs/toolkit";

const Faq: NextPageWithLayout = () => {
  // ** State
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ID, setID] = useState();
  const [loadMore, setloadMore] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [description, setDescription] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [faqLists, setfaqLists] = useState<any[]>([]);
  const [faqcount, setfaqcount] = useState();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState<string>();
  const router = useRouter();
  const mediaAccess = checkPermisson(router.pathname);
  const toggle = (id: string) => {
    open === id ? setOpen(undefined) : setOpen(id);
  };
  /**
   * This function is used to fetch the faq list from the database.
   */
  const faqList = async () => {
    setIsLoading(true);
    /*eslint-disable */
    const data = {
      type: "faq",
      search: search,
      page: 1,
      per_page: perPage,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(faqListing(data) as unknown as AnyAction);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setfaqLists(res.data.data.content);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setfaqcount(res.data.data.count);
    setIsLoading(false);
  };
  /**
   * This function is used to load more data on the page.
   */
  const loadData = async () => {
    if (faqcount && faqcount > page * perPage) {
      const data = {
        type: "faq",
        /*eslint-disable-next-line */
        search: search,
        page: page + 1,
        per_page: perPage,
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const response = await dispatch(faqListing(data) as unknown as AnyAction);
      setPage(page + 1);
      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const arr = [...faqLists, ...response.data.data.content];
        setfaqLists(arr);
      } else {
      }
    } else {
      setloadMore(false);
    }
  };
  /* A react hook that is used to run a function when the component is mounted. */
  useEffect(() => {
    void faqList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  //callback add view
  const callbackAdd = () => setAdd(!add);
  //callback edit view
  const callbackEdit = () => setEdit(!edit);

  return (
    <>
      <div className={add || edit ? "d-none " : "d-block"}>
        <Breadcrumbs
          title="FAQ"
          data={[{ title: "Media" }, { title: "FAQ" }, { title: "FAQ List" }]}
        />
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
                  + Add question
                </Button>
              )}
            </Col>
          </Row>
        </div>

        <div id="faq-Scrolling">
          {" "}
          <InfiniteScroll
            className="infinite-Scrolling"
            dataLength={faqLists?.length}
            height={300}
            loader={
              faqLists?.length !== faqcount ? (
                <div className="mt-sm-5 d-flex justify-content-center">
                  <Button className="custom-btn8" onClick={() => loadData()}>
                    Load More
                  </Button>
                </div>
              ) : null
            }
            hasMore={loadMore}
            scrollableTarget="faq-Scrolling"
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            next={() => {}}
          >
            {!isLoading ? (
              <>
                {faqLists && faqLists?.length !== 0 ? (
                  faqLists.map((faq) => {
                    return (
                      <Accordion open={open ?? ""} toggle={toggle} className="mt-1" key={faq.id}>
                        <AccordionItem>
                          <AccordionHeader targetId={faq.id}>
                            {faq.title}
                            <div className="edit-btn">
                              {mediaAccess?.edit_access === 1 && (
                                <Edit
                                  className="me-25"
                                  onClick={(e) => {
                                    /*eslint-disable-next-line */
                                    e.preventDefault(), callbackEdit(), setEditId(faq.id);
                                  }}
                                />
                              )}
                              {mediaAccess?.delete_access === 1 && (
                                <button
                                  type="button"
                                  className="buttonbtn btn-icon btn btn-transparent btn-sm"
                                  onClick={(e) => {
                                    /*eslint-disable-next-line */
                                    e.preventDefault(),
                                      setID({ id: faq.id, type: "faq" }),
                                      setDescription(faq.title);
                                  }}
                                >
                                  <DeleteModal
                                    description={description}
                                    id={ID}
                                    code={FAQ}
                                    refresh={() => faqList()}
                                  />
                                </button>
                              )}
                            </div>
                          </AccordionHeader>
                          <AccordionBody accordionId={faq.id}>{faq.description}</AccordionBody>
                        </AccordionItem>
                      </Accordion>
                    );
                  })
                ) : (
                  <Col>
                    {" "}
                    <NoDataFound message={FAQ} />
                  </Col>
                )}
              </>
            ) : (
              <ShimmerFaq />
            )}
          </InfiniteScroll>
        </div>
      </div>
      {add ? <AddFaq open={add} callbackAdd={callbackAdd} refresh={faqList} /> : null}
      {edit ? (
        <EditFaq open={edit} callbackEdit={callbackEdit} id={editId} refresh={faqList} />
      ) : null}
    </>
  );
};

Faq.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Faq;
