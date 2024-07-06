import { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

const SignUp = () => {

    const [userSignup, setUserSignUp] = useState({
        name: "",
        email: "",
        password: "",
        role: 'user',
    })

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const users = await createUserWithEmailAndPassword(
                auth,
                userSignup.email,
                userSignup.password
            )
            console.log(users);
            const user = {
                name: userSignup.name,
                email: users.user.email,
                uid: users.user.uid,
                role: userSignup.role,
                date: new Date().toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
            }

            const userData = collection(db, 'user')
            addDoc(userData, user);

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <form onSubmit={onSubmit} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col m-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input onChange={(e) => {
                                setUserSignUp({
                                    ...userSignup,
                                    email: e.target.value,
                                })
                            }}
                                value={userSignup.email}
                                type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="full-name" className="leading-7 text-sm text-gray-600">Password</label>
                            <input onChange={(e) => {
                                setUserSignUp({
                                    ...userSignup,
                                    password: e.target.value,
                                })
                            }}
                                value={userSignup.password}
                                type="password" id="full-name" name="full-name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
                        <Link to='/signin' className="text-xs text-gray-500 mt-3">SIGN IN</Link>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default SignUp;