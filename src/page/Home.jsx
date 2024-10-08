import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db1 } from "../firebase/firebase.jsx";
import { BsSearch } from "react-icons/bs";

// SearchByDate component
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

                setSearchResults(searchResults);
            } catch (error) {
                console.error("Search error:", error);
            }
        }
    };

    const handleClearResults = () => {
        setSearchResults([]);
        setSearchDate('');
    };

    return (
        <div className="border border-black w-[90%] m-auto h-[50px]">
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
    );
};

// Home component
const Home = () => {
    const [box, setBox] = useState([]);
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

    const toggleList = (id) => {
        const list = document.getElementById(id);
        list.classList.toggle('max-h-48');
        list.classList.toggle('expanded');
        const button = document.getElementById(`button-${id}`);
        button.classList.toggle('transform');
        button.classList.toggle('rotate-180');
    };

    return (
        <>
            <SearchByDate setSearchResults={setSearchResults} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-[50px]">
                {searchResults.length > 0 ? (
                    searchResults.map((mall) => (
                        <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
                            <div className="box p-4">
                                <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt="" />
                                <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
                                <h3 className="mt-6 text-2xl text-green-600 font-semibold">Ism: {mall.title}</h3>
                                <p className="mt-6 mb-4 text-[22px] text-red-500">To'y xaqida ma'lumot:</p>

                                {/* Montajchilar list */}
                                {mall.bekzod || mall.siroj ? (
                                    <div className="border rounded-[10px] shadow-inner">
                                        <h2 className="text-[18px]">Montajchilar ro'yxati:</h2>
                                        <ul id={`montaj-list-${mall.id}`} className="list-none p-0 m-0 max-h-12 overflow-hidden transition-max-height duration-500 ease-in-out">
                                            {mall.bekzod && <li className="text-[18px]">{mall.bekzod}</li>}
                                            {mall.siroj && <li className="text-[18px]">{mall.siroj}</li>}
                                        </ul>
                                        <button id={`button-montaj-list-${mall.id}`} className="toggle-arrow bg-none border-none text-blue-600 cursor-pointer text-xl mt-2 transition-transform" onClick={() => toggleList(`montaj-list-${mall.id}`)}>
                                            &#9660;
                                        </button>
                                    </div>
                                ) : null}
                                <br />

                                {/* Video Operator list */}
                                {(mall.zafar || mall.abror || mall.vohid || mall.otabek || mall.asror || mall.atham || mall.elyor) ? (
                                    <div className="border rounded-[10px] shadow-inner mb-[10px]">
                                        <h2 className="text-[18px] mt-[5px] h-auto">Video Operator:</h2>
                                        <ul id={`video-operator-list-${mall.id}`} className="list-none p-0 m-0 max-h-12 overflow-hidden transition-max-height duration-500 ease-in-out">
                                            {mall.zafar && <li className="text-[18px]">{mall.zafar}</li>}
                                            {mall.abror && <li className="text-[18px]">{mall.abror}</li>}
                                            {mall.vohid && <li className="text-[18px]">{mall.vohid}</li>}
                                            {mall.otabek && <li className="text-[18px]">{mall.otabek}</li>}
                                            {mall.asror && <li className="text-[18px]">{mall.asror}</li>}
                                            {mall.atham && <li className="text-[18px]">{mall.atham}</li>}
                                            {mall.elyor && <li className="text-[18px]">{mall.elyor}</li>}
                                        </ul>
                                        <button id={`button-video-operator-list-${mall.id}`} className="toggle-arrow bg-none border-none text-blue-600 cursor-pointer text-xl mt-2 transition-transform" onClick={() => toggleList(`video-operator-list-${mall.id}`)}>
                                            &#9660;
                                        </button>
                                    </div>
                                ) : null}
                                <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <span className="text-green-600 font-[600]">{mall.montaj}</span></p>
                            </div>
                        </div>
                    ))
                ) : (
                    box.map((mall) => (
                        <div className="flex justify-center items-center border h-[400px] " key={mall.id}>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 text-center transition-transform transform hover:-translate-y-1">
                                <img src={mall.img} alt="Image" className="w-full h-44 object-cover" />
                                <div className="p-5">
                                    <p className="text-gray-500 text-sm">{mall.firstData}</p>
                                    <h2 className="my-2 text-2xl font-bold text-gray-800">{mall.title}</h2>
                                    <div className="text-left">
      
                        
                                    </div>
                                    <p className="text-gray-700 text-sm">Montaj bajarilganmi : <span className="text-green-500 font-bold">{mall.montaj}</span></p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Home;