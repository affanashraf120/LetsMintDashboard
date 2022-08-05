import React, { useContext, useEffect, useState } from "react";
import useDidMountEffect from "../hooks/useDidMountEffect";

const ProjectContext = React.createContext<Project.Database>({
  id: "",
  uid: "",
  name: "",
  bio: "",
  twitter: "",
  discord: {
    name: "",
    url: "",
    server_id: "",
  },
  images: {
    profile: "",
    banner: "",
  },
  mint: {
    date: "",
    price: "",
  },
  creater_pass: false,
  official_link: "",
  whitelist_spots: 0,
});

export const useProject = () => useContext(ProjectContext);

interface Props {
  children: React.ReactNode;
  project: Project.Database;
}

export const ProjectProvider = (props: Props) => {
  const [project, setProject] = useState<Project.Database>(props.project);

  useDidMountEffect(() => {
    setProject(props.project);
  }, [props.project]);

  return (
    <>
      <ProjectContext.Provider value={project}>
        {props.children}
      </ProjectContext.Provider>
    </>
  );
};
