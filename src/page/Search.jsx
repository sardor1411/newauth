import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db1 } from "../firebase/firebase.jsx";
import { BsSearch } from "react-icons/bs";

// SearchByDate komponenti
const SearchByDate = ({ setSearchResults }) => {
    const [searchDate, setSearchDate] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchDate) {
            try {
                const q = query(
                    collection(db1, 'blogs'), // Kolleksiya nomi to'g'ri ekanligiga ishonch hosil qiling
                    where('firstData', '==', searchDate) // Qidiruv shartini to'g'ri kiriting
                );

                const querySnapshot = await getDocs(q);
                const searchResults = [];
                querySnapshot.forEach((doc) => {
                    searchResults.push({ ...doc.data(), id: doc.id });
                });

                setSearchResults(searchResults);
            } catch (error) {
                console.error("Qidiruvda xato:", error);
            }
        }
    };

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
const Search = () => {
    const [box, setBox] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const data = collection(db, 'blogs');
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

    return (
        <>
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
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default Search;
