import { useState, useEffect } from "react";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { collection, addDoc, deleteDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from "../firebase";

function Dashboard() {
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

  const [showForm, setShowForm] = useState(false);
  const [showMontaj, setShowMontaj] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [bekzodChecked, setBekzodChecked] = useState(false);
  const [sirojChecked, setSirojChecked] = useState(false);

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
    if (title === "" || des === "" || img === null || montaj === "" || firstData === "" || bekzodChecked === "" || sirojChecked === "") {
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

            await addDoc(data, {
              title,
              descript: des,
              img: downloadURL,
              id: uuid(),
              montaj,
              firstData,
              bekzod: bekzodName,
              siroj: sirojName
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

  const handleEdit = (id, title, descript, img, montaj, firstData, bekzod, siroj) => {
    setId(id);
    setTitle(title);
    setDes(descript);
    setImgUrl(img);
    setMontaj(montaj);
    setFirstData(firstData);
    setBekzod(bekzod);
    setSiroj(siroj);
    setBekzodChecked(bekzod === 'Bekzod');
    setSirojChecked(siroj === 'Siroj');
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db, 'blogs', id);
    const bekzodName = bekzodChecked ? 'Bekzod' : '';
    const sirojName = sirojChecked ? 'Siroj' : '';

    await updateDoc(updateData, {
      title,
      descript: des,
      img: imgUrl,
      montaj,
      firstData,
      bekzod: bekzodName,
      siroj: sirojName
    });
    setShowForm(false);
    setIsUpdate(false);
    resetForm();
  };

  const handleMontaj = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'montaj'), {
        bekzod,
        siroj
      });
      notification.success({
        message: "Montaj muvaffaqiyatli yuborildi",
        description: "Bekzod va Siroj ma'lumotlari Firebase ga muvaffaqiyatli yuborildi"
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
    setShowForm(false);
    setBekzodChecked(false);
    setSirojChecked(false);
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

  return (
    <>
      <div>
        <button className="flex m-auto border w-[100px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>
          Add Data
        </button>
        {showForm && (
          <div className="overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-0 left-0 right-0 backdrop-blur-[100px]">
            <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]">
              <IoIosCloseCircleOutline />
            </button>
            <h2 className="text-2xl mb-4 font-[700]">Create New Post</h2>
            <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
              <div>
                <label htmlFor="date">
                  <h1 className="mb-[10px]">Vaqtni kiriting</h1>
                  <input
                    id="date"
                    type="date"
                    className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                    value={firstData}
                    onChange={(e) => setFirstData(e.target.value)}
                  />
                </label>
                <input
                  type="text"
                  placeholder="To'y Xona"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="To'y xaqida ma'lumotlar"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                />
                <input
                  type="file"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-[50px]">
        {box.map((mall) => (
          <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
            <div className="box p-4"> 
              <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt={mall.title} />
              <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
              <p className="mt-6 text-[21px] text-green-600 font-semibold">To'yxona haqida: {mall.title}</p>
              <div className="border rounded-[10px] shadow-inner">
                <h2 className="text-[18px] mt-[5px]">Montajchilar ro'yxati:</h2>
                <p className="text-[18px]">{mall.bekzod}</p>
                <p className="text-[18px] mb-[5px]">{mall.siroj}</p>
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript, mall.img, mall.montaj, mall.firstData, mall.bekzod, mall.siroj)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(mall.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

export default Dashboard;
