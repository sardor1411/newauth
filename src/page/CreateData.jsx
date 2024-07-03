// import React, { useState } from 'react';
// import { notification } from 'antd';
// import { IoIosCloseCircleOutline } from 'react-icons/io';
// import { v4 as uuid } from 'uuid';
// import { collection, addDoc } from 'firebase/firestore';
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { db } from '../firebase';

// const CreateData = () => {
//     const [title, setTitle] = useState('');
//     const [des, setDes] = useState('');
//     const [img, setImg] = useState(null);
//     const [montaj, setMontaj] = useState('');
//     const [firstData, setFirstData] = useState('');
//     const [showForm, setShowForm] = useState(false);

//     const data = collection(db, 'blogs');
//     const storage = getStorage();

//     const handleCreate = async (e) => {
//         e.preventDefault();
//         if (title === '' || des === '' || img === null || montaj === '' || firstData === '') {
//             return notification.error({
//                 message: 'Input bo\'sh',
//                 description: 'Malumot to\'liq kiritilmagan',
//             });
//         }

//         try {
//             const imgRef = ref(storage, `images/${img.name}-${uuid()}`);
//             const uploadTask = uploadBytesResumable(imgRef, img);

//             uploadTask.on(
//                 'state_changed',
//                 (snapshot) => { },
//                 (error) => {
//                     notification.error({
//                         message: 'Rasm yuklanmadi',
//                         description: error.message,
//                     });
//                 },
//                 () => {
//                     getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//                         await addDoc(data, {
//                             title,
//                             descript: des,
//                             img: downloadURL,
//                             id: uuid(),
//                             montaj,
//                             firstData,
//                         });
//                         notification.success({
//                             message: 'Ma\'lumot kiritildi',
//                             description: 'Sizning barcha ma\'lumotlaringiz kiritildi',
//                         });
//                         setShowForm(false);
//                         resetForm();
//                     });
//                 }
//             );
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             notification.error({
//                 message: 'Rasm yuklanmadi',
//                 description: error.message,
//             });
//         }
//     };

//     const handleFileChange = (e) => {
//         if (e.target.files[0]) {
//             setImg(e.target.files[0]);
//         }
//     };

//     const resetForm = () => {
//         setTitle('');
//         setDes('');
//         setImg(null);
//         setMontaj('');
//         setFirstData('');
//         setShowForm(false);
//     };

//     return (
//         <>
//             <button className="flex m-auto border w-[140px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>
//                 Ma'lumot qo'shish
//             </button>
//             {showForm && (
//                 <div className="overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-0 left-0 right-0 backdrop-blur-[100px]">
//                     <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]">
//                         <IoIosCloseCircleOutline />
//                     </button>
//                     <h2 className="text-2xl mb-4 font-[700]">Create New Post</h2>
//                     <form onSubmit={handleCreate}>
//                         <div>
//                             <label htmlFor="date">
//                                 <h1 className="mb-[10px]">Vaqtni kiriting</h1>
//                                 <input
//                                     id="date"
//                                     type="date"
//                                     className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
//                                     value={firstData}
//                                     onChange={(e) => setFirstData(e.target.value)}
//                                 />
//                             </label>
//                             <input
//                                 type="text"
//                                 placeholder="To'y Xona"
//                                 className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
//                                 value={title}
//                                 onChange={(e) => setTitle(e.target.value)}
//                             />
//                             <textarea
//                                 placeholder="To'y xaqida ma'lumotlar"
//                                 className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
//                                 value={des}
//                                 onChange={(e) => setDes(e.target.value)}
//                             />
//                             <input
//                                 type="file"
//                                 className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
//                                 onChange={handleFileChange}
//                             />
//                             <h1 className="text-black text-[20px] mb-[10px]">Montaj qilinganmi?</h1>
//                             <div className="flex mb-[15px]">
//                                 <label htmlFor="ha" className="flex text-black">
//                                     Bajarildi
//                                     <input
//                                         type="radio"
//                                         id="ha"
//                                         name="montaj"
//                                         value="Bajarildi"
//                                         checked={montaj === 'Bajarildi'}
//                                         onChange={(e) => setMontaj(e.target.value)}
//                                         className="ml-2"
//                                     />
//                                 </label>
//                                 <label htmlFor="yoq" className="flex items-center text-black ml-4">
//                                     Bajarilmoqda
//                                     <input
//                                         type="radio"
//                                         id="yoq"
//                                         name="montaj"
//                                         value="Bajarilmoqda"
//                                         checked={montaj === 'Bajarilmoqda'}
//                                         onChange={(e) => setMontaj(e.target.value)}
//                                         className="ml-2"
//                                     />
//                                 </label>
//                             </div>
//                             <button className="bg-green-500 text-white px-4 py-2 rounded-md" type="submit">
//                                 Malumot qo'shish
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </>
//     );
// };

// export default CreateData;
