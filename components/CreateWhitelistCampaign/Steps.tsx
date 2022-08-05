import classnames from "classnames";
import { equals, gt } from "ramda";

interface Steps {
  step: number;
  published?: boolean;
  handleStep1: () => void;
  handleStep2: () => void;
  handleStep3: () => void;
  handleStep4: () => void;
}

const Steps = ({
  step,
  published,
  handleStep1,
  handleStep2,
  handleStep3,
  handleStep4,
}: Steps) => {
  return (
    <div className="row" id="wizardRow">
      {/* <!-- col --> */}
      <div className="col-md-12 text-center">
        {/* <!-- wizard --> */}
        <div className="wizard-form">
          {/* <!-- ul --> */}
          <ul id="progressBar" className="progressbar">
            <li
              id="progressList-1"
              role="button"
              className={classnames("progressbar-list", {
                active: equals(step, 1),
                complete: gt(step, 1),
              })}
              onClick={handleStep1}
            >
              <div className="wizard-header">
                <i className="fa-solid fa-circle-check"></i>
                <label>STEP 1</label>
                <h3>Campaign Settings</h3>
              </div>
            </li>
            <li
              id="progressList-2"
              role="button"
              className={classnames("progressbar-list", {
                active: equals(step, 2),
                complete: gt(step, 2),
              })}
              onClick={handleStep2}
            >
              <div className="wizard-header">
                <i className="fa-solid fa-circle-check"></i>
                <label>STEP 2</label>
                <h3>Page Customization</h3>
              </div>
            </li>
            <li
              id="progressList-3"
              role="button"
              className={classnames("progressbar-list", {
                active: equals(step, 3),
                complete: gt(step, 3),
              })}
              onClick={handleStep3}
            >
              <div className="wizard-header">
                <i className="fa-solid fa-circle-check"></i>
                <label>STEP 3</label>
                <h3>Requirements</h3>
              </div>
            </li>
            <li
              id="progressList-4"
              role="button"
              className={classnames("progressbar-list", {
                active: equals(step, 4),
                complete: published,
              })}
              onClick={handleStep4}
            >
              <div className="wizard-header">
                <i className="fa-solid fa-circle-check"></i>
                <label>STEP 4</label>
                <h3>Transparency</h3>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Steps;
