import { getDatabase } from "firebase/database";
import { addDoc, collection, deleteDoc, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { notification } from 'antd';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { v4 as uuid } from "uuid";

const database = getDatabase();

function Dashboard() {
  const [box, setBox] = useState([]);
  const [title, setTitle] = useState('');
  const [des, setDes] = useState('');
  const [img, setImg] = useState('');
  const [id, setId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  
  let data = collection(db, 'blogs');

  useEffect(() => {
    onSnapshot(
      data, (snapshot) => {
        let malumot = []
        snapshot.docs.forEach((doc) => {
          malumot.push({ ...doc.data(), id: doc.id });
        });
        setBox(malumot);
      }
    );
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (title === "" || des === "" || img === "") {
      return notification.error({
        message: "Input bo'sh",
        description: "Malumot to'liq kiritilmagan"
      });
    } else {
      await addDoc(data, {
        title: title,
        descript: des,
        img: img,
        id: uuid()
      });
      notification.success({
        message: "Ma'lumot kiritildi",
        description: "Sizning barcha ma'lumotlaringiz kiritildi"
      });

      setDes("");
      setTitle("");
      setImg("");
      setShowForm(false);
    }
  }

  const handleDelete = async (id) => {
    const deletePost = doc(db, 'blogs', id);
    await deleteDoc(deletePost);
    console.log(id);
  }

  const handleEdit = async (id, title, descript, img) => {
    setId(id);
    setTitle(title);
    setDes(descript);
    setImg(img);
    setIsUpdate(true);
    setShowForm(true);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db, 'blogs', id);
    await updateDoc(updateData, { id, title, descript: des, img });
    setIsUpdate(false);
    setShowForm(false);
    setDes("");
    setTitle("");
    setImg("");
  }

  return (
    <>
      <button className="flex m-auto border w-[140px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>Create Data</button>
      {showForm && (
        <div className="overflow-hidden mt-10 p-4 border w-full h-full  border-gray-300 rounded-md m-auto fixed top-[-45px] left-0 right-0 backdrop-blur-[10px]">
          <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]"><IoIosCloseCircleOutline /></button>
          <h2 className="text-2xl mb-4 text-center font-[700] mt-[10%]">{isUpdate ? 'Update Post' : 'Create New Post'}</h2>
          <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
            <input
              type="text"
              placeholder="Title"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={des}
              onChange={(e) => setDes(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md m-auto"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-md flex m-auto">{isUpdate ? 'Update' : 'Create'}</button>
          </form>
        </div>
      )}
      <h1 className="text-center mt-10 mb-10 text-3xl font-bold">
        All Datas
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-[50px]">
        {box.map((mall) => {
          return (
            <div className="border border-black max-w-full max-h-full text-center m-auto rounded-md h-auto mt-6 shadow-lg" key={mall.id}>
              <div className="box p-4">
                <img className="w-full h-64 object-cover rounded-t-md" src={mall.img} alt="" />
                <h3 className="mt-6 text-2xl text-green-600 font-semibold">Ism: {mall.title}</h3>
                <h2 className="mt-6 mb-4 text-xl text-red-500">Ma'lumot: {mall.descript}</h2>
                <div className="flex justify-evenly">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => handleEdit(mall.id, mall.title, mall.descript, mall.img)}>Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(mall.id)}>Delete</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Dashboard;
