import React from "react";

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/dashboard/add-project",
      permanent: false,
    },
  };
}

const Dashboard = () => {
  return <></>;
};

export default Dashboard;
