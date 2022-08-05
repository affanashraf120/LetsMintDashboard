import moment from "moment";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  assoc,
  assocPath,
  both,
  complement,
  defaultTo,
  dissoc,
  dissocPath,
  equals,
  gt,
  has,
  hasPath,
  identity,
  ifElse,
  isNil,
  join,
  pipe,
  prop,
  split,
} from "ramda";
import React from "react";
import { FormProvider } from "react-hook-form";
import {
  CampaignSettingsForm,
  PageCustomizationForm,
  RequirementsForm,
  Steps,
  TransparencyForm,
} from "../../../../components/CreateWhitelistCampaign";
import { ProjectProvider } from "../../../../context/ProjectContext";
import useCampaignForm from "../../../../hooks/useCampaignForm";
import routes from "../../../../routes";
import {
  isObject,
  isString,
  returnFalse,
  returnNull,
  returnTrue,
} from "../../../../utils/common";
import db from "../../../../utils/db";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const campaignRef = await db
      .collection("campaigns")
      .doc(params?.campaignId as string)
      .get();

    if (campaignRef.exists) {
      const campaign: any = { id: campaignRef.id, ...campaignRef.data() };

      const projectDoc = await db
        .collection("projects")
        .doc(campaign.project_id)
        .get();

      if (projectDoc.exists) {
        return {
          props: {
            campaign: campaign,
            project: { id: projectDoc.id, ...projectDoc.data() },
          },
        };
      }
    }

    return {
      redirect: {
        permanent: false,
        destination: routes.not_found(),
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: routes.error(),
      },
    };
  }
};

const EditCampaign = (props: {
  campaign: Campaign.Database;
  project: Project.Database;
}) => {
  const { campaign, project } = props;
  const { primary_campaign, project_id, id, ...defaultValues } = campaign;
  const router = useRouter();

  const {
    step,
    toStep,
    methods,
    changed,
    form,
    getFormData,
    discardChanges,
    handleBack,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
  } = useCampaignForm({
    ...defaultValues,
    campaign_settings: {
      ...defaultValues.campaign_settings,
      ...(both(
        hasPath(["campaign_settings", "social_account", "accounts"]),
        hasPath(["campaign_settings", "social_account", "accounts"])
      )(defaultValues) && {
        social_account: {
          provider:
            defaultValues.campaign_settings.social_account?.provider ||
            "twitter",
          accounts: join(
            "\n",
            defaultValues.campaign_settings.social_account?.accounts as string[]
          ),
        },
      }),
      starts_at: moment(defaultValues.campaign_settings.starts_at).format(
        "YYYY-MM-DDThh:mm"
      ),
      ends_at: moment(defaultValues.campaign_settings.ends_at).format(
        "YYYY-MM-DDThh:mm"
      ),
    },
  });

  const handlePublish = (data: Campaign.Form) => {
    let newData: Campaign.Form = data;

    let images = pipe(ifElse(has("images"), prop("images"), returnNull))(
      data.page_customization
    ) as { banner?: any; profile?: any } | null;

    // remove file
    if (images && both(has("profile"), has("banner"))(images)) {
      if (
        pipe(ifElse(pipe(prop("profile"), isString), returnFalse, returnTrue))(
          images
        )
      ) {
        newData = dissocPath(["page_customization", "images", "profile"])(
          data
        ) as Campaign.Form;
      } else {
        images = dissoc("profile")(images);
      }

      if (
        pipe(ifElse(pipe(prop("banner"), isString), returnFalse, returnTrue))(
          images as { banner: any; profile?: any }
        )
      ) {
        newData = dissocPath(["page_customization", "images", "banner"])(
          data
        ) as Campaign.Form;
      } else {
        images = dissoc("banner")(images);
      }
    }

    const formData = getFormData(
      pipe(
        assoc("project_id", project.id),
        assoc("primary_campaign", primary_campaign),
        ifElse(
          hasPath(["campaign_settings", "social_account", "accounts"]),
          assocPath(
            ["campaign_settings", "social_account", "accounts"],
            split(
              "\n",
              defaultTo("")(
                data?.campaign_settings?.social_account?.accounts as string
              )
            )
          ),
          identity
        )
      )(newData),
      images
    );

    formData.append("action", "EDIT_CAMPAIGN");
    formData.append("id", id);

    fetch(routes.api.campaigns(), {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          alert("Campaign edited successfully");
          router.push(routes.campaigns(project.id));
        } else alert(res.statusText || "Server error");
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

      <section className="page-header-third create-campaing-edit-whitelist">
        <div className="container">
          <div className="page-header-inner-third">
            {gt(step, 1) && (
              <a
                className="arrow-btn left-arrow"
                onClick={handleBack}
                type="button"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </a>
            )}
            <div className="mint-details">
              <div className="mint-logo">
                <img
                  alt="logo"
                  src={campaign.page_customization.images?.profile}
                />
              </div>
              <div className="mint-name">
                <h1>{campaign.campaign_settings.campaign_name}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectProvider project={project}>
        {/* STEPS */}
        <section className="create-campaing-edit-whitelist">
          <div className="container">
            <div className="card-light-grey">
              <div className="edit-header">
                <h1>Edit Project</h1>

                {changed && (
                  <div className="alert alert-warning" role="alert">
                    {" "}
                    You have unsaved changes{" "}
                  </div>
                )}
              </div>
              <div className="campaign-step-wizard">
                <Steps
                  step={step}
                  handleStep1={handleStep1}
                  handleStep2={handleStep2}
                  handleStep3={handleStep3}
                  handleStep4={handleStep4}
                />

                <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(handlePublish)}>
                    <CampaignSettingsForm
                      hidden={complement(equals(1))(step)}
                      toStep={toStep}
                      edit
                    />

                    <PageCustomizationForm
                      hidden={complement(equals(2))(step)}
                      toStep={toStep}
                      edit
                    />

                    <RequirementsForm
                      hidden={complement(equals(3))(step)}
                      toStep={toStep}
                      edit
                    />

                    <TransparencyForm hidden={complement(equals(4))(step)} />
                  </form>
                </FormProvider>
              </div>
            </div>
          </div>
        </section>
      </ProjectProvider>

      {changed && (
        <section className="edit-action">
          <div className="edit-action-btn-block">
            <button onClick={discardChanges} className="btn btn-border">
              Discard Changes
            </button>
            <button
              onClick={() => handlePublish(form as Campaign.Form)}
              className="btn btn-white"
            >
              {" "}
              <i className="fa-regular fa-floppy-disk"></i> Save Changes
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default EditCampaign;
