import { useState, useEffect } from "react";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { collection, addDoc, deleteDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from "../firebase";

function Bekzod() {
    const [box, setBox] = useState([]);
    const [montaj, setMontaj] = useState('');
    const [id, setId] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showMontaj, setShowMontaj] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const data = collection(db, 'blogs');
    const storage = getStorage();

    useEffect(() => {
        const unsubscribe = onSnapshot(data, (snapshot) => {
            const malumot = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setBox(malumot);
        });

        return () => unsubscribe();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setShowForm(false);
        if (title === "" || des === "" || img === null || montaj === "" || firstData === "") {
            return notification.error({
                message: "Input bo'sh",
                description: "Malumot to'liq kiritilmagan"
            });
        }

        try {
            const imgRef = ref(storage, `images/${img.name}-${uuid()}`);
            const uploadTask = uploadBytesResumable(imgRef, img);

            uploadTask.on('state_changed',
                (snapshot) => { },
                (error) => {
                    notification.error({
                        message: "Rasm yuklanmadi",
                        description: error.message
                    });
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await addDoc(data, {
                            montaj,
                            // Add other fields as needed
                        });
                        notification.success({
                            message: "Ma'lumot kiritildi",
                            description: "Sizning barcha ma'lumotlaringiz kiritildi"
                        });
                        setShowForm(false);
                        resetForm();
                    });
                }
            );
        } catch (error) {
            console.error("Error uploading image:", error);
            notification.error({
                message: "Rasm yuklanmadi",
                description: error.message
            });
        }
    };

    const handleDelete = async (id) => {
        const deletePost = doc(db, 'blogs', id);
        await deleteDoc(deletePost);
        console.log(`Deleted post with id: ${id}`);
    };

    const handleEdit = (id, title, descript, img, montaj, firstData, bekzod, siroj, murod, zafar, abror, vohid, otabek, asror, atham, elyor) => {
        setId(id); // Set id in state for use in handleUpdate
        setMontaj(montaj);
        // ... set other fields as needed
        setIsUpdate(true);
        setShowForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updateData = doc(db, 'blogs', id); // Use id from state

        try {
            await updateDoc(updateData, {
                montaj,
                // Add other fields as needed
            });

            notification.success({
                message: "Ma'lumot yangilandi",
                description: "Ma'lumotlar muvaffaqiyatli yangilandi"
            });

            setShowForm(false);
            setIsUpdate(false);
            resetForm();
        } catch (error) {
            console.error("Error updating document:", error);
            notification.error({
                message: "Ma'lumot yangilashda xatolik",
                description: error.message
            });
        }
    };

    const resetForm = () => {
        setMontaj("");
        // Reset other form fields if needed
    };


    return (
        <>
            <div className="">

                {/* Create Data */}
                {showForm && (
                    <div className=" overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-[-40px] left-0 right-0 backdrop-blur-[100px]">
                        <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]">
                            <IoIosCloseCircleOutline />
                        </button>
                        <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
                            <div >
                                <div className="w-[40%] border flex justify-between ">





                                    <div className="">
                                        <h1 className="text-black text-[20px] mb-[10px]">Montaj qilinganmi?</h1>
                                        <div className="flex mb-[15px]">
                                            <label htmlFor="ha" className="flex text-black">
                                                Bajarildi
                                                <input
                                                    type="radio"
                                                    id="ha"
                                                    name="montaj"
                                                    value="Bajarildi"
                                                    checked={montaj === 'Bajarildi'}
                                                    onChange={(e) => setMontaj(e.target.value)}
                                                    className="ml-2"
                                                />
                                            </label>
                                            <label htmlFor="yo'q" className="ml-5 flex text-black">
                                                Bajartilmadi
                                                <input
                                                    type="radio"
                                                    id="yo'q"
                                                    name="montaj"
                                                    value="Bajartilmadi"
                                                    checked={montaj === 'Bajartilmadi'}
                                                    onChange={(e) => setMontaj(e.target.value)}
                                                    className="ml-2"
                                                />
                                            </label>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                {isUpdate ? 'Update' : "Yaratish"}
                            </button>
                        </form>
                    </div>
                )}
                {showMontaj && (
                    <div className="overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-0 left-0 right-0 backdrop-blur-[100px]">
                        <button onClick={() => setShowMontaj(false)} className="text-[30px] absolute top-[20px] left-[95%]">
                            <IoIosCloseCircleOutline />
                        </button>
                        <h2 className="text-2xl mb-4 font-[700]">Montaj uchun ma'lumotlar</h2>
                        <form onSubmit={handleMontaj}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Bekzod"
                                    className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                                    value={bekzod}
                                    onChange={(e) => setBekzod(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Siroj"
                                    className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                                    value={siroj}
                                    onChange={(e) => setSiroj(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Yaratish
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Ekranga chiqarish */}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-[50px]">
                {box.map((mall) => (
                    <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
                        <div className="box p-4">
                            <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt={mall.title} />
                            <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
                            <p className="mt-6 text-[21px] text-green-600 font-semibold">To'yxona haqida: {mall.title}</p>
                            <div className="border rounded-[10px] shadow-inner">
                                <h2 className="text-[18px] mt-[5px] h-auto">Montajchilar ro'yxati:</h2>
                                <p className="text-[18px]">{mall.bekzod}</p>
                                <p className="text-[18px] mb-[5px]">{mall.siroj}</p>
                                <p className="text-[18px] mb-[5px]">{mall.murod}</p>
                            </div>
                            <div className="border rounded-[10px] shadow-inner mt-[10px]">
                                <h2 className="text-[18px] mt-[5px] h-auto">Video Operator:</h2>
                                <p className="text-[18px]">{mall.zafar}</p>
                                <p className="text-[18px] mb-[5px]">{mall.abror}</p>
                                <p className="text-[18px] mb-[5px]">{mall.vohid}</p>
                                <p className="text-[18px]">{mall.otabek}</p>
                                <p className="text-[18px] mb-[5px]">{mall.asror}</p>
                                <p className="text-[18px] mb-[5px]">{mall.atham}</p>
                                <p className="text-[18px] mb-[5px]">{mall.elyor}</p>
                            </div>

                            <p className="mt-6 mb-4 text-[22px] text-red-500">To'y xaqida ma'lumot:</p>
                            <textarea
                                value={mall.descript}
                                placeholder="Ma'lumotlar"
                                className="block w-[90%] p-2 mb-4 border h-[40px] border-gray-300 rounded-md m-auto"
                                readOnly
                            />
                            <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <span className="text-green-600 font-[600]">{mall.montaj}</span></p>
                            <div className="flex justify-evenly">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript,
                                    mall.img, mall.montaj,
                                    mall.firstData, mall.bekzod, mall.siroj,
                                    mall.murod, mall.zafar, mall.abror,
                                    mall.vohid, mall.otabek, mall.asror,
                                    mall.atham, mall.elyor)}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}

export default Bekzod