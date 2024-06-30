// src/app/login/page.js
"use client";

import { loginUser } from '../../utils/action';
import { setAuthToken } from '../../utils/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useUser } from '../../context/UserContext';
import { toast, ToastContainer } from "react-toastify";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { setUser } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            if (data?.token) {
                setAuthToken(data.token);
                setUser(data.user);
                router.push('/room');
            } else {
                console.log("handleSubmit::", error);
                return toast.dark("Login fail!");
            }
        } catch (error) {
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center  vh-100">
            <section className="text-center" style={{ width: "70%" }}>
                <div className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary">
                    <div className="card-body py-5 px-md-5">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <h2 className="fw-bold mb-5">Sign In</h2>
                                <form onSubmit={handleSubmit}>

                                    <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>Sign into your account</h5>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input type="email" id="form2Example17" required onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg" />
                                        <label className="form-label" htmlFor="form2Example17">Email address</label>
                                    </div>

                                    <div data-mdb-input-init className="form-outline mb-4">
                                        <input type="password" id="form2Example27" required onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" />
                                        <label className="form-label" htmlFor="form2Example27">Password</label>
                                    </div>

                                    <div className="pt-1 mb-4">
                                        <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-dark btn-lg btn-block">Login</button>
                                    </div>

                                    <a className="small text-muted" href="#!">Forgot password?</a>
                                    <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>Don't have an account? <a href="/signup"
                                        className="text-primary">Register here</a></p>
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
