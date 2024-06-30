// src/app/login/page.js
"use client";

import { useState } from 'react';
import { registerUser } from '../../utils/action';
import { setAuthToken } from '../../utils/auth';
import { useRouter } from 'next/navigation'

const Login = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await registerUser(username, email, password);
        console.log("handleSubmit::", username, password, token);
        setAuthToken(token)
        router.push("/room");

    };

    return (
        <div className="container d-flex justify-content-center align-items-center  vh-100">
            <section className="text-center" style={{ width: "70%" }}>
                <div className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary">
                    <div className="card-body py-5 px-md-5">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <h2 className="fw-bold mb-5">Register User</h2>
                                <form onSubmit={handleSubmit}>
                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input required onChange={(e) => { setUsername(e.target.value) }} type="text" id="form2Example17" className="form-control form-control-lg" />
                                        <label className="form-label" htmlFor="form2Example17"> Full Name</label>
                                    </div>
                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input required onChange={(e) => { setEmail(e.target.value) }} type="email" id="form2Example17" className="form-control form-control-lg" />
                                        <label className="form-label" htmlFor="form2Example17">Email address</label>
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input required onChange={(e) => { setPassword(e.target.value) }} type="password" id="form2Example27" className="form-control form-control-lg" />
                                        <label className="form-label" htmlFor="form2Example27">Password</label>
                                    </div>

                                    <div className="pt-1 mb-4">
                                        <button data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block" type="button">Sign Up</button>
                                    </div>

                                    <a className="small text-muted" href="#!">Forgot password?</a>
                                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>already have a account? <a href="/signin"
                                        className="text-primary">Login</a></p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
