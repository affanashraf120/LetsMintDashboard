import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import { dec, equals, forEachObjIndexed, gt } from "ramda";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import campaignSchema from "../schemas/campaignSchema";

const useCampaignForm = (defaultValues?: Campaign.Form) => {
  const [step, setStep] = useState<number>(1);
  const [changed, setChanged] = useState<boolean>(false);

  const methods = useForm<Campaign.Form>({
    resolver: yupResolver(campaignSchema),
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: defaultValues
      ? defaultValues
      : {
          page_customization: {
            use_project_images: true,
            color: "#FD51A2",
            private_access: {
              require: false,
            },
            confirmation: {
              require: false,
            },
            prompt_user: {
              require: false,
            },
          },
          requirements: {
            wallet: {
              eth: {
                require: false,
              },
            },
          },
          campaign_settings: {
            wallet_whitelist: {
              entries: 500,
              spots: 500,
            },
            campaign_type: "guaranteed",
            whitelist_availability: "general_public",
            social_account: {
              provider: "twitter",
            },
            starts_at: moment(moment().toDate())
              .add(1, "days")
              .format("YYYY-MM-DDThh:mm"),
            ends_at: moment(moment().toDate())
              .add(2, "days")
              .format("YYYY-MM-DDThh:mm"),
          },
        },
  });

  const {
    trigger,
    control,
    formState: { isDirty },
    reset,
    setFocus,
  } = methods;
  const form = useWatch({
    control,
  });

  useEffect(() => {
    setChanged(isDirty);
  }, [form]);

  useEffect(() => {
    if (equals(1)(step)) {
      setFocus("campaign_settings.campaign_name");
    } else if (equals(2)(step)) {
      setFocus("page_customization.slug");
    }
  }, [step]);

  const getFormData = (data: any, files?: any): FormData => {
    const formData = new FormData();

    formData.append("campaign", JSON.stringify(data));

    if (files) {
      forEachObjIndexed(
        (value, key) => formData.append(key.toString(), value.item(0)),
        files
      );
    }

    return formData;
  };

  const discardChanges = () => {
    reset();
  };

  const toStep = (num: number) => {
    setStep(num);
  };

  const handleBack = () => {
    gt(step, 1) && setStep((prev) => dec(prev));
  };

  const validateCampaignSettings = async (): Promise<boolean> => {
    try {
      const valid: boolean = await trigger(["campaign_settings"], {
        shouldFocus: true,
      });
      return valid;
    } catch (error) {
      return false;
    }
  };

  const validatePageCustomization = async (): Promise<boolean> => {
    try {
      const valid: boolean = await trigger(["page_customization"], {
        shouldFocus: true,
      });
      return valid;
    } catch (error) {
      return false;
    }
  };

  const validateRequirements = async (): Promise<boolean> => {
    try {
      const valid: boolean = await trigger(["requirements"], {
        shouldFocus: true,
      });
      return valid;
    } catch (error) {
      return false;
    }
  };

  const handleStep1 = () => {
    toStep(1);
  };

  const handleStep2 = async () => {
    if (await validateCampaignSettings()) {
      toStep(2);
    }
  };

  const handleStep3 = async () => {
    if (await validateCampaignSettings()) {
      if (await validatePageCustomization()) {
        toStep(3);
      }
    }
  };

  const handleStep4 = async () => {
    if (await validateCampaignSettings()) {
      if (await validatePageCustomization()) {
        if (await validateRequirements()) toStep(4);
      }
    }
  };

  return {
    step,
    methods,
    changed,
    toStep,
    form,
    discardChanges,
    getFormData,
    handleBack,
    handleStep1,
    handleStep2,
    handleStep3,
    handleStep4,
  };
};

export default useCampaignForm;
