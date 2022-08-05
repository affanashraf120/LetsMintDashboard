import { yupResolver } from "@hookform/resolvers/yup";
import classname from "classnames";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  assoc,
  either,
  forEachObjIndexed,
  gte,
  ifElse,
  is,
  isEmpty,
  isNil,
  pipe,
  __,
} from "ramda";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAuth } from "../../context/AuthContext";
import routes from "../../routes";

const isNumber = is(Number);
const isString = is(String);
const toFloat = (value: any) => parseFloat(value);
const returnTrue = () => true;
const returnFalse = () => false;
const todayData = `${new Date().getFullYear()}-${new Date().getDay()}-${new Date().getDate()}`;

const schema = yup.object({
  name: yup.string().required("Project name required"),
  bio: yup.string().required("Bio required"),
  official_link: yup.string().url("Must be valid URL"),
  twitter: yup.string().matches(/^[a-zA-Z0-9_]{4,15}$/, {
    message: "Username can only contain alphanumeric characters",
    excludeEmptyString: true,
  }),
  profile_image: yup
    .mixed()
    .test("required", "Profile image required", (value) => {
      if (!value || !value.length) return false; // attachment is required
      return true;
    }),
  banner_image: yup
    .mixed()
    .test("required", "Banner image required", (value) => {
      if (!value || !value.length) return false; // attachment is required
      return true;
    }),
  whitelist_spots: yup
    .mixed()
    .test(
      "Positve number",
      "Positive number required",
      ifElse(either(isNil, isEmpty), returnFalse, pipe(toFloat, gte(__, 0)))
    ),
  mint_price: yup
    .mixed()
    .test(
      "Positive number or nil",
      "Must be positive number",
      ifElse(either(isNil, isEmpty), returnTrue, pipe(toFloat, gte(__, 0)))
    ),
});

const Page = () => {
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Project.Form>({
    defaultValues: {
      whitelist_spots: 500,
      mint_price: 0,
      twitter: "",
      profile_image: null,
      banner_image: null,
      mint_date: moment(moment().toDate()).format("YYYY-MM-DDThh:mm"),
    },
    resolver: yupResolver(schema),
  });

  console.log(todayData);

  const { user } = useAuth();
  const router = useRouter();

  const getFormData = (data: any): FormData => {
    const formData = new FormData();

    const isObject = is(Object);

    forEachObjIndexed(
      (value, key) =>
        ifElse(
          isObject,
          (v) => formData.append(key.toString(), v.item(0)),
          (v) => formData.append(key.toString(), v)
        )(value),
      data
    );

    return formData;
  };

  const submit = (data: Project.Form) => {
    fetch("/api/projects", {
      method: "POST",
      body: getFormData(assoc("uid", user.uid, data)),
    })
      .then(() => {
        alert("Project added successfully");
        router.push(routes.create_whitelist_campaign());
      })
      .catch((err) => {
        console.log(err);
        alert("Server error");
      });
  };

  return (
    <>
      <Head>
        <meta name="description" content="" />
        <meta
          name="author"
          content="Mark Otto, Jacob Thornton, and Bootstrap contributors"
        />
        <meta name="generator" content="Hugo 0.88.1" />
        <title>Let's Mint</title>
      </Head>

      <section className="setup-project-block mt70">
        <div className="container">
          <div className="setup-project-inner-block">
            <div className="card-light-grey">
              <h1>Set up your Project</h1>
              <p>
                Set up the basic information for your project to add your
                whitelist campaigns.
              </p>

              <form
                className="setup-project-from"
                onSubmit={handleSubmit(submit)}
              >
                <div className="row">
                  <div className="col-12">
                    <label htmlFor="ProjectName" className="form-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className={classname("form-control", {
                        "is-invalid": errors.name?.message,
                      })}
                      id="ProjectName"
                      placeholder="Enter Project Name"
                      {...register("name")}
                    />
                    <div className="invalid-feedback">
                      {errors.name?.message}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <label htmlFor="ProjectBio" className="form-label">
                      Project Bio
                    </label>
                    <textarea
                      className={classname("form-control", {
                        "is-invalid": errors.bio?.message,
                      })}
                      id="ProjectBio"
                      rows={3}
                      {...register("bio")}
                    ></textarea>
                    <div className="invalid-feedback">
                      {errors.bio?.message}
                    </div>
                    <span className="textarea-text">
                      (Add max characters and this description will appear in
                      the campaign pages)
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="OfficialLink" className="form-label">
                      <i className="fa-solid fa-globe"></i> Official Link
                    </label>
                    <input
                      type="text"
                      className={classname("form-control", {
                        "is-invalid": errors.official_link?.message,
                      })}
                      placeholder="Enter Official Link Site"
                      id="OfficialLink"
                      {...register("official_link")}
                    />
                    <div className="invalid-feedback">
                      {errors.official_link?.message}
                    </div>
                  </div>
                  <div className="col-md-6 twitterUsername">
                    <label htmlFor="TwitterUsername" className="form-label">
                      <i className="fa-brands fa-twitter"></i> Twitter Username
                    </label>
                    <div className="input-group">
                      <div className="input-group-text">@</div>
                      <input
                        type="text"
                        className={classname("form-control", {
                          "is-invalid": errors.twitter?.message,
                        })}
                        id="TwitterUsername"
                        placeholder="Enter Twitter Username"
                        {...register("twitter")}
                      />
                      <div className="invalid-feedback">
                        {errors.twitter?.message}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb0">
                  <div className="col-md-12">
                    <label htmlFor="Discord" className="form-label">
                      <i className="fa-brands fa-discord"></i>
                      Discord Server Name
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <input
                      type="email"
                      {...register("discord_name")}
                      placeholder="Enter Display Name"
                      className="form-control"
                      id="Discord"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      {...register("discord_url")}
                      className="form-control"
                      id="TwitterUsername"
                      placeholder="Enter Server URL"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      {...register("discord_server_id")}
                      className="form-control"
                      id="TwitterUsername"
                      placeholder="Enter Server ID"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="mint-date" className="form-label">
                      <i className="fa-brands fa-ethereum"></i>Mint Price
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter Mint Price"
                      className={classname("form-control", {
                        "is-invalid": errors.mint_price?.message,
                      })}
                      {...register("mint_price")}
                    />
                    <div className="invalid-feedback">
                      {errors.mint_price?.message}
                    </div>
                  </div>

                  <div className="col-md-6 mint-date">
                    <label htmlFor="mint-date" className="form-label">
                      <i className="fa-regular fa-calendar-days"></i> Mint Date
                      (optional)
                    </label>

                    <div className="input-group date" id="datepicker">
                      <input
                        type="date"
                        min={todayData}
                        className="form-control"
                        id="datepicker"
                        {...register("mint_date")}
                      />
                      <span className="input-group-append">
                        <span className="input-group-text d-block">
                          <i className="fa-regular fa-calendar-days"></i>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 fileUpload">
                    <label htmlFor="profile" className="form-label">
                      <i className="fa-solid fa-image-portrait"></i>Upload
                      Profile Image
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className={classname("form-control file-upload", {
                          "is-invalid": errors.profile_image?.message,
                        })}
                        {...register("profile_image")}
                        id="profile"
                      />
                      <label className="input-group-text">Upload</label>
                      <div className="invalid-feedback">
                        {errors.profile_image?.message}
                      </div>
                    </div>
                    <span className="textarea-text">
                      This will go in your Campaign pages. Recommended size: 300
                      x 300.
                    </span>
                  </div>
                  <div className="col-md-6 fileUpload">
                    <label htmlFor="banner" className="form-label">
                      <i className="fa-regular fa-image"></i> Upload Banner
                      Image
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="file"
                        className={classname("form-control file-upload", {
                          "is-invalid": errors.banner_image?.message,
                        })}
                        {...register("banner_image")}
                        id="banner"
                      />
                      <label className="input-group-text">Upload</label>
                      <div className="invalid-feedback">
                        {errors.banner_image?.message}
                      </div>
                    </div>
                    <span className="textarea-text">
                      This will go at the top of the Campaign pages. Recommended
                      size: 300 x 1400.
                    </span>
                  </div>
                </div>

                <hr />
                <div className="project-whitelist">
                  <h3>
                    <i className="fa-solid fa-user-group"></i> Project Whitelist
                  </h3>
                  <div className="project-whitelist-inner-block">
                    <div className="row">
                      <label
                        htmlFor="totalwhitelistSpots"
                        className="col-sm-8 col-form-label"
                      >
                        Total whitelist Spots
                      </label>
                      <div className="col-sm-4">
                        <input
                          type="number"
                          className={classname("form-control total-whitelist", {
                            "is-invalid": errors.whitelist_spots?.message,
                          })}
                          id="totalwhitelistSpots"
                          {...register("whitelist_spots")}
                        />
                        <div className="invalid-feedback">
                          {errors.whitelist_spots?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="project-whitelist-info">
                    Total whitelist spots are distributed throughout the entire
                    project’s campaigns.
                  </span>
                </div>
                <div className="form-footer">
                  <button className="button-primery">
                    {" "}
                    <i className="fa-regular fa-floppy-disk"></i> Save and
                    continue to Campaigns
                  </button>
                </div>
                <div className="note-block">
                  <span>Note:</span>This information can not be changed later
                  on. Please check it carefully.
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
