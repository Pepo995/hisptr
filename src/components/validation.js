//imports from packages
import * as Yup from "yup";
import {
  PASSWORD_NOT_MATCH,
  PASSWORD_REQUIRE,
  PASSWORD_VALID,
  PASSWORD_REGEX,
  PASWORD_MIN,
  PASWORD_MAX,
} from "@constants/ValidationConstants";
//validations
export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required(PASSWORD_REQUIRE)
    .min(8, PASWORD_MIN)
    .max(32, PASWORD_MAX),
  // .matches(PASSWORD_REGEX, PASSWORD_VALID),
  password_confirmation: Yup.string()
    .required(PASSWORD_REQUIRE)
    .min(8, PASWORD_MIN)
    .max(32, PASWORD_MAX)
    .when("password", {
      is: (val) => val && val.length > 0,
      then: () => Yup.string().oneOf([Yup.ref("password")], PASSWORD_NOT_MATCH),
      otherwise: (schema) => schema,
    }),
});
