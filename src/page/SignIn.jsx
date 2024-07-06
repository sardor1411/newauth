import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from "../firebase";
import { json, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, QuerySnapshot, where } from "firebase/firestore";
import { notification } from "antd";

const SignIn = () => {
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: "",
    })
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const users = await signInWithEmailAndPassword(
                auth,
                userLogin.email,
                userLogin.password
            )
            try {
                const q = query(
                    collection(db, 'user'),
                    where('uid', '==', users?.user?.uid),
                );
                const data = onSnapshot(q, (QuerySnapshot) => {
                    let user;
                    QuerySnapshot.forEach((doc) => (user = doc.data()));
                    localStorage.setItem('users', JSON.stringify(user));

                    setUserLogin({
                        email: '',
                        password: '',
                    });
                    if(user?.role === 'user'){
                        navigate('/userpage');
                        notification.success({
                            message: 'Xush kelibsiz foydalanuvchi',
                        });
                    } else {
                        navigate('/dashboard');
                        notification.success({
                            message: 'Xush kelibsiz Admin',
                        });
                    }
                });
                return () => data;
            }
            catch (error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <form onSubmit={onSubmit} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col m-auto w-full mt-10 md:mt-0">
                        <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign In</h2>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                            <input
                                value={userLogin.email}
                                onChange={(e) => {
                                    setUserLogin({
                                        ...userLogin,
                                        email: e.target.value,
                                    })
                                }} type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="password" className="leading-7 text-sm text-gray-600">Password</label>
                            <input value={userLogin.password}
                                onChange={(e) => {
                                    setUserLogin({
                                        ...userLogin,
                                        password: e.target.value,
                                    })
                                }} type="password" id="password" name="password" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default SignIn;
