import { api } from "~/api";
import { toast } from "react-toastify";
import { createFaqs, deleteFaqs, editFaqs, getFaq, listFaqs } from "@configs/ApiEndpoints";
//Add faq API call
export const addFaq = (data) => {
  return async () => {
    const response = await api(createFaqs, data, "post");
    if (response.status === 200) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//edit faq pi call
export const editFaqApiCall = (data) => {
  return async () => {
    const response = await api(editFaqs, data, "post");
    if (response.status === 200) {
      toast.success(response.data.message);
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Delete faq API call
export const deleteFaq = (id) => {
  return async () => {
    const response = await api(`${deleteFaqs}/${id}`, {}, "delete");
    if (response.status === 200) {
      toast.success(response.data.message);
      router.replace("/faq");
    } else {
      return response;
    }
  };
};
//Faq API listing api call
export const faqListing = (data) => {
  return async () => {
    const response = await api(listFaqs, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
//Get FAQ by id API call
export const faqGet = (data) => {
  return async () => {
    const response = await api(getFaq, data, "post");
    if (response.status === 200) {
      return response;
    } else {
      toast.error(response.data.message);
      return response;
    }
  };
};
