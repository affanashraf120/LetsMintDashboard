import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {

  // // get projects
  // useEffect(() => {
  //   const getData = async () => {
  //     const projects = await fetch("/api/projects", {
  //       method: "GET",
  //     })
  //       .then((res) => res.json())
  //       .then((e) => e.projects)
  //       .catch((err) => {
  //         console.log(err);
  //         return [];
  //       });

  //     return projects;
  //   };

  //   getData().then((data) => {
  //     console.log("projects", data);
  //   });
  // }, []);

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

      <section className="add-project-block">
        <div className="container">
          <h1>Add Projects</h1>
          <p>Create your project to get started.</p>
          <div className="addProject">
            <Link href="/dashboard/set-up-your-project">
              <a className="card">
                <div className="add-project-inner-block">
                  <i className="fa-solid fa-plus"></i>
                  <h2>Add Projects</h2>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
