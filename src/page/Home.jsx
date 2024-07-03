import { getDatabase } from "firebase/database";
import { QuerySnapshot, addDoc, collection, deleteDoc, getDocs, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";

const database = getDatabase();

function Home() {
    const [box, setBox] = useState([]);

    let data = collection(db, 'blogs');

    useEffect(() => {
        onSnapshot(
            data, (snapshot) => {
                let malumot = []
                snapshot.docs.forEach((doc) => {
                    malumot.push({ ...doc.data(), id: doc.id })
                });
                setBox(malumot)
            }
        )
    }, []);




    return (
        <>
            <h1 className="text-center mt-10 mb-10 text-3xl font-bold">
                All Datas
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {box.map((mall) => {
                    return (
                        <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
                            <div className="box p-4">
                                <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt="" />
                                <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
                                <h3 className="mt-6 text-2xl text-green-600 font-semibold">Ism: {mall.title}</h3>
                                <p className="mt-6 mb-4 text-[22px] text-red-500 ">To'y xaqida ma'lumot:</p>
                                <div className="border rounded-[10px] shadow-inner">
                                    <h2 className="text-[18px]">Montajchilar ro'yxati:</h2>
                                    <p className="text-[18px]">{mall.bekzod}</p>
                                    <p className="text-[18px]">{mall.siroj}</p>
                                </div><br />    
                                <textarea
                                    value={mall.descript}
                                    placeholder="Ma'lumotlar"
                                    className="block w-[90%] p-2 mb-4 border h-[40px] border-gray-300 rounded-md m-auto"
                                />
                                <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <span className="text-green-600 font-[600]">{mall.montaj}</span></p>
                            </div>
                        </div>
                    )
                })}
            </div>


        </>
    )
}

export default Home;
