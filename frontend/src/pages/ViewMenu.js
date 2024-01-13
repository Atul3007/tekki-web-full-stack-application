import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewMenu() {
  const [menuData, setMenuData] = useState([]);

  const getMenu = async () => {
    try {
      const { data } = await axios.get("https://gifted-pear-dalmatian.cyclic.app/menu/getMenu");
      setMenuData(data);
    } catch (error) {
      console.log({ msg: "error in getting parent menu", error });
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div>
      <h2>View Menu</h2>
      <ul>
        {menuData.map((menu) => (
          <MenuItem key={menu._id} menu={menu} onUpdate={() => getMenu()} />
        ))}
      </ul>
    </div>
  );
}

function MenuItem({ menu, onUpdate }) {
  const [childData, setChildData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newMenuName, setNewMenuName] = useState(menu.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const menuItemStyle = {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const menuInfoStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const menuNameStyle = {
    marginRight: '10px',
  };

  const menuButtonsStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyleEdit = {
    cursor: 'pointer',
    padding: '5px 10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: 'red',
  };

  const buttonStyleDelete = {
    cursor: 'pointer',
    padding: '5px 10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: 'green',
  };

  const childListStyle = {
    listStyle: 'none',
    paddingLeft: '20px',
    marginTop: '10px',
  };

  const getChildData = async (parentId) => {
    try {
      const { data } = await axios.get(`https://gifted-pear-dalmatian.cyclic.app/menu/childMenu/${parentId}`);
      setChildData(data);
    } catch (error) {
      console.log({ msg: "error in getting child menu", error });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setIsEditing(false);

    try {
      await axios.put(`https://gifted-pear-dalmatian.cyclic.app/menu/editMenu/${menu._id}`, {
        name: newMenuName,
      });

      getChildData(menu._id);
      onUpdate(); // Notify parent to update menu data
    } catch (error) {
      console.log({ msg: "error in editing menu", error });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewMenuName(menu.name);
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm(`Are you sure you want to delete ${menu.name}?`);
    if (shouldDelete) {
      try {
        await axios.delete(`https://gifted-pear-dalmatian.cyclic.app/menu/deleteMenu/${menu._id}`);
        setIsDeleting(true);
        alert("Deleted Successfully!!!");
        onUpdate(); // Notify parent to update menu data
      } catch (error) {
        console.log({ msg: "error in deleting menu", error });
      }
    }
  };

  useEffect(() => {
    if (!isDeleting) {
      getChildData(menu._id);
    }
  }, [menu._id, isDeleting]);

  return (
    <li key={menu._id} style={menuItemStyle}>
      <div style={menuInfoStyle}>
        {isEditing ? (
          <input
            type="text"
            value={newMenuName}
            onChange={(e) => setNewMenuName(e.target.value)}
          />
        ) : (
          <span style={menuNameStyle}>{menu.name}</span>
        )}
        <div style={menuButtonsStyle}>
          {isEditing ? (
            <>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <button style={buttonStyleEdit} onClick={handleEdit}>
              Edit
            </button>
          )}
          <button style={buttonStyleDelete} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      {childData.length > 0 && (
        <ul style={childListStyle}>
          {childData.map((child) => (
            <MenuItem key={child._id} menu={child} onUpdate={onUpdate} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default ViewMenu;
