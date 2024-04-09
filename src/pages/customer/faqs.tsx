/*eslint-disable */
import { ChangeEvent, useEffect, useState } from "react";
import {
  AccordionItem,
  AccordionHeader,
  Row,
  Button,
  Accordion,
  Collapse,
  Input,
  InputGroup,
  InputGroupText,
  Col,
} from "reactstrap";

import HomeHeader from "@components/HomeHeader";
import Testimonial from "@components/Testimonial";
import FaqImg from "@images/faq-bg.png";
import ShimmerFaq from "@components/Shimmer/ShimmerFaq";
import { faqListingApiCall } from "@redux/action/ResourceAction";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Plus from "@images/plus.svg";
import Minus from "@images/minus.svg";
import NoDataFound from "@components/Common/NoDataFound";
import { Search } from "react-feather";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { Faq, FaqListAction, FilterAndPagination } from "@types";

const FrequentlyAskedQuestions: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const sort_order = "asc";
  const type = "faq";
  const [faqList, setFaqList] = useState<Faq[]>([]);
  const [total, setTotal] = useState<number>();
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>();
  const [notifyPanels, setNotifyPanels] = useState([]);
  //get video list
  const getFaq = async () => {
    setIsLoading(true);
    setFaqList([]);
    setTotal(0);
    const data: FilterAndPagination = {
      page: 1,
      per_page: perPage,
      sort_order: sort_order,
      search: search,
      type: type,
    };
    const response = await dispatch(faqListingApiCall(data) as unknown as FaqListAction);

    if (response.status === 200) {
      setFaqList(response.data.data.faqs);
      setTotal(response.data.data.count);
      const tempArray = new Array(response.data.data.faqs.length);
      tempArray.fill(false);
      setNotifyPanels(tempArray);
    }
    setIsLoading(false);
  };
  //onload get video list
  useEffect(() => {
    getFaq();
  }, [search]);
  //search function
  const onSearchHandeler = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  };

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
      const response = await dispatch(faqListingApiCall(data) as unknown as FaqListAction);
      setPage(page + 1);
      if (response.status === 200) {
        const arr = [...faqList, ...response.data.data.faqs];
        setFaqList(arr);
        const tempArray = new Array(response.data.data.faqs.length);
        tempArray.fill(false);
        setNotifyPanels([...notifyPanels, ...tempArray]);
      } else {
      }
    } else {
      setHasMore(false);
    }
  };

  const faqData =
    faqList &&
    (faqList.length !== 0 ? (
      faqList.map((item, key) => {
        return (
          <Row className="mt-4 mb-4" key={key}>
            <Accordion
              key={key}
              open={notifyPanels[key]}
              toggle={() => setNotifyPanels({ ...notifyPanels, [key]: !notifyPanels[key] })}
            >
              <AccordionItem className={notifyPanels[key] ? "faq-active" : "accordion-item"}>
                <AccordionHeader targetId={key.toString()}>
                  <p className="mb-0  letter-spacing f-600 sy-tx-black">{item?.title}</p>
                  <div className="accordion-icon pt-25 px-2">
                    {notifyPanels[key] ? (
                      <img src={Minus} className="img-fluid " />
                    ) : (
                      <img src={Plus} className="img-fluid " />
                    )}
                  </div>
                </AccordionHeader>
                <Collapse
                  isOpen={notifyPanels[key]}
                  accordionId={key}
                  className="sy-tx-black faq-ans "
                >
                  {item?.description}
                </Collapse>
              </AccordionItem>
            </Accordion>
          </Row>
        );
      })
    ) : (
      <div className="my-5">
        <NoDataFound message={"FREQUENTLY ASKED QUESTIONS"} />
      </div>
    ));

  return (
    <>
      <HomeHeader />
      <div className="faq-header ">
        <img src={FaqImg.src} className="img-fluid w-100" />
        <div className="faq-conent">
          <p className="font-56px sy-tx-white f-900 mb-0">FAQs</p>
        </div>
      </div>

      <div className="container mt-sm-5">
        <Row>
          <Col lg={9}>
            <div className="font-56px  mt-3 text-uppercase mt-sm-5 mb-sm-4 mb-3 sy-tx-black">
              frequently asked <span className="sy-tx-primary"> questions</span>
            </div>
          </Col>
          <Col lg={3}>
            <InputGroup className="mt-5  mb-4 mb-3  serach-input">
              <Input
                className="mt-0 mb-0 common-input input-ff"
                placeholder="Search"
                onChange={(e) => onSearchHandeler(e)}
              />
              <InputGroupText className="common-input">
                <Search />
              </InputGroupText>
            </InputGroup>
          </Col>
        </Row>
        {!isLoading ? (
          <div id="faq-data" className="faq-data">
            <InfiniteScroll
              className="infinity-scroll"
              scrollableTarget="faq-data"
              dataLength={faqList && faqList.length}
              hasMore={hasMore}
              loader={
                faqList && total && faqList.length !== 0 && total !== faqList.length ? (
                  <div className="mt-sm-5 d-flex justify-content-center">
                    <Button className="custom-btn10" onClick={scrollToEnd}>
                      Load More
                    </Button>
                    <br />
                  </div>
                ) : null
              }
              next={() => {}}
            >
              {!isLoading ? faqData : <ShimmerFaq />}
            </InfiniteScroll>
            {faqList && total && faqList.length !== 0 && total !== faqList.length ? (
              <div className="mt-sm-5 d-flex justify-content-center mb-sm-5 mb-4">
                <Button className="custom-btn10" onClick={scrollToEnd}>
                  Load More
                </Button>
                <br />
              </div>
            ) : null}
          </div>
        ) : (
          <ShimmerFaq />
        )}
      </div>
      <div className="faq-testimonial">
        <Testimonial />
      </div>
    </>
  );
};
FrequentlyAskedQuestions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default FrequentlyAskedQuestions;
