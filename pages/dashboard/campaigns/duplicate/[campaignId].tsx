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

const DuplicateCampaign = (props: {
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
    getFormData,
    handleBack,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
  } = useCampaignForm({
    ...defaultValues,
    campaign_settings: {
      ...defaultValues.campaign_settings,
      campaign_name: "",
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
    page_customization: {
      ...defaultValues.page_customization,
      slug: "",
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

    fetch(routes.api.campaigns(), {
      method: "POST",
      body: getFormData(
        pipe(
          assoc("project_id", project.id),
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
      ),
    })
      .then((res) => {
        if (res.ok) {
          alert("Campaign added successfully");
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

      <section className="create-whitelist-campaign">
        <div className="container">
          <div className="card-light-grey">
            <div className="card-title campaign-title">
              <h1 className="position-relative">
                {gt(step, 1) && (
                  <a
                    className="arrow-btn left-arrow"
                    onClick={handleBack}
                    type="button"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </a>
                )}
                Create your Whitelist Campaign
              </h1>
            </div>

            <ProjectProvider project={project}>
              {/* STEPS */}
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
                    />

                    <PageCustomizationForm
                      hidden={complement(equals(2))(step)}
                      toStep={toStep}
                    />

                    <RequirementsForm
                      hidden={complement(equals(3))(step)}
                      toStep={toStep}
                    />

                    <TransparencyForm hidden={complement(equals(4))(step)} />
                  </form>
                </FormProvider>
              </div>
            </ProjectProvider>
          </div>
        </div>
      </section>
    </>
  );
};

export default DuplicateCampaign;
