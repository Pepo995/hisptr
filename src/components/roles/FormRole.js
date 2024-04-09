import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { CardBody, Col, Input, Button, Label, Row } from "reactstrap";
import { SELECT_ONE_PERMISSON } from "@constants/ToastMsgConstants";
import { moduleFetchApiCall } from "@redux/action/ModuleAction";
import { ROLE_REQUIRE } from "@constants/ValidationConstants";
import { roleAddApiCall } from "@redux/action/RoleAction";
import ShimmerRoleEdit from "@components/Shimmer/ShimmerRoleEdit";
import Link from "next/link";

const FormRole = () => {
  const dispatch = useDispatch();
  const module = useSelector((state) => state?.moduleReducer?.module);
  const [isLoading, setIsLoading] = useState(false);
  const [permisson, setPermisson] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  //Formik initial form value
  const initialFormValues = { name: "" };
  //Formik validation schema
  const roleSchema = Yup.object({
    name: Yup.string().required(ROLE_REQUIRE),
  });

  /* The above code is using the useEffect hook to call the moduleFetchApiCall action creator. */
  useEffect(() => {
    const getModules = async () => {
      setIsLoading(true);
      await dispatch(moduleFetchApiCall());
      setIsLoading(false);
    };
    getModules();
  }, []);
  useEffect(() => {}, [isUpdate]);

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
      tempArray[index]?.add_access === false &&
      tempArray[index]?.delete_access === false &&
      tempArray[index]?.edit_access === false &&
      tempArray[index]?.view_access === false &&
      tempArray[index]?.read_access === false
    ) {
      tempArray[index] = { ...tempArray[index], module_code: null };
      setPermisson(tempArray);
      setIsUpdate(!isUpdate);
    }
  };

  /**
   * This function is used to add a role.
   * @param values - The values of the form.
   */
  const addRoleHandler = async (values) => {
    //filter data if permisson is available
    const filtereData = permisson.filter((item) => item.module_code);
    /* Checking if the user has selected at least one permission. If yes, it will call the API to add
    the role. */
    if (filtereData?.length !== 0) {
      const data = {
        name: values.name,
        modules: filtereData,
      };
      await dispatch(roleAddApiCall(data));
    } else {
      toast.error(SELECT_ONE_PERMISSON);
    }
  };

  return (
    <div>
      <CardBody>
        {!isLoading ? (
          <Formik
            initialValues={initialFormValues}
            validationSchema={roleSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={addRoleHandler}
          >
            {({ errors, setFieldValue }) => (
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
                      placeholder="Enter Role Name"
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                      }}
                    />
                    <span className="text-danger error-msg">{errors?.name}</span>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="3" for="permission select">
                    Permissions <b> (Select Multiple Permissions)</b>
                  </Label>
                </Row>
                {module?.map((element, key) => {
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
                              permisson[key]?.read_access === (element.is_read === 1) &&
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
                              checked={permisson && permisson[key]?.view_access === true}
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
                              checked={permisson && permisson[key]?.read_access === true}
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
                              checked={permisson && permisson[key]?.add_access === true}
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
                              checked={permisson && permisson[key]?.edit_access === true}
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
                              checked={permisson && permisson[key]?.delete_access === true}
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
                    <Button className="me-1 custom-btn7" color="primary" type="submit">
                      Save
                    </Button>
                    <Link href="/admin/role">
                      <Button outline className="custom-btn9" type="button">
                        Cancel
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          <ShimmerRoleEdit />
        )}
      </CardBody>
    </div>
  );
};
export default FormRole;
