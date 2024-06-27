import { addDoc, collection, deleteDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";

function Dashboard() {
  const [box, setBox] = useState([]);
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');
  const [img, setImg] = useState('');
  const [id, setId] = useState('');
  const [montaj, setMontaj] = useState('');
  const [firstData, setFirstData] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const data = collection(db, 'blogs');

  useEffect(() => {
    const unsubscribe = onSnapshot(data, (snapshot) => {
      const malumot = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setBox(malumot);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (title === "" || des === "" || img === "" || montaj === "" || firstData === "") {
      return notification.error({
        message: "Input bo'sh",
        description: "Malumot to'liq kiritilmagan"
      });
    } else {
      await addDoc(data, {
        title,
        descript: des,
        img,
        id: uuid(),
        montaj,
        firstData
      });
      notification.success({
        message: "Ma'lumot kiritildi",
        description: "Sizning barcha ma'lumotlaringiz kiritildi"
      });
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    const deletePost = doc(db, 'blogs', id);
    await deleteDoc(deletePost);
    console.log(`Deleted post with id: ${id}`);
  };

  const handleEdit = (id, title, descript, img, montaj, firstData) => {
    setId(id);
    setTitle(title);
    setDes(descript);
    setImg(img);
    setMontaj(montaj);
    setFirstData(firstData);
    setIsUpdate(true);
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db, 'blogs', id);
    await updateDoc(updateData, { id, title, descript: des, img, montaj, firstData });
    setIsUpdate(false);
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDes("");
    setImg("");
    setMontaj("");
    setFirstData("");
    setShowForm(false);
  };

  return (
    <>
      <button className="flex m-auto border w-[140px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>Ma'lumot qo'shish</button>
      {showForm && (
        <div className="overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md m-auto fixed top-[-45px] left-0 right-0 backdrop-blur-[100px]">
          <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]"><IoIosCloseCircleOutline /></button>
          <h2 className="text-2xl mb-4 text-center font-[700] mt-[10%]">{isUpdate ? 'Update Post' : 'Create New Post'}</h2>
          <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
            <label htmlFor="date">
              <h1 className="text-center mb-[10px]">Vaqtni kiriting</h1>
              <input
                id="date"
                type="date"
                className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
                value={firstData}
                onChange={(e) => setFirstData(e.target.value)}
              />
            </label>
            <input
              type="text"
              placeholder="To'y Xona"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="To'y xaqida ma'lumotlar"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
            <input
              type="text"
              placeholder="Rasm Silkasi"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <h1 className="text-center text-black text-[20px] mb-[10px]">Montaj qilinganmi?</h1>
            <div className="flex justify-center items-center mb-[15px]">
              <label htmlFor="ha" className="flex items-center text-black">
                Bajarildi
                <input
                  type="radio"
                  id="ha"
                  name="montaj"
                  value="Bajarildi"
                  checked={montaj === "Bajarildi"}
                  onChange={(e) => setMontaj(e.target.value)}
                  className="ml-2"
                />
              </label>
              <label htmlFor="yoq" className="flex items-center text-black ml-4">
                Bajarilmoqda
                <input
                  type="radio"
                  id="yoq"
                  name="montaj"
                  value="Bajarilmoqda"
                  checked={montaj === "Bajarilmoqda"}
                  onChange={(e) => setMontaj(e.target.value)}
                  className="ml-2"
                />
              </label>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md flex m-auto">{isUpdate ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <h1 className="text-center mt-10 mb-10 text-3xl font-bold">
        All Datas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-[50px]">
        {box.map((mall) => (
          <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
            <div className="box p-4">
              <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt={mall.title} />
              <p className="mt-6 mb-4 text-[20px] text-blue-500">Zakaz vaqti: {mall.firstData}</p>
              <p className="mt-6 text-[21px] text-green-600 font-semibold">To'yxona haqida: {mall.title}</p>
              <p className="mt-6 mb-4 text-[22px] text-red-500">To'y xaqida ma'lumot: {mall.descript}</p>
              <p className="mt-6 mb-4 text-[23px] text-blue-500"> Montaj bajarilganmi : <p className="text-green-600 font-[600]">{mall.montaj}</p></p>
              <div className="flex justify-evenly">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript, mall.img, mall.montaj, mall.firstData)}>Edit</button>
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
