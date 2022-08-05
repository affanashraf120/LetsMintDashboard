import classnames from "classnames";
import { complement, defaultTo, hasPath, ifElse, isNil } from "ramda";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useProject } from "../../../context/ProjectContext";
import { isArray, returnFalse } from "../../../utils/common";
import NFTCollection from "../NFTCollection";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import ScrollToTop from "react-scroll-to-top";

interface Requirements {
  hidden?: boolean;
  toStep: (step: number) => void;
  edit?: boolean;
}

const AddServerModal = ({ show, handleClose }: any) => (
  <Modal show={show} onHide={handleClose}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <div className="modal-header ">
            <h1 className="modal-title">
              Discord Roles <span>Stray Cat Society</span>
            </h1>
            <div className="modal-close" data-bs-dismiss="modal">
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div className="add-new-server-role-box">
            <div className="add-new-server-role">
              <h2>Add a new Server Role</h2>
              <div className="add-new-server-role-card">
                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="formFileSm" className="form-label">
                      Role Display name
                    </label>
                    <input
                      className="form-control input"
                      placeholder="The Stray Cat Original Gang"
                      type="text"
                    />
                  </div>
                </div>

                <div className="col-sm">
                  <div className="form-group">
                    <label htmlFor="formFileSm" className="form-label">
                      Role ID
                    </label>
                    <input
                      className="form-control input"
                      placeholder="8139371938"
                      type="text"
                    />
                  </div>
                </div>

                <div className="action">
                  <button className="button-primery">
                    <i className="fa-solid fa-plus"></i> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="add-existing-server-roles">
              <h2>Or select one from your existing Server Roles</h2>
              <div className="add-existing-server-list">
                <div className="add-existing-server-items">
                  <div className="add-existing-server-info">
                    <span>OG Holder</span>
                    <span>ID: 18370186</span>
                  </div>
                  <div className="add-existing-server-action">
                    <a className="edit" href="#">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a className="delete" href="#">
                      <i className="fa-solid fa-trash-can"></i>
                    </a>
                  </div>
                </div>
                <div className="add-existing-server-items">
                  <div className="add-existing-server-info">
                    <span>OG Holder</span>
                    <span>ID: 18370186</span>
                  </div>
                  <div className="add-existing-server-action">
                    <a className="edit" href="#">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a className="delete" href="#">
                      <i className="fa-solid fa-trash-can"></i>
                    </a>
                  </div>
                </div>
                <div className="add-existing-server-items">
                  <div className="add-existing-server-info">
                    <span>OG Holder</span>
                    <span>ID: 18370186</span>
                  </div>
                  <div className="add-existing-server-action">
                    <a className="edit" href="#">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a className="delete" href="#">
                      <i className="fa-solid fa-trash-can"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
);

const RequirementsForm = ({ hidden, toStep, edit }: Requirements) => {
  const {
    register,
    formState: { errors },
    control,
    trigger,
  } = useFormContext<Campaign.Form>();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const twitter_accounts = useFieldArray({
    control,
    name: "requirements.twitter.accounts",
  } as never);

  const form = useWatch({ control });

  const { creater_pass, discord, twitter } = useProject();

  const isFieldError = (index: number, arr: any[]) =>
    ifElse(
      isNil,
      returnFalse,
      ifElse(
        isArray,
        (arr) =>
          ifElse(isNil, returnFalse, hasPath(["value", "message"]))(arr[index]),
        returnFalse
      )
    )(arr);

  const handleSave = () => {
    trigger(["requirements"], {
      shouldFocus: true,
    }).then((valid) => {
      if (valid) toStep(4);
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
          {/* <!-- Wallet Requirements --> */}
          <div className="from-group">
            <div className="from-group-label pb35">
              <i className="fa-solid fa-wallet"></i> Wallet Requirements
              {complement(defaultTo(false))(creater_pass) && (
                <div
                  className="alert alert-warning alert-warning-mint "
                  role="alert"
                >
                  <div className="alert-warning-info">
                    <img src="/assets/images/warning-mint.png" />
                    <h3>Requires Let’sMint Creator Pass</h3>
                  </div>
                  <a href="#">LEARN MORE</a>
                </div>
              )}
            </div>

            <div
              className={classnames("row", {
                disable: complement(defaultTo(false))(creater_pass),
              })}
            >
              <div className="col-12">
                <div className="row g-3 mb2">
                  <div className="col-auto  d-flex align-items-center ">
                    <div className="form-check">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        disabled={complement(defaultTo(false))(creater_pass)}
                        {...register("requirements.wallet.eth.require")}
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        <span>Require ETH Balance</span>
                      </label>
                    </div>
                  </div>
                  {defaultTo(false)(
                    form.requirements?.wallet?.eth?.require
                  ) && (
                    <div className="col-auto">
                      <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">
                          <i className="fa-brands fa-ethereum"></i>
                        </span>
                        <input
                          type="number"
                          step="any"
                          style={{
                            minWidth: "100px",
                          }}
                          {...register("requirements.wallet.eth.balance")}
                          className={classnames("form-control eth-balance", {
                            "is-invalid": hasPath([
                              "requirements",
                              "wallet",
                              "eth",
                              "balance",
                            ])(errors),
                          })}
                          placeholder=""
                        />
                        <div className="invalid-feedback">
                          {hasPath([
                            "requirements",
                            "wallet",
                            "eth",
                            "balance",
                          ])(errors) &&
                            errors.requirements?.wallet?.eth?.balance?.message}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <AddServerModal show={show} handleClose={handleClose} />

                <div className="form-check">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    disabled={complement(defaultTo(false))(creater_pass)}
                    {...register(
                      "requirements.wallet.require_specific_collection"
                    )}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>
                        Require user to own an NFT from specific collections
                      </h4>
                      <p>
                        You can enter multiple collections, and the user will
                        need to own an NFT from any of them.
                      </p>
                    </div>
                  </label>
                </div>

                {defaultTo(false)(
                  form.requirements?.wallet?.require_specific_collection
                ) && <NFTCollection />}
              </div>
            </div>
          </div>
          <hr />
          {/* <!-- Discord Requirements --> */}
          <div className="from-group ">
            <div className="from-group-label discord-color pb35">
              <i className="fa-brands fa-discord"></i> Discord Requirements
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-check mb3">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("require_discord_verification")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Require Discord Verification</h4>
                      <p>
                        Require users to verify themselves on Discord before
                        joining your list.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="form-check ">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("require_user_disord_member")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>
                        Require user to be a member of your Discord Server
                      </h4>
                      <p>
                        Require users to be members of your Discord Server. You
                        can also specify a Discord Role.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="server-block">
                  <div className="server-inner-block">
                    <div className="server-inner-item">
                      <label htmlFor="formFileSm" className="form-label">
                        Server ID :{" "}
                      </label>
                      <span>{discord.server_id}</span>
                    </div>
                    <div className="server-inner-item">
                      <label htmlFor="formFileSm" className="form-label">
                        Server Display Name :{" "}
                      </label>
                      <span>{discord.name}</span>
                    </div>
                    <div className="server-inner-item">
                      <label htmlFor="formFileSm" className="form-label">
                        {discord.name} :{" "}
                      </label>
                      <span className="link">{discord.url}</span>
                    </div>
                  </div>

                  <div className="form-check mb3">
                    <input
                      className="form-check-input "
                      type="checkbox"
                      {...register("require_server_role")}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      <div className="form-check-info">
                        <h4>Require Server Role</h4>
                        <p>
                          Require user to have a specific role on that server.
                          You can add multiple roles.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="server-role">
                    <div className="server-role-ownership">
                      <div className="server-role-lable">Stray Dog Holder</div>
                      <div className="server-role-value">ID: 2745967</div>
                    </div>
                    <div className="server-role-required">
                      Required for verifying ownership of ‘Stray Dog Society’.
                    </div>
                  </div>

                  <div
                    id="server_sample_data"
                    style={{
                      display: "none",
                    }}
                  >
                    <div className="row-data">
                      <div className="require-server-role-block" id="">
                        <div className="require-server-role-item">
                          <div className="lable">OG</div>
                          <div className="id">ID: 18370186</div>
                        </div>

                        <div className="deletRecord">
                          <a className="delete-server-record " data-id="0">
                            <i className="fa-solid fa-trash-can"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="server-data_posts">
                    <div id="server-data_body">
                      <div
                        className="require-server-role-block row-data"
                        id="rec-1"
                      >
                        <div className="require-server-role-item">
                          <div className="lable">OG</div>
                          <div className="id">ID: 18370186</div>
                        </div>
                        <div className="deletRecord">
                          <a className="delete-server-record" data-id="1">
                            <i className="fa-solid fa-trash-can"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="add-collection-button">
                    <button
                      className="button-primery add-server-record"
                      onClick={handleShow}
                    >
                      <i className="fa-solid fa-plus"></i>
                      Add Server Role{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />

          {/* <!-- Twitter Requirements --> */}
          <div className="from-group ">
            <div className="from-group-label twitter-color pb35">
              <i className="fa-brands fa-twitter"></i> Twitter Requirements
            </div>
            <div className="row">
              <div className="col-12">
                <div className="form-check mb3">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("requirements.twitter.follow_you")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Require users to follow @{twitter}</h4>
                      <p>
                        Require someone to verify themselves on Twitter and
                        follow you before joining your list.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="form-check ">
                  <input
                    className={classnames("form-check-input", {
                      "is-invalid": hasPath([
                        "requirements",
                        "twitter",
                        "accounts",
                      ])(errors),
                    })}
                    type="checkbox"
                    {...register("requirements.twitter.follow_others")}
                    id="flexCheckDefault"
                  />
                  <div className="invalid-feedback">
                    {hasPath(["requirements", "twitter", "accounts"])(errors) &&
                      errors.requirements?.twitter?.accounts?.message}
                  </div>
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Require user to follow another account</h4>
                      <p>
                        Require that a user follows a certain account before
                        registering.
                      </p>
                    </div>
                  </label>
                </div>
                {defaultTo(false)(
                  form.requirements?.twitter?.follow_others
                ) && (
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="must-follow">
                        <label htmlFor="specificSizeInputName">
                          Must Follow
                        </label>
                        <div className="must-follow-input-group">
                          {twitter_accounts.fields.map((field, index) => (
                            <div key={field.id}>
                              <div className="must-follow-input">
                                <div
                                  className={classnames("input-group", {
                                    "is-invalid": isFieldError(
                                      index,
                                      errors.requirements?.twitter?.accounts
                                    ),
                                  })}
                                >
                                  <div className="input-group-text">@</div>
                                  <input
                                    type="text"
                                    key={field.id}
                                    className="form-control"
                                    {...register(
                                      `requirements.twitter.accounts.${index}.value`
                                    )}
                                    id="gordonRamzEth"
                                    placeholder="GordonRamzEth"
                                  />
                                </div>
                                <div
                                  onClick={() => {
                                    twitter_accounts.remove(index);
                                  }}
                                  className="deletRecord"
                                >
                                  <a role="button">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </a>
                                </div>
                                <div className="invalid-feedback">
                                  {isFieldError(
                                    index,
                                    errors.requirements?.twitter?.accounts
                                  ) &&
                                    errors.requirements?.twitter?.accounts[
                                      index
                                    ].value.message}
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="add-collection-button">
                            <button
                              className="button-primery"
                              data-added="0"
                              onClick={() => {
                                twitter_accounts.append({
                                  value: "",
                                });
                              }}
                            >
                              <i className="fa-solid fa-plus"></i>
                              Add Account{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr />

          {/* <!-- Custom Field --> */}
          <div className="from-group ">
            <div className="from-group-label pb35">
              <i className="fa-solid fa-pen-to-square"></i> Custom Field
            </div>
            <div className="row ">
              <div className="col-12 mb2">
                <div className="form-check ">
                  <input
                    className={classnames("form-check-input", {
                      "is-invalid": hasPath([
                        "requirements",
                        "custom_field",
                        "label",
                      ])(errors),
                    })}
                    type="checkbox"
                    {...register("requirements.custom_field.require")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Require that the user fills an additional input
                  </label>
                </div>
              </div>
            </div>
            {defaultTo(false)(form.requirements?.custom_field?.require) && (
              <div className="form-check">
                <label htmlFor="formFileSm" className="form-label">
                  Set the label for your custom field
                </label>
                <input
                  className={classnames("form-control form-control input", {
                    "is-invalid": hasPath([
                      "requirements",
                      "custom_field",
                      "label",
                    ])(errors),
                  })}
                  placeholder="ie. Where did you learn about the whitelist?"
                  type="text"
                  {...register("requirements.custom_field.label")}
                />
                <div className="invalid-feedback">
                  {hasPath(["requirements", "custom_field", "label"])(errors) &&
                    errors.requirements?.custom_field?.label?.message}
                </div>
              </div>
            )}
          </div>
          <hr />
          {/* <!-- reCAPTCHA Checkbox --> */}
          <div className="from-group ">
            <div className="from-group-label green-icon pb35">
              <i className="fa-solid fa-user-check"></i> reCAPTCHA Checkbox
            </div>
            <div className="row ">
              <div className="col-12 mb2">
                <div className="form-check ">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...register("requirements.recaptcha")}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Require reCAPTCHA at the end of the form</h4>
                      <p>
                        Force the user to check an “I’m not a robot”{" "}
                        <a href="#">reCAPTCHA checkbox.</a>
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <hr />
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

export default RequirementsForm;
