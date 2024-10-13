import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db1, storage1 } from "../firebase/firebase";



import { BsSearch } from "react-icons/bs";
import { message, notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";


// SearchByDate komponenti
const SearchByDate = ({ setSearchResults }) => {
    const [searchDate, setSearchDate] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchDate) {
            try {
                const q = query(
                    collection(db1, 'blogs'),
                    where('firstData', '==', searchDate)
                );

                const querySnapshot = await getDocs(q);
                const searchResults = [];
                querySnapshot.forEach((doc) => {
                    searchResults.push({ ...doc.data(), id: doc.id });
                });
                notification.success({
                    message: "Ma'lumot topildi",
                    description: "Iltimos Edit qilib clear resultni bosing"
                  });

                setSearchResults(searchResults);
            } catch (error) {
                notification.error({
                    message: "Xato vaqt kiritildi"
                  });
            }
        }
        else{
            notification.error({
                message: "Xato",
                description: "Ma'lumot yo'q yoki hato qidiruv amalga oshirildi"
              });
        }
    }

    const handleClearResults = () => {
        setSearchResults([]);
        setSearchDate('');
    };

    return (
        <div className="border border-black w-[90%] m-auto h-[50px]">
            <div className="">
                <form className="flex justify-between h-[48px]" onSubmit={handleSearch}>
                    <input
                        type="date"
                        className="w-[100%]"
                        id="searchDate"
                        name="searchDate"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                    <button type="submit" className="border border-black w-[3%] h-[100%] flex justify-center items-center text-[25px]">
                        <BsSearch />
                    </button>
                    <button type="button" onClick={handleClearResults} className="ml-2 border border-black h-[100%] flex justify-center items-center text-[15px]">
                        Clear Results
                    </button>
                </form>
            </div>
        </div>
    );
};

// Search komponenti
const Bekzod = () => {
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const data = collection(db1, 'blogs');
        const unsubscribe = onSnapshot(data, (snapshot) => {
            const malumot = [];
            snapshot.docs.forEach((doc) => {
                malumot.push({ ...doc.data(), id: doc.id });
            });
            setBox(malumot);
        });

        return () => unsubscribe();
    }, []);

    const handleTextareaChange = (e, id) => {
        const newBox = box.map(item => {
            if (item.id === id) {
                return { ...item, descript: e.target.value };
            }
            return item;
        });
        setBox(newBox);
    };
    const [box, setBox] = useState([]);
    const [montaj, setMontaj] = useState('');
    const [id, setId] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [showMontaj, setShowMontaj] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const data = collection(db1, 'blogs');
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
        const deletePost = doc(db1, 'blogs', id);
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
        const updateData = doc(db1, 'blogs', id); // Use id from state

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
            <SearchByDate setSearchResults={setSearchResults} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.length > 0 ? (
                    searchResults.map((mall) => (
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
                                <div className="border rounded-[10px] shadow-inner mb-[10px]">
                                    <h2 className="text-[18px] mt-[5px] h-auto">Video Operator:</h2>
                                    <p className="text-[18px]">{mall.zafar}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.abror}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.vohid}</p>
                                    <p className="text-[18px]">{mall.otabek}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.asror}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.atham}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.elyor}</p>
                                </div>
                                <textarea
                                    value={mall.descript}
                                    onChange={(e) => handleTextareaChange(e, mall.id)}
                                    placeholder="Ma'lumotlar"
                                    className="block w-[90%] p-2 mb-4 border h-[40px] border-gray-300 rounded-md m-auto"
                                    id={`descript-${mall.id}`}
                                    name={`descript-${mall.id}`}
                                />
                                <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <span className="text-green-600 font-[600]">{mall.montaj}</span></p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript,
                                    mall.img, mall.montaj,
                                    mall.firstData, mall.bekzod, mall.siroj,
                                    mall.murod, mall.zafar, mall.abror,
                                    mall.vohid, mall.otabek, mall.asror,
                                    mall.atham, mall.elyor)}>Edit</button>
                            </div>
                        </div>
                    ))
                ) : (
                    box.map((mall) => (
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
                                <div className="border rounded-[10px] shadow-inner mb-[10px]">
                                    <h2 className="text-[18px] mt-[5px] h-auto">Video Operator:</h2>
                                    <p className="text-[18px]">{mall.zafar}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.abror}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.vohid}</p>
                                    <p className="text-[18px]">{mall.otabek}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.asror}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.atham}</p>
                                    <p className="text-[18px] mb-[5px]">{mall.elyor}</p>
                                </div>
                                <textarea
                                    value={mall.descript}
                                    onChange={(e) => handleTextareaChange(e, mall.id)}
                                    placeholder="Ma'lumotlar"
                                    className="block w-[90%] p-2 mb-4 border h-[40px] border-gray-300 rounded-md m-auto"
                                    id={`descript-${mall.id}`}
                                    name={`descript-${mall.id}`}
                                />
                                <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <span className="text-green-600 font-[600]">{mall.montaj}</span></p>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript,
                                    mall.img, mall.montaj,
                                    mall.firstData, mall.bekzod, mall.siroj,
                                    mall.murod, mall.zafar, mall.abror,
                                    mall.vohid, mall.otabek, mall.asror,
                                    mall.atham, mall.elyor)}>Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default Bekzod;
