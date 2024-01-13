const axios = require('axios');
const menuModel = require("../models/menuSchema");

const getParentMenu = async (req, res) => {
    try {
      const allMenus = await menuModel.find();
      const parents = allMenus.filter((menu) => {
        return !allMenus.some((otherMenu) =>
          otherMenu.children.includes(menu._id.toString())
        );
      });
      return res.json(parents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching parent menu" });
    }
  };

 const getChildrenMenu = async(req,res) => {
  try {
    const id = req.params.id;
   const parentMenu = await menuModel.findById(id).populate('children');

    if (!parentMenu) {
      return res.status(404).json({ error: "Parent menu not found" });
    }

    const childrenIds = parentMenu.children.map(child => child._id);

    const childrenDetails = await menuModel.find({ _id: { $in: childrenIds } });

    res.json(childrenDetails);
  } catch (error) {
    res.status(500).json({ error: "Error fetching child menu" });
  }
 } 
  
const addMenu = async (req, res) => {
  try {
    const { name, objectId } = req.body;
    if (!name) {
      res.json({ message: "Please give the name" });
      return;
    }
    
    await addMenuByHierarchy(objectId, name);

    res.status(200).json({ message: "Menu created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function addMenuByHierarchy(parentId, menuName) {
    const newMenu = new menuModel({
        name: menuName,
        parent: parentId,
    });

    if (!parentId) {
        const topLevelMenu = new menuModel({
            name: menuName,
            parent: null,
        });
        await topLevelMenu.save();
    } else {
        const parentMenu = await menuModel.findById(parentId);

        if (parentMenu) {
            parentMenu.children.push(newMenu);
            await newMenu.save();
            await parentMenu.save();
        } else {
            console.error('Parent menu not found');
        }
    }
}

const editMenu = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    const updatedMenu = await menuModel.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.log({ msg: 'error in editing', error });
    res.status(500).json({ error: 'Error editing menu' });
  }
};


const deleteMenu = async(req,res)=>{
  try{
    const id = req.params.id;
    console.log(id)
    const result = await menuModel.findByIdAndDelete(id);

    if (result) {
      return res.json({ message: "Menu deleted successfully" });
    } else {
      return res.status(404).json({ message: "Menu not found" });
    }

  }catch (error) {
    console.log({msg:"error in editing",error})
  }

}


module.exports = {
  addMenu,
  getParentMenu,
  getChildrenMenu,
  editMenu,
  deleteMenu
};
