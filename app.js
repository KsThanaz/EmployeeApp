// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const cors=require('cors');
const path=require('path');
require('dotenv').config()
const blogRouter=require('./Routers/blogRouter')


app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 

mongoose.connect('mongodb+srv://ksthanaz88:UA1I2qgqgnO6sAD2@cluster0.aflfttw.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
  

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
      const employeelist = await Employee.find();
      res.json(employeelist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//TODO: get single data from db  using api '/api/employeelist/:id'

app.get('/api/employeelist/:id', async (req, res) => {
    try {
      const employeelist = await Employee.findById(req.params.id);
      if (employeelist === null) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employeelist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    const employeelist = new Employee({
      name: req.body.name,
      location: req.body.location,
      position: req.body.position,
      salary: req.body.salary
    });

    try {
        const newEmployee = await employeelist.save();
        res.status(201).json(newEmployee);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
    


//TODO: delete a employee data from db by using api '/api/employeelist/:id'

app.delete('/api/employeelist/:id', async (req, res) => {
    try {
      const employeelist = await Employee.findById(req.params.id);
      if (employeelist === null) {
        return res.status(404).json({ message: "Employee not found" });
      }
      await employeelist.remove();
      res.json({ message: "Employee deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.put('/api/employeelist', async (req, res) => {
    try {
      const employeelist = await Employee.findById(req.params.id);
      if (employeelist === null) {
        return res.status(404).json({ message: "Employee not found" });
      }
      if (req.body.name != null) {
        employeelist.name = req.body.name;
      }
      if (req.body.location != null) {
        employeelist.location = req.body.location;
      }
      if (req.body.position != null) {
        employeelist.position = req.body.position;
      }
      if (req.body.salary != null) {
        employeelist.salary = req.body.salary;
      }
      const updatedEmployee = await  employeelist.save();
      res.json(updatedEmployee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.use('./blogs',blogRouter)
const PORT =process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
