import { equals, gte } from "ramda";
import * as yup from "yup";

export default yup.object({
  campaign_settings: yup.object({
    campaign_name: yup.string().required("Name is required"),
    wallet_whitelist: yup.object({
      spots: yup.number().typeError("Number required").required("Required"),
    }),
    whitelist_availability: yup.string(),
    social_account: yup.object().when("whitelist_availability", {
      is: equals("specific_users"),
      then: yup.object({
        accounts: yup
          .string()
          .min(5, "Users list required")
          .required("Users list required"),
      }),
    }),
    starts_at: yup
      .date()
      .test("future date only", "Only future date", (date: any) => {
        const x = new Date(date);
        const y = new Date();
        if (
          gte(x.getDate(), y.getDate()) &&
          gte(x.getMonth(), y.getMonth()) &&
          gte(x.getFullYear(), y.getFullYear())
        )
          return true;
        return false;
      }),
    ends_at: yup
      .date()
      .test("future date only", "Only future date", (date: any) => {
        const x = new Date(date);
        const y = new Date();
        if (
          gte(x.getDate(), y.getDate()) &&
          gte(x.getMonth(), y.getMonth()) &&
          gte(x.getFullYear(), y.getFullYear())
        )
          return true;
        return false;
      })
      .typeError("Only future date"),
  }),
  page_customization: yup.object({
    images: yup.object().when("use_project_images", {
      is: false,
      then: yup.object({
        profile: yup
          .mixed()
          .test("required", "Profile image required", (value) => {
            if (!value || !value.length) return false; // attachment is required
            return true;
          }),
        banner: yup
          .mixed()
          .test("required", "Banner image required", (value) => {
            if (!value || !value.length) return false; // attachment is required
            return true;
          }),
      }),
    }),
    private_access: yup.object({
      password: yup.string().when("require", {
        is: true,
        then: yup.string().required("Password required"),
      }),
    }),
    confirmation: yup.object({
      message: yup.string().when("require", {
        is: true,
        then: yup.string().required("Confirmation message required"),
      }),
    }),
    prompt_user: yup.object({
      tweet_content: yup.string().when("require", {
        is: true,
        then: yup.string().required("Tweet content required"),
      }),
    }),
  }),
  requirements: yup.object({
    wallet: yup.object({
      eth: yup.object({
        balance: yup.mixed().when("require", {
          is: true,
          then: yup
            .number()
            .typeError("ETH balance required")
            .required("ETH balance required"),
        }),
      }),
    }),
    twitter: yup.object({
      accounts: yup.array().when("follow_others", {
        is: true,
        then: yup
          .array()
          .min(1, "Add atleast one account")
          .of(
            yup.object({
              value: yup.string().matches(/^[a-zA-Z0-9_]{4,15}$/, {
                message: "Username can only contain alphanumeric characters",
              }),
            })
          ),
      }),
    }),
    custom_field: yup.object({
      require: yup.boolean(),
      label: yup.string().when("require", {
        is: true,
        then: yup.string().required("Label required"),
      }),
    }),
  }),
});
