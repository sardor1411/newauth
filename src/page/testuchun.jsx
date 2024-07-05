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

  // Checkbox states for Montaj
  const [bekzodChecked, setBekzodChecked] = useState(false);
  const [sirojChecked, setSirojChecked] = useState(false);
  const [murodChecked, setMurodChecked] = useState(false);

  // Checkbox states for Video Operators
  const [zafarChecked, setZafarChecked] = useState(false);
  const [abrorChecked, setAbrorChecked] = useState(false);
  const [vohidChecked, setVohidChecked] = useState(false);
  const [otabekChecked, setOtabekChecked] = useState(false);
  const [asrorChecked, setAsrorChecked] = useState(false);
  const [athamChecked, setAthamChecked] = useState(false);
  const [elyorChecked, setElyorChecked] = useState(false);

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
        message: "Malumot kiritilmagan",
        description: "Barcha maydonlarni to'ldiring"
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
              bekzod: bekzodChecked ? 'Bekzod' : '',
              siroj: sirojChecked ? 'Siroj' : '',
              murod: murodChecked ? 'Murod' : '',
              zafar: zafarChecked ? 'Zafar' : '',
              abror: abrorChecked ? 'Abror' : '',
              vohid: vohidChecked ? 'Vohid' : '',
              otabek: otabekChecked ? 'Otabek' : '',
              asror: asrorChecked ? 'Asror' : '',
              atham: athamChecked ? 'Atham' : '',
              elyor: elyorChecked ? 'Elyor' : ''
            });
            notification.success({
              message: "Malumot muvaffaqiyatli kiritildi",
              description: "Barcha maydonlarning o'zgarishi qabul qilindi"
            });
            resetForm();
          });
        }
      );
    } catch (error) {
      console.error("Rasm yuklanmadi:", error);
      notification.error({
        message: "Rasm yuklanmadi",
        description: error.message
      });
    }
  };

  const handleDelete = async (id) => {
    const deletePost = doc(db, 'blogs', id);
    await deleteDoc(deletePost);
    console.log(`O'chirildi bo'lgan post id: ${id}`);
  };

  const handleEdit = (id, title, descript, img, montaj, firstData, bekzod, siroj, murod, zafar, abror, vohid, otabek, asror, atham, elyor) => {
    setId(id);
    setTitle(title);
    setDes(descript);
    setImgUrl(img);
    setMontaj(montaj);
    setFirstData(firstData);
    setBekzodChecked(bekzod === 'Bekzod');
    setSirojChecked(siroj === 'Siroj');
    setMurodChecked(murod === 'Murod');
    setZafarChecked(zafar === 'Zafar');
    setAbrorChecked(abror === 'Abror');
    setVohidChecked(vohid === 'Vohid');
    setOtabekChecked(otabek === 'Otabek');
    setAsrorChecked(asror === 'Asror');
    setAthamChecked(atham === 'Atham');
    setElyorChecked(elyor === 'Elyor');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = doc(db, 'blogs', id);

    await updateDoc(updateData, {
      title,
      descript: des,
      img: imgUrl,
      montaj,
      firstData,
      bekzod: bekzodChecked ? 'Bekzod' : '',
      siroj: sirojChecked ? 'Siroj' : '',
      murod: murodChecked ? 'Murod' : '',
      zafar: zafarChecked ? 'Zafar' : '',
      abror: abrorChecked ? 'Abror' : '',
      vohid: vohidChecked ? 'Vohid' : '',
      otabek: otabekChecked ? 'Otabek' : '',
      asror: asrorChecked ? 'Asror' : '',
      atham: athamChecked ? 'Atham' : '',
      elyor: elyorChecked ? 'Elyor' : ''
    });

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDes('');
    setImg(null);
    setImgUrl('');
    setMontaj('');
    setFirstData('');
    setBekzodChecked(false);
    setSirojChecked(false);
    setMurodChecked(false);
    setZafarChecked(false);
    setAbrorChecked(false);
    setVohidChecked(false);
    setOtabekChecked(false);
    setAsrorChecked(false);
    setAthamChecked(false);
    setElyorChecked(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleCheckboxChange = (setter) => (e) => {
    setter(e.target.checked);
  };

  return (
    <>
      <div>
        <button className="flex m-auto border w-[100px] h-[40px] items-center justify-center mt-[15px]" onClick={() => setShowForm(true)}>
          Ma'lumot qo'shish
        </button>
        {showForm && (
          <div className="overflow-hidden mt-10 p-4 border w-full h-full border-gray-300 rounded-md fixed top-0 left-0 right-0 backdrop-blur-[100px]">
            <button onClick={() => setShowForm(false)} className="text-[30px] absolute top-[20px] left-[95%]">
              <IoIosCloseCircleOutline />
            </button>
            <h2 className="text-2xl mb-4 font-[700]">Yangi post yaratish</h2>
            <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
              <div>
                <input
                  type="text"
                  placeholder="Sarlavha"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Ma'lumotlar"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                />
                <input
                  type="file"
                  className="block w-[25%] p-2 mb-4 border border-gray-300 rounded-md"
                  onChange={handleFileChange}
                />
                <label className="block">
                  Montaj qilinganmi?
                  <input
                    type="checkbox"
                    checked={montaj}
                    onChange={(e) => setMontaj(e.target.checked)}
                    className="ml-2"
                  />
                </label>
                <label className="block">
                  Ushbu bo'limdagi video montaj operatorlarini tanlash
                  <div className="mt-2">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={bekzodChecked}
                        onChange={handleCheckboxChange(setBekzodChecked)}
                        className="mr-2"
                      />
                      Bekzod
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={sirojChecked}
                        onChange={handleCheckboxChange(setSirojChecked)}
                        className="mr-2"
                      />
                      Siroj
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={murodChecked}
                        onChange={handleCheckboxChange(setMurodChecked)}
                        className="mr-2"
                      />
                      Murod
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={zafarChecked}
                        onChange={handleCheckboxChange(setZafarChecked)}
                        className="mr-2"
                      />
                      Zafar
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={abrorChecked}
                        onChange={handleCheckboxChange(setAbrorChecked)}
                        className="mr-2"
                      />
                      Abror
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={vohidChecked}
                        onChange={handleCheckboxChange(setVohidChecked)}
                        className="mr-2"
                      />
                      Vohid
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={otabekChecked}
                        onChange={handleCheckboxChange(setOtabekChecked)}
                        className="mr-2"
                      />
                      Otabek
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={asrorChecked}
                        onChange={handleCheckboxChange(setAsrorChecked)}
                        className="mr-2"
                      />
                      Asror
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={athamChecked}
                        onChange={handleCheckboxChange(setAthamChecked)}
                        className="mr-2"
                      />
                      Atham
                    </label>
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={elyorChecked}
                        onChange={handleCheckboxChange(setElyorChecked)}
                        className="mr-2"
                      />
                      Elyor
                    </label>
                  </div>
                </label>
                <button type="submit" className="bg-[red] p-2 mt-4 text-white rounded-lg border border-gray-300">Qo'shish</button>
              </div>
            </form>
          </div>
        )}
        <table className="mt-8 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Sarlavha</th>
              <th className="border px-4 py-2">Malumotlar</th>
              <th className="border px-4 py-2">Rasm</th>
              <th className="border px-4 py-2">Montaj</th>
              <th className="border px-4 py-2">Post berildi</th>
              <th className="border px-4 py-2">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {box.map((post) => (
              <tr key={post.id}>
                <td className="border px-4 py-2">{post.title}</td>
                <td className="border px-4 py-2">{post.descript}</td>
                <td className="border px-4 py-2"><img src={post.img} alt={post.title} className="w-32 h-24 object-cover" /></td>
                <td className="border px-4 py-2">{post.montaj ? '✅' : '❌'}</td>
                <td className="border px-4 py-2">{post.firstData}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDelete(post.id)} className="mr-2 text-red-600">O'chirish</button>
                  <button onClick={() => handleEdit(post.id, post.title, post.descript, post.img, post.montaj, post.firstData, post.bekzod, post.siroj, post.murod, post.zafar, post.abror, post.vohid, post.otabek, post.asror, post.atham, post.elyor)} className="text-blue-600">Tahrirlash</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Dashboard;
