import { useState, useEffect } from "react";
import { Edit } from "react-feather";
import Breadcrumbs from "@components/breadcrumbs";

import { faqListing } from "@redux/action/FaqsActions";
import { useDispatch } from "react-redux";
import ShimmerFaq from "@components/Shimmer/ShimmerFaq";
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import DeleteModal from "@components/Modal/DeleteModal";
import { FAQ } from "@constants/CommonConstants";
import InfiniteScroll from "react-infinite-scroll-component";
import AddFaq from "./AddFaq";
import EditFaq from "./Editfaq";
import { onSearchHandler } from "@utils/Utils";
import { checkPermisson } from "@utils/platformUtils";
import NoDataFound from "@components/Common/NoDataFound";
import { useRouter } from "next/router";

const Faq = () => {
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
  const [faqLists, setfaqLists] = useState([]);
  const [faqcount, setfaqcount] = useState();
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState("");
  const router = useRouter();
  const mediaAccess = checkPermisson(router.pathname);
  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
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
    const res = await dispatch(faqListing(data));
    setfaqLists(res.data.data.content);
    setfaqcount(res.data.data.count);
    setIsLoading(false);
  };
  /**
   * This function is used to load more data on the page.
   */
  const loadData = async () => {
    if (faqcount !== 0 && faqcount > page * perPage) {
      const data = {
        type: "faq",
        /*eslint-disable-next-line */
        search: search,
        page: page + 1,
        per_page: perPage,
      };
      const response = await dispatch(faqListing(data));
      setPage(page + 1);
      if (response.status === 200) {
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
    faqList();
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
            dataLength={faqLists && faqLists?.length}
            height={300}
            loader={
              faqLists?.length !== faqcount ? (
                <div className="mt-sm-5 d-flex justify-content-center">
                  <Button className="custom-btn2" onClick={() => loadData()}>
                    Load More
                  </Button>
                </div>
              ) : null
            }
            hasMore={loadMore}
            scrollableTarget="faq-Scrolling"
          >
            {!isLoading ? (
              <>
                {faqLists && faqLists?.length !== 0 ? (
                  faqLists.map((faq) => {
                    return (
                      <Accordion
                        open={open}
                        toggle={toggle}
                        className="mt-1"
                        key={faq.id}
                      >
                        <AccordionItem>
                          <AccordionHeader targetId={faq.id}>
                            {faq.title}
                            <div className="edit-btn">
                              {mediaAccess?.edit_access === 1 && (
                                <Edit
                                  className="me-25"
                                  onClick={(e) => {
                                    /*eslint-disable-next-line */
                                    e.preventDefault(),
                                      callbackEdit(),
                                      setEditId(faq.id);
                                  }}
                                />
                              )}
                              {mediaAccess?.delete_access === 1 && (
                                <button
                                  type="button"
                                  class="buttonbtn btn-icon btn btn-transparent btn-sm"
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
                          <AccordionBody accordionId={faq.id}>
                            {faq.description}
                          </AccordionBody>
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
      {add ? (
        <AddFaq open={add} callbackAdd={callbackAdd} refresh={faqList} />
      ) : null}
      {edit ? (
        <EditFaq
          open={edit}
          callbackEdit={callbackEdit}
          id={editId}
          refresh={faqList}
        />
      ) : null}
    </>
  );
};

export default Faq;
