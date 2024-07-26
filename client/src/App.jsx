import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    city: "",
  });

  const getAllUsers = async () => {
    const API_URL = "http://localhost:8000/users";
    await axios.get(API_URL).then((res) => {
      console.log(res.data);
      setUsers(res.data);
      setFilterUsers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.city.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredData);
  };

  const handleDelete = async (uid) => {
    console.log("uid", uid);
    const isConfirm = window.confirm("Are you sure you want to delete!");
    if (isConfirm) {
      await axios.delete(`http://localhost:8000/users/${uid}`).then((res) => {
        setUsers(res.data);
        setFilterUsers(res.data);
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //Add user details
  const handleAddRecord = () => {
    setUserData({
      name: "",
      age: "",
      city: "",
    });
    setIsModalOpen(true);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8000/users", userData).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <div className="container">
        <h3>crud-app</h3>
        <div className="input-search">
          <input
            type="text"
            className="search"
            placeholder="Search here"
            onChange={handleChange}
          />
          <button onClick={handleAddRecord} className="btn green">
            Add record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>s.no</th>
              <th>Name</th>
              <th>age</th>
              <th>city</th>
              <th>edit</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers &&
              filterUsers.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.city}</td>
                  <td>
                    <button className="btn green">Edit</button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <div className="header">
                <span onClick={closeModal} className="close">
                  &times;
                </span>
                <h2>User Record</h2>
              </div>
              <div className="content">
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userData.name}
                    onChange={handleData}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    value={userData.age}
                    onChange={handleData}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={userData.city}
                    onChange={handleData}
                  />
                </div>

                <button onClick={handleSubmit} className="btn green">
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
