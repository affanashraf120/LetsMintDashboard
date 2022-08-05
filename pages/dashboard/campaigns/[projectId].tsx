import classNames from "classnames";
import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  complement,
  concat,
  defaultTo,
  equals,
  gt,
  head,
  length,
  pipe,
  slice,
  toUpper,
  __,
} from "ramda";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import routes from "../../../routes";
import db from "../../../utils/db";

enum Tab {
  STANDARD = "standard",
  COLLAB = "collab",
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const campaigns: Campaign.Database[] = [];
  try {
    const projectDoc = await db
      .collection("projects")
      .doc((params?.projectId as string) || "")
      .get();

    if (projectDoc.exists) {
      const campaignSnap = await db
        .collection("campaigns")
        .where("project_id", "==", defaultTo("")(params?.projectId))
        .get();
      campaignSnap.forEach((doc: any) => {
        campaigns.push({ id: doc.id, ...doc.data() });
      });

      return {
        props: {
          campaigns,
          project: { id: projectDoc.id, ...projectDoc.data() },
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: routes.not_found(),
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: routes.error(),
      },
    };
  }
};

const Page = (props: {
  campaigns: Campaign.Database[];
  project: Project.Database;
}) => {
  const { project } = props;
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(Tab.STANDARD);
  const [campaigns, setCampaigns] = useState<Campaign.Database[]>(
    props.campaigns
  );

  const [seletedCampaignId, setSelectedCampaignId] = useState<string>();

  // Modals
  const [switchModal, setSwitchModal] = useState(false);
  const [campaignModal, setCampaignModal] = useState(false);
  const [deleteCampaignModal, setDeleteCampaignModal] = useState(false);

  const toggleSwitchModal = () => {
    setSwitchModal((prev) => !prev);
  };
  const toggleCampaignModal = () => {
    setCampaignModal((prev) => !prev);
  };
  const toggleDeleteCampign = () => {
    setDeleteCampaignModal((prev) => !prev);
  };
  //
  const createCampaign = () => {
    router.push(routes.add_campaign(project.id));
  };

  const setStandardTab = () => {
    setTab(Tab.STANDARD);
  };

  const setCollabTab = () => {
    setTab(Tab.COLLAB);
  };

  const getCampaigns = async () => {
    const campaigns = await fetch(routes.api.campaignsByProjectId(project.id), {
      method: "GET",
    })
      .then((res) => res.json())
      .then((e) => e.campaigns)
      .catch((err) => {
        console.log("error", err);
        return [];
      });

    setCampaigns(campaigns);
  };

  const updateCampaignToPrimary = async (id: string) => {
    const selectedCampaign = campaigns.find((e) => e.id === id);
    const formData = new FormData();
    if (selectedCampaign) {
      formData.append("id", id);
      formData.append("projectId", selectedCampaign.project_id);
      formData.append("action", "SET_PRIMARY_CAMPAIGN");
      // server
      await fetch(routes.api.campaigns(), {
        method: "PUT",
        body: formData,
      });

      // client
      await getCampaigns();
    }
  };

  const duplicateCampaign = (campaignId: string) => {
    router.push(routes.duplicate_campaign(campaignId));
  };

  const editCampaign = (campaignId: string) => {
    router.push(routes.edit_campaign(campaignId));
  };

  const deleteCampaign = async () => {
    if (seletedCampaignId) {
      // server
      await fetch(routes.api.deleteCampaignById(seletedCampaignId), {
        method: "DELETE",
      });

      // client
      await getCampaigns();
    }
  };

  const isOpen = (start: string, end: string) => {
    if (moment(start) <= moment()) {
      if (moment(end) >= moment()) {
        return true;
      }
    }
    return false;
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

      <section className="page-header-second campaigns-header">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mint-detail-block">
                <div className="mint-logo">
                  <img alt="project-logo" src={project.profile_image || ""} />
                </div>
                <ProjectSettings
                  name={project.name}
                  mint_date={project.mint_date}
                  whitelist_spots={project.whitelist_spots}
                  handleSwitchProject={toggleSwitchModal}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}

      <SwitchModal show={switchModal} handleClose={toggleSwitchModal} />

      <CampaignModal
        show={campaignModal}
        handleClose={toggleCampaignModal}
        handleContinue={createCampaign}
        createrPass={project.creater_pass}
      />

      <DeleteCampaign
        name={
          campaigns.find((e) => equals(e.id, seletedCampaignId))
            ?.campaign_settings.campaign_name || ""
        }
        show={deleteCampaignModal}
        handleClose={toggleDeleteCampign}
        handleDelete={deleteCampaign}
      />

      <section className="campaigns-tabs">
        <div className="container">
          <nav className="table-tabs">
            <div className="nav" id="nav-tab" role="tablist">
              <button
                className={classNames({
                  active: equals(Tab.STANDARD)(tab),
                })}
                type="button"
                role="tab"
                onClick={setStandardTab}
              >
                Standard Campaigns
              </button>
              <button
                className={classNames({
                  active: equals(Tab.COLLAB)(tab),
                })}
                type="button"
                role="tab"
                onClick={setCollabTab}
              >
                Collab Campaigns
              </button>
            </div>
            <div className="tab-nav-button">
              <div className="pick-winners-button">
                <button className="btn-border-primary disabled">
                  {" "}
                  <i className="fa-solid fa-trophy"></i> Pick Winners
                </button>
              </div>
              <div className="create-campaign-button">
                <button
                  onClick={toggleCampaignModal}
                  className="button-primery"
                >
                  {" "}
                  <i className="fa-solid fa-bullhorn"></i> Create Campaign
                </button>
              </div>
            </div>
          </nav>
          <div className="tab-content">
            <div
              className={classNames("tab-pane fade", {
                "show active": equals(Tab.STANDARD)(tab),
              })}
            >
              {/* <!-- empty-campaign --> */}
              {pipe(length, equals(0))(campaigns) && (
                <div className="empty-campaign">
                  <img src="/assets/images/thumbs.png" />
                  <h2>
                    You don’t have any Campaigns in this project. Get started by
                    creating a new campaign.
                  </h2>
                </div>
              )}

              {pipe(length, gt(__, 0))(campaigns) && (
                <div className="campaigns-table mt50">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="campaign-name">Campaign Name</th>
                          <th className="campa-type">Type</th>
                          <th className="campaign-status">Status</th>
                          <th className="campaign-entries">Entries</th>
                          <th className="campaign-starts">Starts</th>
                          <th className="campaign-ends">Ends</th>
                          <th className="campaign-empty"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map(
                          ({
                            id,
                            campaign_settings: {
                              campaign_name,
                              campaign_type,
                              ends_at,
                              starts_at,
                            },
                            primary_campaign,
                          }) => (
                            <tr key={id}>
                              <td>
                                <div className="campaignname">
                                  {campaign_name}
                                </div>
                              </td>
                              <td>
                                <div className="badge bg-secondary">
                                  <i className="fa-solid fa-bullhorn"></i>{" "}
                                  {pipe(
                                    defaultTo(""),
                                    head,
                                    toUpper,
                                    concat(
                                      __,
                                      slice(1, Infinity)(campaign_type)
                                    )
                                  )(campaign_type)}
                                </div>
                              </td>
                              <td>
                                {isOpen(starts_at, ends_at) ? (
                                  <div className="status-open">
                                    <i className="fa-solid fa-circle-check"></i>
                                    Open
                                  </div>
                                ) : (
                                  <div className="status-close">
                                    <i className="fa-solid fa-circle-xmark"></i>
                                    Closed
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="campaign-number">12/40</div>
                              </td>
                              <td>
                                <div className="campaign-date-time">
                                  <span className="date">
                                    {moment(starts_at).format("MM/DD/YYYY")}
                                  </span>
                                  <span className="time">
                                    {moment(starts_at).format("LT")}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="campaign-date-time">
                                  <span className="date">
                                    {moment(ends_at).format("MM/DD/YYYY")}
                                  </span>
                                  <span className="time">
                                    {moment(ends_at).format("LT")}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="campaign-tab-action">
                                  <div className="tab-setting">
                                    <button className="setting-icon setting-button-dropdown arrow-btn">
                                      <i className="fa-regular fa-file-lines"></i>
                                    </button>
                                    <CampaignDropdown
                                      id={id}
                                      handleSetPrimary={updateCampaignToPrimary}
                                      handleEdit={editCampaign}
                                      handleDuplicate={duplicateCampaign}
                                      handleDelete={() => {
                                        setSelectedCampaignId(id);
                                        toggleDeleteCampign();
                                      }}
                                    />
                                  </div>
                                  {primary_campaign && (
                                    <div className="badge bg-secondary">
                                      <i className="fa-solid fa-star"></i>{" "}
                                      Primary
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div
              className={classNames("tab-pane fade", {
                "show active": equals(Tab.COLLAB)(tab),
              })}
            >
              {/* <!-- collab campaign --> */}
              {/* <div className="collab-campaign mt50">
                <div className="collab-campaign-item">
                  <div className="collab-campaign-info">
                    <h2>My first collab campaign</h2>
                    <div className="collab-campaign-list">
                      <ul>
                        <li>
                          <div className="mint-status">
                            <div className="mint-status-block">
                              <span className="label">2 Collabs </span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="mint-status">
                            <i className="fa-solid fa-user-group"></i>
                            <div className="mint-status-block">
                              <span className="label">150 Spots</span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="mint-status">
                            <i className="fa-solid fa-calendar-days"></i>
                            <div className="mint-status-block">
                              <span className="label">
                                Starts: 4/10/2022 4:30 PM
                              </span>
                              <span className="label">
                                End: 4/10/2022 4:30 PM
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="collab-campaign-link">
                    <a href="#">View Campaign Collabs </a>
                  </div>
                </div>
                <div className="collab-campaign-item">
                  <div className="collab-campaign-info">
                    <h2>My first collab campaign</h2>
                    <div className="collab-campaign-list">
                      <ul>
                        <li>
                          <div className="mint-status">
                            <div className="mint-status-block">
                              <span className="label">2 Collabs </span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="mint-status">
                            <i className="fa-solid fa-user-group"></i>
                            <div className="mint-status-block">
                              <span className="label">150 Spots</span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="mint-status">
                            <i className="fa-solid fa-calendar-days"></i>
                            <div className="mint-status-block">
                              <span className="label">
                                Starts: 4/10/2022 4:30 PM
                              </span>
                              <span className="label">
                                End: 4/10/2022 4:30 PM
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="collab-campaign-link">
                    <a href="#">View Campaign Collabs </a>
                  </div>
                </div>
              </div> */}

              {/* <!-- empty campaign --> */}
              <div className="empty-campaign mt50">
                <img src="/assets/images/hand.png" />
                <h2>
                  You don’t have any Collab Campaigns in this project. Get
                  started with Collabs by creating a new campaign.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ProjectSettings = ({
  name,
  mint_date,
  whitelist_spots,
  handleSwitchProject,
}: any) => {
  const [show, setShow] = useState(false);

  const ref = useRef(null);

  const toggle = () => {
    setShow((prev) => !prev);
  };

  const handleClickInside = () => {
    setShow(true);
  };

  const handleClickOutside = () => {
    setShow(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div className="mint-detail">
      <h1>
        {name}
        <div
          className={classNames("setting-dropdown-block", {
            active: show,
          })}
        >
          <div ref={ref}>
            <button
              className="setting-icon showSingle setting-button-dropdown arrow-btn"
              type="button"
              onClick={handleClickInside}
            >
              <i className="fa-solid fa-gear"></i>
            </button>
            <ul
              className={classNames("setting-dropdown", {
                "d-none": complement(defaultTo(false))(show),
              })}
            >
              <li>
                <a className="edit" role="button">
                  <i className="fa-solid fa-plus"></i> Add New Project
                </a>
              </li>
              <li>
                <a
                  onClick={handleSwitchProject}
                  className="duplicate"
                  role="button"
                >
                  <i className="fa-solid fa-arrow-right-arrow-left"></i> Switch
                  Project
                </a>
              </li>
              <li>
                <a role="button">
                  <i className="fa-regular fa-pen-to-square"></i>
                  Edit
                </a>
              </li>
            </ul>
          </div>
        </div>
      </h1>

      <div className="mint-status">
        <i className="fa-solid fa-calendar-days"></i>
        <div className="mint-status-block">
          <span className="label">Planned Mint Date:</span>
          <span className="value">
            {moment(mint_date).format("MM/DD/YYYY")}
            <span className="subValue">{moment(mint_date).format("LT")}</span>
          </span>
        </div>
      </div>
      <div className="mint-status">
        <i className="fa-solid fa-user-group"></i>
        <div className="mint-status-block">
          <span className="label">Whitelist Spots:</span>
          <span className="value">{whitelist_spots}/500</span>
        </div>
      </div>
    </div>
  );
};

const CampaignDropdown = ({
  id,
  handleSetPrimary,
  handleEdit,
  handleDuplicate,
  handleDelete,
}: any) => {
  return (
    <div className="setting-dropdown-block">
      <Dropdown>
        <Dropdown.Toggle>
          <i className="fa-solid fa-gear"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu className="setting-dropdown">
          <Dropdown.Item onClick={() => handleSetPrimary(id)}>
            <i className="fa-regular fa-star"></i> Set as Primary
          </Dropdown.Item>
          <Dropdown.Item className="edit" onClick={() => handleEdit(id)}>
            <i className="fa-regular fa-pen-to-square"></i> Edit
          </Dropdown.Item>
          <Dropdown.Item
            className="duplicate"
            onClick={() => handleDuplicate(id)}
          >
            <i className="fa-regular fa-copy"></i>
            Duplicate
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDelete} className="delete">
            <i className="fa-solid fa-trash-can"></i>
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

const SwitchModal = ({ show, handleClose }: any) => {
  return (
    <Modal className="switchModal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Switch Project</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="switch-project-list">
          <div className="project-info">
            <div className="project-img">
              <img alt="logo" src="/assets/images/cate.png" />
            </div>
            <div className="project-details">
              <h2>Stray Cat Society</h2>
              <div className="mint-status">
                <i className="fa-solid fa-user-group"></i>
                <div className="mint-status-block">
                  <span className="label">Whitelist Spots:</span>
                  <span className="value">0/500</span>
                </div>
              </div>
              <a className="selected" href="#">
                Currently Selected
              </a>
            </div>
          </div>
          <div className="project-info">
            <div className="project-img">
              <img alt="logo" src="/assets/images/logo.png" />
            </div>
            <div className="project-details">
              <h2>Robotos NFT</h2>
              <div className="mint-status">
                <i className="fa-solid fa-user-group"></i>
                <div className="mint-status-block">
                  <span className="label">Whitelist Spots:</span>
                  <span className="value">0/500</span>
                </div>
              </div>
              <a href="#">Select Project</a>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const CampaignModal = ({
  show,
  handleClose,
  handleContinue,
  createrPass,
}: any) => {
  const [option, setOption] = useState<"standard" | "collab">("standard");
  return (
    <Modal show={show} onHide={handleClose} className="selectcampaignModal">
      <Modal.Header>
        <Modal.Title as="h5">Select your Campaign</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="selectcampaign-info">
          <fieldset className="campaign-type-option">
            <label
              className={classNames("campaign-option", {
                active: equals(option, "standard"),
              })}
              htmlFor="standard"
            >
              <div className="form-check-radio">
                <input
                  className="from-check-radio"
                  type="radio"
                  name="campaignType"
                  id="standard"
                  value="standard"
                  defaultChecked
                  onClick={(e: any) => {
                    (e.target?.checked as boolean) && setOption("standard");
                  }}
                />
                <div className="campaign-type-option-inner">
                  <div className="icon">icon</div>
                  <div className="campaign-type-option-detail">
                    <h3>Standard</h3>
                    <p>
                      Make a whitelist for your community or the general public
                      according to your needs.
                    </p>
                  </div>
                </div>
              </div>
            </label>
            <label
              className={classNames("campaign-option", {
                "premium-locked": !createrPass,
                active: equals(option, "collab"),
              })}
              htmlFor="collab"
            >
              <div className="form-check-radio">
                <input
                  className="from-check-radio"
                  type="radio"
                  disabled={!createrPass}
                  name="campaignType"
                  id="collab"
                  value="collab"
                  onClick={(e: any) => {
                    (e.target?.checked as boolean) && setOption("collab");
                  }}
                />
                <div className="campaign-type-option-inner">
                  <div className="icon">icon</div>
                  <div className="campaign-type-option-detail">
                    <h3>Collab</h3>
                    <p>
                      Partner with other communities and make a whitelist for
                      their holders or followers.
                    </p>
                  </div>
                </div>
              </div>
              {!createrPass && (
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
      </Modal.Body>

      <Modal.Footer>
        <button
          onClick={() => {
            handleContinue();
            handleClose();
          }}
          type="button"
          className="button-primery"
        >
          Continue <i className="fa-solid fa-arrow-right"></i>
        </button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteCampaign = ({ name, show, handleClose, handleDelete }: any) => {
  return (
    <Modal show={show} onHide={handleClose} className="projectdeleteModal">
      <Modal.Body>
        <div className="delete-modal-info">
          <h2>Delete Campaign</h2>
          <h3>
            Are you sure you want to delete the campaign <span>‘{name}’</span>?
          </h3>
          <p>
            <span>Note: </span>This will delete the campaign and all of its
            entries. This process can’t be undone.
          </p>
          <div className="delete-modal-footer mt30">
            <button className="cancel btn-border-primary" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="delete btn-border-primary"
              onClick={() => {
                handleDelete();
                handleClose();
              }}
            >
              <i className="fa-solid fa-trash-can"></i> Delete Campaign
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Page;
