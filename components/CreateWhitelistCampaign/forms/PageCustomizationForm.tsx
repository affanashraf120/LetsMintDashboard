import classnames from "classnames";
import { complement, defaultTo, hasPath, ifElse, pipe, prop } from "ramda";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import slugify from "slugify";
import { useProject } from "../../../context/ProjectContext";
import { isString } from "../../../utils/common";
import TextEditor from "../TextEditor";

interface PageCustomization {
  hidden?: boolean;
  toStep: (step: number) => void;
  edit?: boolean;
}

const PageCustomizationForm = ({ hidden, toStep, edit }: PageCustomization) => {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<Campaign.Form>();

  const form = useWatch({
    control,
  });

  const { twitter, profile_image, banner_image } = useProject();

  const handleSave = () => {
    trigger(["page_customization.slug"], {
      shouldFocus: true,
    }).then((valid) => {
      if (valid) toStep(3);
    });
  };

  return (
    <div
      className={classnames("row justify-content-center", {
        "d-none": hidden,
      })}
    >
      <div className="col-md-12">
        <>
          
          {/* <!-- Page Customization --> */}
          <div className="from-group">
            <div className="from-group-label">
              <i className="fa-solid fa-paintbrush"></i> Page Customization
            </div>
            <div className="row">
              <div className="col-12">
                <label htmlFor="inputEmail4" className="form-label">
                  Slug
                </label>
                <div className="input-group">
                  <div className="input-group-text">
                    letsmint.xyz/{twitter}/
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    {...register("page_customization.slug")}
                    id="inlineFormInputGroupUsername"
                    placeholder="Roboto-X-Cool-Cats-Whitelist-Summoning-Ceremony"
                    value={slugify(form.campaign_settings?.campaign_name || "")}
                  />
                </div>
              </div>
            </div>
            <div className="row userProfilesetting">
              <div className="col-7">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("page_customization.use_project_images")}
                    id="UseTheProject"
                  />
                  <label className="form-check-label" htmlFor="UseTheProject">
                    Use the project’s profile and banner images for the campaign
                    page.
                  </label>
                </div>
                {complement(defaultTo(false))(
                  form.page_customization?.use_project_images
                ) && (
                  <div className="banner-file-upload profile-empty">
                    <div className="fileUpload">
                      <label htmlFor="profile" className="form-label">
                        <i className="fa-solid fa-image-portrait"></i>
                        {isString(form.page_customization?.images?.profile)
                          ? form.page_customization?.images?.profile
                          : "Upload Profile Image"}
                      </label>
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          {...register("page_customization.images.profile")}
                          className={classnames("form-control file-upload", {
                            "is-invalid": hasPath([
                              "page_customization",
                              "images",
                              "profile",
                            ])(errors),
                          })}
                        />
                        <label className="input-group-text">Upload</label>
                        <div className="invalid-feedback">
                          {hasPath(["page_customization", "images", "profile"])(
                            errors
                          ) &&
                            errors.page_customization?.images?.profile?.message}
                        </div>
                      </div>
                      <span className="textarea-text">
                        Recommended size: 300 x 300.
                      </span>
                    </div>
                    <div className="fileUpload">
                      <label htmlFor="banner" className="form-label">
                        <i className="fa-solid fa-image-portrait"></i>
                        {isString(form.page_customization?.images?.banner)
                          ? form.page_customization?.images?.banner
                          : "Upload Banner Image"}
                      </label>
                      <div className="input-group mb-3">
                        <input
                          type="file"
                          {...register("page_customization.images.banner")}
                          className={classnames("form-control file-upload", {
                            "is-invalid": hasPath([
                              "page_customization",
                              "images",
                              "banner",
                            ])(errors),
                          })}
                        />
                        <label className="input-group-text">Upload</label>
                        <div className="invalid-feedback">
                          {hasPath(["page_customization", "images", "banner"])(
                            errors
                          ) &&
                            errors.page_customization?.images?.banner?.message}
                        </div>
                      </div>
                      <span className="textarea-text">
                        Recommended size: 300 x 1400.
                      </span>
                    </div>
                  </div>
                )}
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    {...register("page_customization.dark_mode")}
                    id="useDarkMode"
                  />
                  <label className="form-check-label" htmlFor="useDarkMode">
                    <div className="usedarkmode-info">
                      Use Dark Mode{" "}
                      <p>This will set a dark background and white text.</p>
                    </div>
                  </label>
                </div>

                <div className="color-block">
                  <label htmlFor="exampleColorInput" className="form-label">
                    Main Color
                  </label>
                  <div className="color-value">
                    <div className="input-group">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        id="exampleColorInput"
                        {...register("page_customization.color")}
                        title="Choose your color"
                      />
                      <div className="input-group-text">
                        <i className="fa-solid fa-paintbrush"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-5">
                {complement(defaultTo(false))(
                  form.page_customization?.use_project_images
                ) ? (
                  <div className="profile-image-block profile-empty">
                    <div className="profile-image">
                      <i className="fa-solid fa-image"></i>
                    </div>
                    <div className="profile-image-icon">
                      {isString(form.page_customization?.images?.profile) ? (
                        <img src={form.page_customization?.images?.profile} />
                      ) : (
                        <i className="fa-solid fa-image"></i>
                      )}
                    </div>
                    <div className="profile-tag-block">
                      <span className="tag-big"></span>
                      <span className="tag-smal"></span>
                    </div>
                    <div
                      className="pink-box"
                      style={{
                        backgroundColor: form.page_customization?.color || "",
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="profile-image-block profile-with-img">
                    <div className="profile-image">
                      <i className="fa-solid fa-image"></i>
                    </div>
                    <div className="profile-image-icon">
                      <img src={profile_image || "/assets/images/logo.png"} />
                    </div>
                    <div className="profile-tag-block">
                      <span className="tag-big"></span>
                      <span className="tag-smal"></span>
                    </div>
                    <div
                      className="pink-box"
                      style={{
                        backgroundColor: form.page_customization?.color || "",
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="text-editor">
                  <label>Description</label>
                  <TextEditor
                    name="page_customization.description"
                    control={control}
                  />
                  {/* <div className="form-group">
                    <textarea
                      {...register("page_customization.description")}
                      id="editor"
                    ></textarea>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* <!-- Private Access --> */}
          <div className="from-group">
            <div className="from-group-label">
              <i className="fa-solid fa-lock"></i> Private Access
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("page_customization.private_access.require")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Require visitors to sign in with a password</h4>
                      <p>
                        This allows you to password protect this page. Visitors
                        will be asked to enter a password before they can see
                        the content.
                      </p>
                    </div>
                  </label>
                </div>
                {defaultTo(false)(
                  form.page_customization?.private_access?.require
                ) && (
                  <div className="form-check password">
                    <label htmlFor="formFileSm" className="form-label">
                      Password
                    </label>
                    <input
                      className={classnames("form-control form-control input", {
                        "is-invalid": hasPath([
                          "page_customization",
                          "private_access",
                          "password",
                        ])(errors),
                      })}
                      placeholder="Password"
                      {...register(
                        "page_customization.private_access.password"
                      )}
                      type="text"
                    />
                    <div className="invalid-feedback">
                      {hasPath([
                        "page_customization",
                        "private_access",
                        "password",
                      ])(errors) &&
                        errors.page_customization?.private_access?.password
                          ?.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr />
          {/* <!-- Signup Confirmation Message --> */}
          <div className="from-group">
            <div className="from-group-label">
              <i className="fa-solid fa-clipboard-check"></i> Signup
              Confirmation Message
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("page_customization.confirmation.require")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Enable a custom confirmation message</h4>
                      <p>
                        This is the message that will be displayed to the user
                        when they’ve joined the list. 120 character max.
                      </p>
                    </div>
                  </label>
                </div>
                {defaultTo(false)(
                  form.page_customization?.confirmation?.require
                ) && (
                  <div className="form-check password">
                    <label htmlFor="formFileSm" className="form-label">
                      Confirmation Message
                    </label>
                    <input
                      className={classnames(
                        "form-control form-control confirmation",
                        {
                          "is-invalid": hasPath([
                            "page_customization",
                            "confirmation",
                            "message",
                          ])(errors),
                        }
                      )}
                      placeholder="Enter your custom confirmation message."
                      {...register("page_customization.confirmation.message")}
                      type="text"
                    />
                    <div className="invalid-feedback">
                      {hasPath([
                        "page_customization",
                        "confirmation",
                        "message",
                      ])(errors) &&
                        errors.page_customization?.confirmation?.message
                          ?.message}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="twitter-box">
                  <div className="twitter-icon">
                    <i className="fa-brands fa-twitter"></i>
                  </div>
                  <div className="twitter-info">
                    <div className="form-check">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        {...register("page_customization.prompt_user.require")}
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        <div className="form-check-info">
                          <h4>Prompt the user to tweet a message</h4>
                          <p>
                            Show a tweet prompt after a user successfully
                            registers telling them to spread the word about the
                            list.
                          </p>
                        </div>
                      </label>
                    </div>
                    {defaultTo(false)(
                      form.page_customization?.prompt_user?.require
                    ) && (
                      <div className="form-check password">
                        <label htmlFor="formFileSm" className="form-label">
                          Custom Tweet Content
                        </label>
                        <input
                          className={classnames(
                            "form-control form-control confirmation",
                            {
                              "is-invalid": hasPath([
                                "page_customization",
                                "prompt_user",
                                "tweet_content",
                              ])(errors),
                            }
                          )}
                          placeholder="ie. Just registered for the Stray Cat Society Raffle!"
                          {...register(
                            "page_customization.prompt_user.tweet_content"
                          )}
                          type="text"
                        />
                        <div className="invalid-feedback">
                          {hasPath([
                            "page_customization",
                            "prompt_user",
                            "tweet_content",
                          ])(errors) &&
                            errors.page_customization?.prompt_user
                              ?.tweet_content?.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* <!-- Save and Continue  --> */}
          {!edit && (
            <div className="wizard-footer">
              <button
                onClick={handleSave}
                type="button"
                className="btn button-primery next"
              >
                Save and Continue <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default PageCustomizationForm;
