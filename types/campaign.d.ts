namespace Campaign {
  interface Form {
    campaign_settings: {
      campaign_name: string;
      whitelist_availability: "specific_users" | "general_public";
      social_account?: {
        // only for specific_users
        provider: "discord" | "twitter";
        accounts: any;
      };
      campaign_type: "guaranteed" | "raffle";
      wallet_whitelist: {
        entries: number;
        spots: number;
      };
      starts_at: string;
      ends_at: string;
    };
    require_discord_verification: boolean;
    require_user_disord_member: boolean;
    require_server_role: boolean;
    //

    page_customization: {
      slug: string;
      use_project_images: boolean;
      dark_mode: boolean;
      images?: {
        profile: any;
        banner: any;
      };
      color: string;
      description: string;
      private_access: {
        require: boolean;
        password?: string;
      };
      confirmation: {
        require: boolean;
        message?: string;
      };
      prompt_user: {
        require: boolean;
        tweet_content?: string;
      };
    };

    requirements: {
      wallet: {
        eth: {
          require: boolean;
          balance?: number;
        };
        require_specific_collection: boolean;
        collections?: any[];
      };
      twitter: {
        follow_you: boolean;
        follow_others: boolean;
        accounts?: any;
      };
      custom_field: {
        require: boolean;
        label?: string;
      };
      recaptcha: boolean;
    };

    transparency?: {
      wallet_list: boolean;
      winner_list: boolean;
    };

    [custom: string]: any;
  }

  interface Database extends Form {
    id: string;
    primary_campaign: boolean;
    project_id: string;
  }

  interface SpecificCollection {
    nft: {
      contract_address: string;
      collection: {
        name: string;
        link: string;
      };
    };
    use_discord: boolean;
    discord: {
      name: string;
      role_id: string;
    };
  }
}
