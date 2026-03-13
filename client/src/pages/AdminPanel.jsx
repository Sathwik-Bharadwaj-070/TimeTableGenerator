import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../App.css";

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : 'https://timetablegenerator-1-znsh.onrender.com';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const startEdit = (user) => {
    setEditId(user._id);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API_URL}/users/${editId}`, {
        username: editUsername,
        email: editEmail
      });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-container">
      <div className="section-block fade-in">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="table-container">
          <table className="timetable">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    {editId === user._id ? (
                      <input
                        className="admin-edit-input"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td>
                    {editId === user._id ? (
                      <input
                        className="admin-edit-input"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    <div className="secondary-btns" style={{ marginTop: 0 }}>
                      {editId === user._id ? (
                        <button className="pdf-btn" onClick={saveEdit}>Save</button>
                      ) : (
                        <button className="pdf-btn" onClick={() => startEdit(user)}>Edit</button>
                      )}
                      <button className="reset-btn" onClick={() => deleteUser(user._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;