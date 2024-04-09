import { useEffect, useState } from "react";
import Select from "react-select";

import { components } from "react-select";
import { Input } from "reactstrap";

export const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <Input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          className="cu-checkbox"
        />
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const MultiSelectAll = ({ options, setValue, isUpdate }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  /**
   * If the user selects the "All" option, then we want to select all the other options. If the user
   * deselects the "All" option, then we want to deselect all the other options. If the user deselects
   * any other option, then we want to deselect the "All" option
   * @param value - The value of the select reflected by the selected option(s)
   * @param event - The event object that is passed to the onChange function.
   */
  function handelOnChange(value, event) {
    if (event.action === "select-option" && event.option.value === "*") {
      setSelectedOptions([{ label: "All", value: "*" }, ...options]);
      setValue([...options]);
    } else if (
      event.action === "deselect-option" &&
      event.option.value === "*"
    ) {
      setSelectedOptions([]);
      setValue([]);
    } else if (event.action === "deselect-option") {
      setSelectedOptions(value.filter((o) => o.value !== "*"));
      setValue(value.filter((o) => o.value !== "*"));
    } else if (
      event.action === "remove-value" &&
      event?.removedValue?.value === "*"
    ) {
      setSelectedOptions([]);
      setValue([]);
    } else if (event.action === "remove-value") {
      setSelectedOptions(value.filter((o) => o.value !== "*"));
      setValue(value.filter((o) => o.value !== "*"));
    } else {
      setSelectedOptions(value);
      setValue(value);
    }
  }

  /**
   * If the value contains an object with a value of "*", return the placeholderButtonLabel with "All"
   * appended to it. Otherwise, return the placeholderButtonLabel with the number of selected items
   * appended to it
   * @returns a string.
   */
  function getDropdownButtonLabel({ placeholderButtonLabel, value }) {
    if (value?.some((o) => o.value === "*")) {
      return `${placeholderButtonLabel}: All`;
    } else {
      return `${placeholderButtonLabel}: ${value.length} selected`;
    }
  }
  /* Resetting the selected options when the isUpdate prop is changed. */
  useEffect(() => {
    setSelectedOptions([]);
  }, [isUpdate]);
  return (
    <Select
      name="partner"
      components={{
        Option,
      }}
      isDisabled={options?.length === 0}
      options={[{ label: "All", value: "*" }, ...options]}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      value={selectedOptions}
      allowSelectAll={true}
      className="react-select"
      classNamePrefix="select"
      placeholder={options?.length === 0 ? "No Options available" : "Select"}
      onChange={handelOnChange}
      getDropdownButtonLabel={getDropdownButtonLabel}
      isClearable={false}
    />
  );
};
export default MultiSelectAll;
