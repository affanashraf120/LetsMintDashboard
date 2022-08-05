namespace Project {
  interface Form {
    name: string;
    bio: string;
    official_link: string;
    twitter: string | null;
    discord_name: string;
    discord_url: string;
    discord_server_id: string;
    mint_date: string;
    profile_image: FileList | null;
    banner_image: FileList | null;
    whitelist_spots: number;
    mint_price: number;
  }

  interface Database {
    id: string;
    uid: string;
    name: string;
    bio: string;
    official_link: string;
    twitter: string | null;
    creater_pass: boolean;
    discord: {
      name: string;
      url: string;
      server_id: string;
    };
    mint_date: string;
    mint_price: number;
    profile_image: string;
    banner_image: string;
    whitelist_spots: number;
  }
}
