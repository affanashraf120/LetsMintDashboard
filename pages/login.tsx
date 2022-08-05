import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(user);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
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
        <title>Login</title>
      </Head>

      <section className="setup-project-block mt70">
        <div className="container">
          <div className="setup-project-inner-block">
            <form className="login" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="OfficialLink" className="form-label">
                    <i className="fa fa-envelope"></i> Email
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="Discord" className="form-label">
                    <i className="fa fa-key"></i> Password
                  </label>
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Discord Server URL"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-footer">
                <button className="button-primery">
                  {" "}
                  <i className="fa fa-sign-in"></i> Login
                </button>
              </div>
            </form>
            <br />
            <div className="row">
              <div className="col-md-6">
                <Link href="/signup" passHref>
                  <a>Create account</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
