import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../page.css'

function CreateMenu() {
  const [menu, setMenu] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [parentId, setParentId] = useState("");
  const [childData, setChildData] = useState([]);
  const [secondChildId, setSecondChildId] = useState("");
  const [secondLevelChildData, setSecondLevelChildData] = useState([]);
  const [childId, setChildId] = useState("");

  const getMenu = async () => {
    try {
      const { data } = await axios.get("https://gifted-pear-dalmatian.cyclic.app/menu/getMenu");
      setMenuData(data);
    } catch (error) {
      console.log({ msg: "error in getting parent menu", error });
    }
  };

  const getChildData = async () => {
    try {
      const { data } = await axios.get(`https://gifted-pear-dalmatian.cyclic.app/menu/childMenu/${parentId}`);
      setChildData(data);
    } catch (error) {
      console.log({ msg: "error in getting child menu", error });
    }
  };

  const getSecondLevelChildData = async (selectedChildId) => {
    try {
      const { data } = await axios.get(`https://gifted-pear-dalmatian.cyclic.app/menu/childMenu/${selectedChildId}`);
      setSecondLevelChildData(data);
    } catch (error) {
      console.log({ msg: "error in getting second level child menu", error });
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  useEffect(() => {
    getChildData();
  }, [parentId]);

  useEffect(() => {
    if (childId) {
      getSecondLevelChildData(childId);
    }
  }, [childId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const objectId = secondChildId || childId || parentId;
  
      const {data} = await axios.post("https://gifted-pear-dalmatian.cyclic.app/menu/addMenu", {
        name:menu,
        objectId,
      });
      alert(data.message)
      setMenu("");
      setParentId("");
      setChildId("");
      setSecondChildId("");
    } catch (error) {
      console.log({ msg: "error in submit", error });
    }
  };
  

  return (
    <div>
          <Link to="/view" className="view-menu-button">
        View Menu
      </Link>
         <h2>Create Menu</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Menu Name:
          <input type="text" value={menu} onChange={(e) => setMenu(e.target.value)} />
        </label>
        <br />
        <label>
          Select Parent Menu:
          <select value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">Select an existing menu</option>
            {menuData.map((menu) => (
              <option key={menu._id} value={menu._id}>
                {menu.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        {childData.length > 0 && (
          <>
            <label>
                Select sub menu :
              <select value={childId} onChange={(e) => setChildId(e.target.value)}>
                <option value="">Select : </option>
                {childData.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </label>
            <br />
          </>
        )}
        {secondLevelChildData.length > 0 && (
          <label >
            Select sub menu :
            <select  value={secondChildId} onChange={(e) => setSecondChildId(e.target.value)}> 
              <option value="">Select : </option>
              {secondLevelChildData.map((secondLevelChild) => (
                <option key={secondLevelChild._id} value={secondLevelChild._id}>
                  {secondLevelChild.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateMenu;
