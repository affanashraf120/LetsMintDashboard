import classnames from "classnames";
import { complement, defaultTo } from "ramda";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useProject } from "../../../context/ProjectContext";

interface Transparency {
  hidden?: boolean;
}

const TransparencyForm = ({ hidden }: Transparency) => {
  const { register, control } = useFormContext<Campaign.Form>();

  const { creater_pass } = useProject();

  return (
    <div
      className={classnames("row justify-content-center", {
        "d-none": hidden,
      })}
    >
      <div className="col-md-12" id="successForm">
        <div className="from-group ">
          <div className="row ">
            {/* <!-- Public Wallet List --> */}
            <div className="col-sm">
              <div className="from-group-label">
                <i className="fa-solid fa-wallet"></i> Public Wallet List
              </div>
              <div
                className={classnames({
                  disable: complement(defaultTo(false))(creater_pass),
                })}
              >
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    {...(creater_pass && {
                      ...register("transparency.wallet_list"),
                    })}
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Show the registered wallet list publicly
                  </label>
                </div>
                <div className="public-info">
                  <p>The public wallet list will be visible at:</p>
                  <a href="#">
                    https://letsmint.xyz/straycatsociety/campignname/wallets/
                  </a>
                </div>
              </div>
              {complement(defaultTo(false))(creater_pass) && (
                <div
                  className="alert alert-warning alert-warning-mint mb20"
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
            {/* <!-- Public Winner List --> */}
            <div className="col-sm">
              <div className="from-group-label">
                <i className="fa-solid fa-trophy"></i> Public Winner List
              </div>
              <div
                className={classnames({
                  disable: complement(defaultTo(false))(creater_pass),
                })}
              >
                <div className="form-check ">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    {...(creater_pass && {
                      ...register("transparency.winner_list"),
                    })}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    <div className="form-check-info">
                      <h4>Show the randomly chosen winner list publicly</h4>
                    </div>
                  </label>
                </div>
                <div className="public-info">
                  <p>The public winner list will be visible at:</p>
                  <a href="#">https://letsmint.xyz/test341341/winners/</a>
                </div>
              </div>
              {complement(defaultTo(false))(creater_pass) && (
                <div
                  className="alert alert-warning alert-warning-mint mb20"
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
          </div>
        </div>
        <hr />
        <div className="wizard-footer setup-btn">
          <button type="submit" className="btn button-primery">
            {" "}
            <i className="fa-regular fa-floppy-disk"></i> Publish Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransparencyForm;
