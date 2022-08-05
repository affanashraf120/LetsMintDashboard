import { concat, ifElse, isNil, pipe } from "ramda";

const routes = {
  // auth
  login: () => "/login",
  signup: () => "/signup",
  // dashboard
  dashboard: () => "/dashboard",
  // project
  add_project: () => "/dashboard/add-project",
  set_up_your_project: "/dashboard/set-up-your-project",
  // campaign
  campaigns: (projectId: string) => concat("/dashboard/campaigns/")(projectId),
  add_campaign: (projectId: string) =>
    concat("/dashboard/campaigns/add/")(projectId),
  edit_campaign: (campaignId: string) =>
    concat("/dashboard/campaigns/edit/")(campaignId),
  duplicate_campaign: (campaignId: string) =>
    concat("/dashboard/campaigns/duplicate/")(campaignId),
  // others
  not_found: () => "/404",
  error: () => "/error",
  //api
  api: {
    campaigns: () => "/api/campaigns",
    campaignsByProjectId: (id: string) =>
      concat("/api/campaigns?projectId=")(id),
    deleteCampaignById: (id: string) => concat("/api/campaigns?id=")(id),
  },
};

export default routes;
