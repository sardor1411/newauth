
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db1 } from "../firebase/firebase.jsx";
import { BsSearch } from "react-icons/bs";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { IoClose } from "react-icons/io5";



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
    <div className="w-[90%] m-auto h-[50px]">
      <form className="flex justify-between h-[48px] gap-2" onSubmit={handleSearch}>
        <input
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="searchDate"
          name="searchDate"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button type="submit" className="w-[50px] h-[100%] flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white rounded-md transition duration-300">
          <BsSearch />
        </button>
        <button type="button" onClick={handleClearResults} className="w-[50px] h-[100%] flex justify-center items-center bg-red-500 hover:bg-red-700 text-white rounded-md transition duration-300">
          <IoClose />
        </button>
      </form>
    </div>
  );
};

// Search komponenti
const Dashboard = () => {
  const [box, setBox] = useState([]);
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [id, setId] = useState('');
  const [montaj, setMontaj] = useState('');
  const [firstData, setFirstData] = useState('');
  const [bekzod, setBekzod] = useState('');
  const [siroj, setSiroj] = useState('');
  const [murod, setMurod] = useState('');

  const [zafar, setZafar] = useState('');
  const [abror, setAbror] = useState('');
  const [vohid, setVohid] = useState('');
  const [otabek, setOtabek] = useState('');
  const [asror, setAsror] = useState('');
  const [atham, setAtham] = useState('');
  const [elyor, setElyor] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showMontaj, setShowMontaj] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [bekzodChecked, setBekzodChecked] = useState(false);
  const [sirojChecked, setSirojChecked] = useState(false);
  const [murodChecked, setMurodChecked] = useState(false);
  const [zafarChecked, setZafarChecked] = useState(false);
  const [abrorChecked, setAbrorChecked] = useState(false);
  const [vohidChecked, setVohidChecked] = useState(false);
  const [otabekChecked, setOtabekChecked] = useState(false);
  const [asrorChecked, setAsrorChecked] = useState(false);
  const [athamChecked, setAthamChecked] = useState(false);
  const [elyorChecked, setElyorChecked] = useState(false);

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
    setShowForm(false)
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
            const bekzodName = bekzodChecked ? 'Bekzod' : '';
            const sirojName = sirojChecked ? 'Siroj' : '';
            const murodName = murodChecked ? 'Murod' : '';
            const zafarName = zafarChecked ? 'Zafar' : '';
            const abrorName = abrorChecked ? 'Abror' : '';
            const vohidName = vohidChecked ? 'Vohid' : '';
            const otabekName = otabekChecked ? 'Otabek' : '';
            const asrorName = asrorChecked ? 'Asror' : '';
            const athamName = athamChecked ? 'Atham' : '';
            const elyorName = elyorChecked ? 'Elyor' : '';



            await addDoc(data, {
              title,
              descript: des,
              img: downloadURL,
              id: uuid(),
              montaj,
              firstData,
              bekzod: bekzodName,
              siroj: sirojName,
              murod: murodName,
              zafar: zafarName,
              abror: abrorName,
              vohid: vohidName,
              otabek: otabekName,
              asror: asrorName,
              atham: athamName,
              elyor: elyorName,

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

  const handleEdit = (id, title, descript, img, montaj, firstData, bekzod, siroj, murod) => {
    setId(id);
    setTitle(title);
    setDes(descript);
    setImgUrl(img);
    setMontaj(montaj);
    setFirstData(firstData);
    setBekzod(bekzod);
    setSiroj(siroj);
    setMurod(murod)
    setZafar(zafar);
    setAbror(abror);
    setVohid(vohid);
    setOtabek(otabek);
    setAsror(asror);
    setAtham(atham);
    setElyor(elyor);
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db1, 'blogs', id);
    const bekzodName = bekzodChecked ? 'Bekzod' : '';
    const sirojName = sirojChecked ? 'Siroj' : '';
    const murodName = murodChecked ? 'Murod' : '';
    const zafarName = zafarChecked ? 'Zafar' : '';
    const abrorName = abrorChecked ? 'Abror' : '';
    const vohidName = vohidChecked ? 'Vohid' : '';
    const otabekName = otabekChecked ? 'Otabek' : '';
    const asrorName = asrorChecked ? 'Asror' : '';
    const athamName = athamChecked ? 'Atham' : '';
    const elyorName = elyorChecked ? 'Elyor' : '';
    setShowForm(false)



    await updateDoc(updateData, {
      title,
      descript: des,
      img: imgUrl,
      montaj,
      firstData,
      bekzod: bekzodName,
      siroj: sirojName,
      murod: murodName,
      zafar: zafarName,
      abror: abrorName,
      vohid: vohidName,
      otabek: otabekName,
      asror: asrorName,
      atham: athamName,
      elyor: elyorName,
    });
    setShowForm(false);
    setIsUpdate(false);
    resetForm();
  };

  const handleMontaj = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db1, 'montaj'), {
        bekzod,
        siroj,
        murod,
        zafar,
        abror,
        vohid,
        otabek,
        asror,
        atham,
        elyor
      });
      notification.success({
        message: "Montaj muvaffaqiyatli yuborildi",
        description: "Succes"
      });
      setShowMontaj(false);
    } catch (error) {
      console.error("Error sending montaj data:", error);
      notification.error({
        message: "Xatolik",
        description: "Montaj ma'lumotlarini yuborishda xatolik yuz berdi"
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDes("");
    setImg(null);
    setImgUrl('');
    setMontaj("");
    setFirstData("");
    setBekzod("");
    setSiroj("");
    setMurod("");
    setZafar("");
    setAbror("");
    setVohid("");
    setOtabek("");
    setAsror("");
    setAtham("");
    setElyor("");
    setShowForm(false);
    setBekzodChecked(false);
    setSirojChecked(false);
    setMurodChecked(false);

  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleBekzodChange = (e) => {
    setBekzodChecked(e.target.checked);
  };

  const handleSirojChange = (e) => {
    setSirojChecked(e.target.checked);
  };

  const handleMurodChange = (e) => {
    setMurodChecked(e.target.checked);
  };

  const handleZafarChange = (e) => {
    setZafarChecked(e.target.checked);
  };

  const handleAbrorChange = (e) => {
    setAbrorChecked(e.target.checked);
  };

  const handleVohidChange = (e) => {
    setVohidChecked(e.target.checked);
  };

  const handleOtabekChange = (e) => {
    setOtabekChecked(e.target.checked);
  };

  const handleAsrorChange = (e) => {
    setAsrorChecked(e.target.checked);
  };

  const handleAthamChange = (e) => {
    setAthamChecked(e.target.checked);
  };
  const handleElyorChange = (e) => {
    setElyorChecked(e.target.checked);
  };

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
  const [openMontaj, setopenMontaj] = useState({});
  const [openVideo, setopenVideo] = useState({});


  // Function to toggle the visibility of the Montajchilar and Video Operator lists
  const toggleMontaj = (id) => {
    setopenMontaj((prev) => ({
      ...prev,
      [id]: !prev[id] // Toggle the block with the given id
    }));
  };
  const toggleVideo = (id) => {
    setopenVideo((prev) => ({
      ...prev,
      [id]: !prev[id] // Toggle the block with the given id
    }));
  };

  return (
    <div className="mt-[100px]">

      <button className="flex m-auto border w-[100px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>
        Add Data
      </button>
      {/* Create Data */}
      {showForm && (
        <div className=" overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-[-40px] left-0 right-0 backdrop-blur-[100px]">
          <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]">
            <IoIosCloseCircleOutline />
          </button>
          <h2 className="text-2xl mb-4 font-[700]">Create New Post</h2>
          <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg">
              <div className="w-[40%] border flex justify-between">
                <div>
                  <label htmlFor="date">
                    <h1 className="mb-[10px] text-xl font-semibold">Vaqtni kiriting</h1>
                    <input
                      id="date"
                      type="date"
                      className="block w-[70%] p-2 mb-4 border border-gray-300 rounded-md"
                      value={firstData}
                      onChange={(e) => setFirstData(e.target.value)}
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="To'y Xona"
                    className="block w-[70%] p-2 mb-4 border border-gray-300 rounded-md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="To'y xaqida ma'lumotlar"
                    className="block w-[70%] p-2 mb-4 border border-gray-300 rounded-md"
                  />
                  <input
                    type="file"
                    className="block w-[70%] p-2 mb-4 border border-gray-300 rounded-md"
                    onChange={handleFileChange}
                  />
                </div>
                <div>
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
                  <div className="flex mb-[15px]">
                    <label htmlFor="bekzod" className="flex text-black">
                      Bekzod
                      <input
                        type="checkbox"
                        id="bekzod"
                        name="bekzod"
                        checked={bekzodChecked}
                        onChange={handleBekzodChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="siroj" className="ml-5 flex text-black">
                      Siroj
                      <input
                        type="checkbox"
                        id="siroj"
                        name="siroj"
                        checked={sirojChecked}
                        onChange={handleSirojChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="murod" className="ml-5 flex text-black">
                      Murod
                      <input
                        type="checkbox"
                        id="murod"
                        name="murod"
                        checked={murodChecked}
                        onChange={handleMurodChange}
                        className="ml-2"
                      />
                    </label>
                  </div>
                  <h1 className="text-black text-[20px] mb-[10px]">Video Operator</h1>
                  <div className="flex mb-[15px]">
                    <label htmlFor="zafar" className="flex text-black">
                      Zafar
                      <input
                        type="checkbox"
                        id="zafar"
                        name="zafar"
                        checked={zafarChecked}
                        onChange={handleZafarChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="abror" className="ml-5 flex text-black">
                      Abror
                      <input
                        type="checkbox"
                        id="abror"
                        name="abror"
                        checked={abrorChecked}
                        onChange={handleAbrorChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="vohid" className="ml-5 flex text-black">
                      Vohid
                      <input
                        type="checkbox"
                        id="vohid"
                        name="vohid"
                        checked={vohidChecked}
                        onChange={handleVohidChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="otabek" className="ml-5 flex text-black">
                      Otabek
                      <input
                        type="checkbox"
                        id="otabek"
                        name="otabek"
                        checked={otabekChecked}
                        onChange={handleOtabekChange}
                        className="ml-2"
                      />
                    </label>
                  </div>
                  <div className="flex mb-[15px]">
                    <label htmlFor="asror" className="ml-5 flex text-black">
                      Asror
                      <input
                        type="checkbox"
                        id="asror"
                        name="asror"
                        checked={asrorChecked}
                        onChange={handleAsrorChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="atham" className="ml-5 flex text-black">
                      Atham
                      <input
                        type="checkbox"
                        id="atham"
                        name="atham"
                        checked={athamChecked}
                        onChange={handleAthamChange}
                        className="ml-2"
                      />
                    </label>
                    <label htmlFor="elyor" className="ml-5 flex text-black">
                      Elyor
                      <input
                        type="checkbox"
                        id="elyor"
                        name="elyor"
                        checked={elyorChecked}
                        onChange={handleElyorChange}
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
                  <p className="text-[18px]">{mall.murod}</p>

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
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(mall.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          box.map((mall) => (



            <div className="flex justify-center items-center mt-[100px]" key={mall.id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 text-center transition-transform transform hover:-translate-y-1">
                <img src={mall.img} alt="Image" className="w-full h-44 object-cover" />
                <div className="p-5">
                  <p className="text-gray-500 text-sm">{mall.firstData}</p>
                  <h2 className="my-2 text-2xl font-bold text-gray-800">{mall.title}</h2>

                  <p className="text-gray-700 text-sm">
                    Montaj bajarilganmi: <span className="text-green-500 font-bold">{mall.montaj}</span>
                  </p>

                  {/* Montajchilar List */}
                  <div className="border rounded-[10px] shadow-inner mb-4 mt-4">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMontaj(mall.id)}>
                      <h2 className="text-[18px]">Montajchilar ro'yxati:</h2>
                      <span className={`transform transition-transform ${openMontaj[mall.id] ? 'rotate-90' : ''}`}>
                        ➤ {/* Replace this with an icon if preferred */}
                      </span>
                    </div>
                    <div
                      className={`mt-2 transition-all duration-300 ${openMontaj[mall.id] ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                      <p className="text-[18px]">{mall.bekzod}</p>
                      <p className="text-[18px]">{mall.siroj}</p>
                      <p className="text-[18px]">{mall.murod}</p>
                    </div>
                  </div>

                  {/* Video Operators List */}
                  <div className="border rounded-[10px] shadow-inner mb-4">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleVideo(mall.id)}>
                      <h2 className="text-[18px]">Video Operator:</h2>
                      <span className={`transform transition-transform ${openVideo[mall.id] ? 'rotate-90' : ''}`}>
                        ➤ {/* Replace this with an icon if preferred */}
                      </span>
                    </div>
                    <div
                      className={`mt-2 transition-all duration-300 ${openVideo[mall.id] ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                    >
                      <p className="text-[18px]">{mall.zafar}</p>
                      <p className="text-[18px]">{mall.abror}</p>
                      <p className="text-[18px]">{mall.vohid}</p>
                      <p className="text-[18px]">{mall.otabek}</p>
                      <p className="text-[18px]">{mall.asror}</p>
                      <p className="text-[18px]">{mall.atham}</p>
                      <p className="text-[18px]">{mall.elyor}</p>
                    </div>
                  </div>

                  <div className="flex justify-between mb-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleEdit(mall.id, mall.title, mall.descript,
                        mall.img, mall.montaj,
                        mall.firstData, mall.bekzod, mall.siroj,
                        mall.murod, mall.zafar, mall.abror,
                        mall.vohid, mall.otabek, mall.asror,
                        mall.atham, mall.elyor)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleDelete(mall.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>


          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard;
