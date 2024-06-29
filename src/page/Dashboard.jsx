import { useState, useEffect } from "react";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";
import { collection, addDoc, deleteDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from "../firebase";
import CreateData from "./CreateData";

function Dashboard() {
  const [box, setBox] = useState([]);
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [id, setId] = useState('');
  const [montaj, setMontaj] = useState('');
  const [firstData, setFirstData] = useState('');
  const [bekzod, setBekzod] = useState('Bekzod');
  const [siroj, setSiroj] = useState('Siroj');

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
              title,
              descript: des,
              img: downloadURL,
              id: uuid(),
              montaj,
              firstData,
              bekzod,
              siroj
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
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db, 'blogs', id);
    await updateDoc(updateData, { id, title, descript: des, img: imgUrl, montaj, firstData, bekzod, siroj });
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
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <>
    <CreateData/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-[50px]">
        {box.map((mall) => (
          <div className="border border-black w-[70%] max-h-full text-center m-auto h-auto rounded-md mt-6 shadow-lg" key={mall.id}>
            <div className="box p-4">
              <img className="w-[52%] m-auto h-[250px] rounded-t-md" src={mall.img} alt={mall.title} />
              <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
              <p className="mt-6 text-[21px] text-green-600 font-semibold">To'yxona haqida: {mall.title}</p>
              <p className="mt-6 text-[21px] text-green-600 font-semibold">Montajchi: {mall.bekzod}</p>
              <p className="mt-6 text-[21px] text-green-600 font-semibold">Montajchi: {mall.siroj}</p>

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
                <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setShowMontaj(true)}>Montaj</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMontaj && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <button value={bekzod} className="bg-black text-white px-4 py-2 rounded-md mt-4" onClick={(e) => setBekzod(e.target.value)}>Bekzod</button>
            <button value={siroj} className="bg-black text-white px-4 py-2 rounded-md mt-4 ml-[50px]" onClick={(e) => setSiroj(e.target.value)}>Siroj</button><br />
            <button onClick={() => setShowMontaj(false)} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">Close</button>
            <button onClick={handleMontaj} className="bg-red-500 text-white px-4 py-2 rounded-md mt-4">Submit</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
