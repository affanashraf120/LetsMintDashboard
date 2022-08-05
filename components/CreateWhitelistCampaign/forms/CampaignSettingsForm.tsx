import classnames from "classnames";
import {
  complement,
  defaultTo,
  equals,
  hasPath,
  length,
  match,
  pipe,
} from "ramda";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useProject } from "../../../context/ProjectContext";

interface CampaignSettings {
  hidden?: boolean;
  toStep: (step: number) => void;
  edit?: boolean;
}

const CampaignSettingsForm = ({ hidden, toStep, edit }: CampaignSettings) => {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<Campaign.Form>();

  const handleSave = () => {
    trigger(["campaign_settings"], {
      shouldFocus: true,
    }).then((valid) => {
      if (valid) toStep(2);
    });
  };

  const form = useWatch({
    control,
  });
  const { creater_pass } = useProject();

  const isSpecificUsers = equals("specific_users");

  const totalUsers = pipe(
    defaultTo(""),
    pipe(match(/@/g), length)
  )(form.campaign_settings?.social_account?.accounts);

  return (
    <div
      className={classnames("row", {
        "d-none": hidden,
      })}
    >
      {/* <!-- Campaign Name --- --> */}
      <div className="col-md-12">
        <>
          <div className="from-group">
            <div className="from-group-label">
              <i className="fa-solid fa-pencil"></i> Campaign Name{" "}
            </div>
            <div className="row">
              <div className="col-7">
                <label htmlFor="inputEmail4" className="form-label">
                  Campaign Name
                </label>
                <input
                  type="text"
                  {...register("campaign_settings.campaign_name")}
                  placeholder="Enter a name for your Whitelist Campaign"
                  className={classnames("form-control", {
                    "is-invalid": hasPath([
                      "campaign_settings",
                      "campaign_name",
                    ])(errors),
                  })}
                  id="inputEmail4"
                />
                <div className="invalid-feedback">
                  {hasPath(["campaign_settings", "campaign_name"])(errors) &&
                    errors.campaign_settings?.campaign_name?.message}
                </div>
              </div>
              <div className="col-5">
                <div className="notes d-flex">
                  <strong>Note:</strong> Campaign name will be visible in the
                  signup page.
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="from-group">
            <fieldset>
              {/* <!-- Whitelist Availability --> */}
              <div className="row">
                <div className="col-7">
                  <div className="from-group-label">
                    <i className="fa-solid fa-user-plus"></i> Whitelist
                    Availability
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      {...register("campaign_settings.whitelist_availability")}
                      id="generalPublic"
                      value="general_public"
                    />
                    <label className="form-check-label" htmlFor="generalPublic">
                      Open to the general public
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      {...register("campaign_settings.whitelist_availability")}
                      id="specificUsers"
                      value="specific_users"
                    />
                    <label className="form-check-label" htmlFor="specificUsers">
                      Specific Users
                    </label>
                  </div>

                  {pipe(
                    defaultTo(""),
                    isSpecificUsers
                  )(form.campaign_settings?.whitelist_availability) && (
                    <div className="wehitelistDesc wehite3 socialmedia">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          {...register(
                            "campaign_settings.social_account.provider"
                          )}
                          id="twitter"
                          value="twitter"
                        />
                        <label className="form-check-label" htmlFor="twitter">
                          Twitter
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          {...register(
                            "campaign_settings.social_account.provider"
                          )}
                          id="discord"
                          value="discord"
                        />
                        <label className="form-check-label" htmlFor="discord">
                          Discord
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {pipe(
                  defaultTo(""),
                  isSpecificUsers
                )(form.campaign_settings?.whitelist_availability) && (
                  <div className="col-5">
                    <div className="users-list-block wehitelistDesc wehite3">
                      <label
                        htmlFor="inputEmail4"
                        className="form-label d-flex justify-content-between"
                      >
                        Users List:
                        <span>Total : {totalUsers}</span>
                      </label>
                      <textarea
                        placeholder={`@User1
@userName
@Example_user314
@usertesting`}
                        className={classnames("form-control", {
                          "is-invalid": hasPath([
                            "campaign_settings",
                            "social_account",
                            "accounts",
                          ])(errors),
                        })}
                        {...register(
                          "campaign_settings.social_account.accounts"
                        )}
                        id="exampleFormControlTextarea1"
                        rows={6}
                      ></textarea>
                      <div className="invalid-feedback">
                        {hasPath([
                          "campaign_settings",
                          "social_account",
                          "accounts",
                        ])(errors) &&
                          errors.campaign_settings?.social_account?.accounts
                            ?.message}
                      </div>
                      <p className="form-sort-info">
                        Line separated users (don’t include commas)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </fieldset>
          </div>
          <hr />
          <div className="from-group">
            <fieldset>
              {/* <!--  Campaign Type --> */}
              <div className="row">
                <div className="col-7">
                  <div className="from-group-label">
                    <i className="fa-solid fa-bullhorn"></i> Campaign Type{" "}
                  </div>
                  <fieldset className="campaign-type">
                    <label
                      className={classnames("form-check", {
                        active: equals("guaranteed")(
                          defaultTo("")(form.campaign_settings?.campaign_type)
                        ),
                      })}
                      htmlFor="raffle"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        {...register("campaign_settings.campaign_type")}
                        id="raffle"
                        value="guaranteed"
                      />
                      <div className="form-check-label">
                        <div className="form-check-icon">
                          <img
                            alt="Guaranteed"
                            src="/assets/images/guaranteed.svg"
                          />
                        </div>
                        <div className="form-check-info">
                          <h3>Guaranteed</h3>
                          <p>
                            The first users who register will earn whitelist
                            spots.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={classnames("form-check", {
                        disable: complement(defaultTo(false))(creater_pass),
                        active: equals("raffle")(
                          defaultTo("")(form.campaign_settings?.campaign_type)
                        ),
                      })}
                      htmlFor="rally"
                    >
                      <div className="form-check-radio">
                        <input
                          className="form-check-input"
                          type="radio"
                          disabled={complement(defaultTo(false))(creater_pass)}
                          {...register("campaign_settings.campaign_type")}
                          id="rally"
                          value="raffle"
                        />
                        <div className="form-check-label">
                          <div className="form-check-icon">
                            <img alt="Raffle" src="/assets/images/raffle.svg" />
                          </div>
                          <div className="form-check-info">
                            <h3>Raffle</h3>
                            <p>
                              Users will participate for a chance to get
                              whitelist spots.
                            </p>
                          </div>
                        </div>
                      </div>
                      {complement(defaultTo(false))(creater_pass) && (
                        <div
                          className="alert alert-warning alert-warning-mint mt20"
                          role="alert"
                        >
                          <div className="alert-warning-info">
                            <img src="/assets/images/warning-mint.png" />
                            <h3>Requires Let’sMint Creator Pass</h3>
                          </div>
                          <a href="#">LEARN MORE</a>
                        </div>
                      )}
                    </label>
                  </fieldset>
                </div>
                <div className="col-5">
                  <div className="from-group-label">
                    <i className="fa-solid fa-user-group"></i> Wallet Whitelist
                  </div>
                  <div className="project-whitelist-inner-block">
                    {pipe(
                      defaultTo(""),
                      equals("raffle")
                    )(form.campaign_settings?.campaign_type) && (
                      <div id="option1" className="desc">
                        <div className="mints-count-block ">
                          <label
                            htmlFor="totalwhitelistSpots"
                            className="col-form-label"
                          >
                            Allowed entries
                          </label>
                          <div className="mint-count">
                            <input
                              type="number"
                              {...register(
                                "campaign_settings.wallet_whitelist.entries"
                              )}
                              className="form-control total-whitelist"
                              id="totalwhitelistSpots"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mints-count-block">
                      <label
                        htmlFor="totalwhitelistSpots"
                        className="col-form-label"
                      >
                        Whitelist spots
                      </label>
                      <div className="mint-count">
                        <input
                          type="text"
                          className={classnames(
                            "form-control total-whitelist",
                            {
                              "is-invalid": hasPath([
                                "campaign_settings",
                                "wallet_whitelist",
                                "spots",
                              ])(errors),
                            }
                          )}
                          {...register(
                            "campaign_settings.wallet_whitelist.spots"
                          )}
                          id="totalwhitelistSpots"
                        />
                        <div className="invalid-feedback">
                          {hasPath([
                            "campaign_settings",
                            "wallet_whitelist",
                            "spots",
                          ])(errors) &&
                            errors.campaign_settings?.wallet_whitelist?.spots
                              ?.message}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="available-info">
                      <i className="fa-solid fa-circle-info"></i> Available
                      spots in project: 400/1000
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- starts and end detes --> */}
              <div className="row date-info">
                <div className="col-7">
                  <div className="row">
                    <div className="col-md-6 mint-date">
                      <label htmlFor="mint-date" className="form-label">
                        Starts
                      </label>
                      <div className="input-group date">
                        <input
                          type="datetime-local"
                          {...register("campaign_settings.starts_at")}
                          id="datetimepicker"
                          className={classnames("form-control", {
                            "is-invalid": hasPath([
                              "campaign_settings",
                              "starts_at",
                            ])(errors),
                          })}
                        />
                        <span className="input-group-append">
                          <span className="input-group-text d-block">
                            <i className="fa-regular fa-calendar-days"></i>
                          </span>
                        </span>
                        <div className="invalid-feedback">
                          {hasPath(["campaign_settings", "starts_at"])(
                            errors
                          ) && errors.campaign_settings?.starts_at?.message}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mint-date">
                      <label htmlFor="mint-date" className="form-label">
                        Ends
                      </label>
                      <div className="input-group date">
                        <input
                          type="datetime-local"
                          {...register("campaign_settings.ends_at")}
                          id="datetimepicker2"
                          className={classnames("form-control", {
                            "is-invalid": hasPath([
                              "campaign_settings",
                              "ends_at",
                            ])(errors),
                          })}
                        />
                        <span className="input-group-append">
                          <span className="input-group-text d-block">
                            <i className="fa-regular fa-calendar-days"></i>
                          </span>
                        </span>
                        <div className="invalid-feedback">
                          {hasPath(["campaign_settings", "ends_at"])(errors) &&
                            errors.campaign_settings?.ends_at?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  <div className="notes">
                    <strong>Note:</strong> This campaign will close sooner if
                    the allowed entries are filled before the selected end date.
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <hr />
          {/* <!-- Save and  Continue  --> */}
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

export default CampaignSettingsForm;
