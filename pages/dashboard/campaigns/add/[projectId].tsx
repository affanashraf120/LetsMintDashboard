import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  assoc,
  assocPath,
  complement,
  defaultTo,
  dissocPath,
  equals,
  gt,
  hasPath,
  identity,
  ifElse,
  pipe,
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
import db from "../../../../utils/db";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const projectDoc = await db
      .collection("projects")
      .doc(params?.projectId as string)
      .get();

    if (projectDoc.exists) {
      return {
        props: {
          project: { id: projectDoc.id, ...projectDoc.data() },
        },
      };
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

const Page = (props: { project: Project.Database }) => {
  const { project } = props;
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
  } = useCampaignForm();

  const handlePublish = (data: Campaign.Form) => {
    console.log(data);
    fetch("/api/campaigns", {
      method: "POST",
      body: getFormData(
        pipe(
          ifElse(
            hasPath(["page_customization", "images"]),
            dissocPath(["page_customization", "images"]),
            identity
          ),
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
        )(data),
        data.page_customization.images
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

export default Page;
