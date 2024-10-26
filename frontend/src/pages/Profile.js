import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Note from '../components/Note';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [notes, setNotes] = useState([]);
  const [importantNotes, setImportantNotes] = useState([]);
  const [normalNotes, setNormalNotes] = useState([]);

  const navigate = useNavigate();

  function getUserDetails() {
    fetch("http://localhost:8000/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Application-Type": "application/json", // Sửa lỗi chính tả ở đây
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: localStorage.getItem("userID") })
    })
      .then(res => res.json())
      .then(data => {
        setUserDetails(data);
      })
      .catch(err => console.error('Lỗi khi lấy thông tin người dùng:', err)); // Xử lý lỗi
  }

  function getNotes() {
    fetch("http://localhost:8000/getNotes", {
      mode: "cors",
      method: "POST",
      headers: {
        "Application-Type": "application/json", // Sửa lỗi chính tả ở đây
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId: localStorage.getItem("userID") })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data); // In ra dữ liệu để kiểm tra
        setNotes(data);

        // Kiểm tra nếu data là mảng trước khi sử dụng filter
        if (Array.isArray(data)) {
          setImportantNotes(data.filter(note => note.isImportant));
          setNormalNotes(data.filter(note => note.isImportant === false));
        } else {
          console.error('Dữ liệu không phải là mảng:', data); // Thông báo lỗi nếu không phải là mảng
        }
      })
      .catch(err => console.error('Lỗi khi lấy ghi chú:', err)); // Xử lý lỗi
  }

  useEffect(() => {
    getUserDetails();
    getNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between w-screen h-[300px] px-[50px]">
        <div className="flex items-center gap-[10px]">
          <div className="profileCircle w-[150px] h-[150px] rounded-[50%] bg-[#d9d9d9]"></div>
          <div>
            <h3 className='text-[23px]'>{userDetails ? userDetails.name : ""}</h3>
            <p className='m-[0px] p-[0px] text-[gray] text-[15px] -mt-1'>
              Joined In {userDetails ? new Date(userDetails.date).toDateString() : ""}
            </p>
          </div>
        </div>

        <div className='relative h-[40%]'>
          <div className='flex items-center gap-[10px] text-[gray]'>
            Total Notes : {notes.length} | Important Notes : {importantNotes.length}
          </div>
          <div className='absolute bottom-0 flex items-center gap-[10px]'>
            <button className="btnNormal">Add Pic</button>
            <button className="btnNormal" onClick={() => { navigate("/addNewNote") }}>Add Note</button>
          </div>
        </div>
      </div>

      <div className='w-screen px-[50px]'>
        <h3 className='text-[26px]'>Your <span style={{ color: "#578df5" }}>Important</span> Notes</h3>
      </div>
      <div className="gridItems">
        {
          importantNotes.map((note, index) => (
            <Note key={note._id} note={note} index={index} />
          ))
        }
      </div>

      <div className='w-screen px-[50px] mt-4'>
        <h3 className='text-[26px]'>Your <span style={{ color: "#578df5" }}>Normal</span> Notes</h3>
      </div>
      <div className="gridItems mb-3">
        {
          normalNotes.map((note, index) => (
            <Note key={note._id} note={note} index={index} />
          ))
        }
      </div>
    </>
  );
};

export default Profile;
