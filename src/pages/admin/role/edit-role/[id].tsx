import { Fragment, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row } from "reactstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { roleEditApiCall, roleGetByIdApiCall } from "@redux/action/RoleAction";
import { ROLE_REQUIRE } from "@constants/ValidationConstants";
import Breadcrumbs from "@components/breadcrumbs";
import { moduleFetchApiCall } from "@redux/action/ModuleAction";
import { SELECT_ONE_PERMISSON } from "@constants/ToastMsgConstants";
import ShimmerRoleEdit from "@components/Shimmer/ShimmerRoleEdit";

import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";

const EditRole: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [permisson, setPermisson] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [name, setName] = useState(null);
  const [spareArray, setSpareArray] = useState([]);
  const router = useRouter();
  /* A react hook that is called when the component is mounted. It is used to fetch the data from the API. */
  useEffect(() => {
    /**
     * It fetches the data from the API and sets the state of the component.
     * @param id - The id of the role you want to edit.
     */
    const getEditData = async (id) => {
      setIsLoading(true);
      const tempArray: RequestOption[] = [];
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const moduleResponce = await dispatch(moduleFetchApiCall() as unknown as AnyAction);
      if (moduleResponce.status === 200) {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const responce = await dispatch(roleGetByIdApiCall(id) as unknown as AnyAction);
        if (responce.status === 200) {
          setName(responce.data.name);
          const editData = responce.data.module_roles;
          editData.map((item, i) => {
            editData[i] = {
              module_code: item.module_code,
              add_access: item.add_access === 1,
              delete_access: item.delete_access === 1,
              edit_access: item.edit_access === 1,
              view_access: item.view_access === 1,
            };
          });
          const moduleData = moduleResponce.data;
          moduleResponce?.data?.map(
            (m, i) =>
              /*eslint-disable-next-line */
              (tempArray[i] = {
                ...responce?.data?.module_roles?.find((x) => x.module_code === m.code),
              }),
          );
          setSpareArray(moduleData);
          setPermisson(tempArray);
        }
      }
      setIsLoading(false);
    };
    if (router.query === undefined) {
      router.replace("/role");
    } else if (router.query.id !== undefined) {
      getEditData({ id: router.query.id });
    }
  }, [router.query.id]);

  //Formik initial form value
  const initialFormValues = { name: name !== null ? name : "" };
  //Formik validation schema
  const roleSchema = Yup.object({
    name: Yup.string().required(ROLE_REQUIRE),
  });

  /**
   * It checks if the value is true or false, if true it checks if the value is first time checked, if
   * true it adds the value to the array, if false it updates the value in the array, if false it removes
   * the value from the array
   * @param e - event
   * @param value - the value of the checkbox
   * @param index - index of the module in the array
   * @param module - the module code
   * @param allArray - This is an array of objects that contains all the permissions.
   */
  const checkFunction = (e, value, index, module, allArray) => {
    const tempArray = permisson;
    //if checked value is true
    if (value === true) {
      //check if value is first time checked
      const checked = permisson.some((ele) => ele.module_code === module);
      if (checked === false) {
        tempArray[index] = {
          module_code: module,
          add_access: false,
          delete_access: false,
          edit_access: false,
          view_access: false,
          read_access: false,
        };
        if (e.target.value === "add_access") {
          tempArray[index] = { ...tempArray[index], add_access: true };
        } else if (e.target.value === "delete_access") {
          tempArray[index] = { ...tempArray[index], delete_access: true };
        } else if (e.target.value === "edit_access") {
          tempArray[index] = { ...tempArray[index], edit_access: true };
        } else if (e.target.value === "view_access") {
          tempArray[index] = { ...tempArray[index], view_access: true };
        } else if (e.target.value === "read_access") {
          tempArray[index] = { ...tempArray[index], read_access: true };
        } else {
          tempArray[index] = {
            ...tempArray[index],
            ...allArray?.[0],
            all: true,
          };
        }
        setPermisson(tempArray);
        setIsUpdate(!isUpdate);
      } else {
        if (e.target.value === "add_access") {
          tempArray[index] = { ...tempArray[index], add_access: true };
        } else if (e.target.value === "delete_access") {
          tempArray[index] = { ...tempArray[index], delete_access: true };
        } else if (e.target.value === "edit_access") {
          tempArray[index] = { ...tempArray[index], edit_access: true };
        } else if (e.target.value === "view_access") {
          tempArray[index] = { ...tempArray[index], view_access: true };
        } else if (e.target.value === "read_access") {
          tempArray[index] = { ...tempArray[index], read_access: true };
        } else {
          tempArray[index] = {
            ...tempArray[index],
            ...allArray[0],
            all: false,
          };
        }
        setPermisson(tempArray);
        setIsUpdate(!isUpdate);
      }
    } else {
      if (e.target.value === "add_access") {
        tempArray[index] = { ...tempArray[index], add_access: false };
      } else if (e.target.value === "delete_access") {
        tempArray[index] = { ...tempArray[index], delete_access: false };
      } else if (e.target.value === "edit_access") {
        tempArray[index] = { ...tempArray[index], edit_access: false };
      } else if (e.target.value === "view_access") {
        //if view permission is not enable then all permissions are revoked
        tempArray[index] = {
          module_code: module,
          add_access: false,
          delete_access: false,
          edit_access: false,
          view_access: false,
          read_access: false,
        };
      } else {
        tempArray[index] = {
          module_code: module,
          add_access: false,
          delete_access: false,
          edit_access: false,
          view_access: false,
          read_access: false,
        };
        // tempArray.splice(index, 1)
      }
      setPermisson(tempArray);
      setIsUpdate(!isUpdate);
    }
    // if all values are false
    if (
      tempArray[index].add_access === false &&
      tempArray[index].delete_access === false &&
      tempArray[index].edit_access === false &&
      tempArray[index].view_access === false &&
      tempArray[index].read_access === false
    ) {
      tempArray[index] = { ...tempArray[index], module_code: null };
      setPermisson(tempArray);
      setIsUpdate(!isUpdate);
    }
  };

  /**
   * A function that is called when the user clicks on the edit button.
   * @param values - The values of the form.
   */
  const editRoleHandler = async (values) => {
    //filter data if permisson is available
    const filtereData = permisson.filter(
      (item) => item.add_access || item.delete_access || item.edit_access || item.view_access,
    );
    /* The above code is checking if the user has selected at least one permission. If the user has
    selected at least one permission, then the code will send a request to the server to edit the
    role. */
    if (filtereData?.length !== 0) {
      const data = {
        id: router.query.id,
        name: values.name,
        modules: filtereData,
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      await dispatch(roleEditApiCall(data) as unknown as AnyAction);
    } else {
      toast.error(SELECT_ONE_PERMISSON);
    }
  };

  return (
    <div>
      <Fragment>
        <Helmet>
          <title>Hipstr - Edit Role</title>
        </Helmet>
        <Breadcrumbs
          title="Roles and Permission"
          data={[{ title: "Role Listing", link: "/admin/role" }, { title: "Edit Role" }]}
        />
        <Card noBody className="bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
              <Link href="/admin/role">
                {" "}
                <ArrowLeft className="sy-tx-primary" />
              </Link>{" "}
              Edit Role
            </CardTitle>
          </CardHeader>
          <div className="form-add-role">
            {!isLoading && name ? (
              <CardBody>
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={roleSchema}
                  validateOnBlur={true}
                  validateOnChange={true}
                  onSubmit={editRoleHandler}
                >
                  {({ errors, setFieldValue, values }) => (
                    <Form>
                      <Row className="mb-1">
                        <Label sm="2" for="name">
                          Role Name
                        </Label>

                        <Col sm="6">
                          <Input
                            type="text"
                            name="name"
                            id="name"
                            value={values.name}
                            placeholder="Name"
                            onChange={(e) => {
                              setFieldValue("name", e.target.value);
                            }}
                          />
                          <span className="text-danger error-msg">{errors?.name}</span>
                        </Col>
                      </Row>
                      {spareArray &&
                        spareArray.map((element, key) => {
                          return (
                            <Row className="mb-1" key={key}>
                              <Label sm="2" for="event-management">
                                <b>
                                  {key + 1}. {element.name}
                                </b>
                              </Label>
                              <Col sm="9">
                                <div className="form-check form-check-inline">
                                  <Input
                                    type="checkbox"
                                    id="read-list"
                                    value={"all"}
                                    onChange={(e) => {
                                      checkFunction(e, e.target.checked, key, element.code, [
                                        {
                                          view_access: element.is_view === 1,
                                          read_access: element.is_read === 1,
                                          add_access: element.is_add === 1,
                                          edit_access: element.is_update === 1,
                                          delete_access: element.is_delete === 1,
                                        },
                                      ]);
                                    }}
                                    checked={
                                      permisson &&
                                      permisson[key]?.view_access === (element.is_view === 1) &&
                                      permisson[key]?.add_access === (element.is_add === 1) &&
                                      permisson[key]?.edit_access === (element.is_update === 1) &&
                                      permisson[key]?.delete_access === (element.is_delete === 1)
                                    }
                                  />
                                  <Label
                                    for="read-list"
                                    className="form-check-label"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    All
                                  </Label>
                                </div>
                                {element.is_view === 1 ? (
                                  <div className="form-check form-check-inline">
                                    <Input
                                      type="checkbox"
                                      id="read-list"
                                      value={"view_access"}
                                      onChange={(e) => {
                                        checkFunction(e, e.target.checked, key, element.code);
                                      }}
                                      checked={
                                        permisson &&
                                        (permisson[key]?.view_access === true ||
                                          permisson[key]?.view_access === 1)
                                      }
                                    />
                                    <Label
                                      for="read-list"
                                      className="form-check-label"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      View List
                                    </Label>
                                  </div>
                                ) : null}
                                {element.is_read === 1 ? (
                                  <div className="form-check form-check-inline">
                                    <Input
                                      type="checkbox"
                                      id="read-list"
                                      value={"read_access"}
                                      onChange={(e) => {
                                        checkFunction(e, e.target.checked, key, element.code);
                                      }}
                                      checked={
                                        permisson &&
                                        (permisson[key]?.read_access === true ||
                                          permisson[key]?.read_access === 1)
                                      }
                                      disabled={permisson && permisson[key]?.view_access !== true}
                                    />
                                    <Label
                                      for="read-list"
                                      className="form-check-label"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Read List
                                    </Label>
                                  </div>
                                ) : null}
                                {element.is_add === 1 ? (
                                  <div className="form-check form-check-inline">
                                    <Input
                                      type="checkbox"
                                      id="add"
                                      value={"add_access"}
                                      onChange={(e) => {
                                        checkFunction(e, e.target.checked, key, element.code);
                                      }}
                                      checked={
                                        permisson &&
                                        (permisson[key]?.add_access === true ||
                                          permisson[key]?.add_access === 1)
                                      }
                                      disabled={permisson && permisson[key]?.view_access !== true}
                                    />
                                    <Label
                                      for="add"
                                      className="form-check-label"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Add
                                    </Label>
                                  </div>
                                ) : null}
                                {element.is_update === 1 ? (
                                  <div className="form-check form-check-inline">
                                    <Input
                                      type="checkbox"
                                      id="edit"
                                      value={"edit_access"}
                                      onChange={(e) => {
                                        checkFunction(e, e.target.checked, key, element.code);
                                      }}
                                      checked={
                                        permisson &&
                                        (permisson[key]?.edit_access === true ||
                                          permisson[key]?.edit_access === 1)
                                      }
                                      disabled={permisson && permisson[key]?.view_access !== true}
                                    />
                                    <Label
                                      for="edit"
                                      className="form-check-label"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Edit
                                    </Label>
                                  </div>
                                ) : null}
                                {element.is_delete === 1 ? (
                                  <div className="form-check form-check-inline">
                                    <Input
                                      type="checkbox"
                                      id="delete"
                                      value={"delete_access"}
                                      onChange={(e) => {
                                        checkFunction(e, e.target.checked, key, element.code);
                                      }}
                                      checked={
                                        permisson &&
                                        (permisson[key]?.delete_access === true ||
                                          permisson[key]?.delete_access === 1)
                                      }
                                      disabled={permisson && permisson[key]?.view_access !== true}
                                    />
                                    <Label
                                      for="delete"
                                      className="form-check-label"
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      Delete
                                    </Label>
                                  </div>
                                ) : null}
                              </Col>
                            </Row>
                          );
                        })}
                      <Row>
                        <Col className="d-flex" md={{ size: 9, offset: 3 }}>
                          <Button className="me-1 custom-btn7" type="submit">
                            Update
                          </Button>
                          <Link href="/admin/role">
                            {" "}
                            <Button outline className="custom-btn9" type="button">
                              Cancel
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            ) : (
              <ShimmerRoleEdit />
            )}
          </div>
        </Card>
      </Fragment>
    </div>
  );
};

EditRole.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default EditRole;
