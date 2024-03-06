import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
function Home() {
    const [data, setData] = useState([]);
    const [editKey, setEditKey] = useState(null);
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    })
    const [add, setAdd] = useState(false);
    const [edit, setEdit] = useState(false);
    const fetchEmployees = async () => {
        await axios.get('http://localhost:5164/api/Employee')
            .then((res) => {
                console.log(res.data)
                setData(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const addData = (e) => {
        e.preventDefault()
        axios.post('http://localhost:5164/api/Employee', employee)
        console.log(employee);
        setAdd(false)
        setEmployee({
            name: '',
            email: '',
            phoneNumber: ''
        })
        fetchEmployees()
    }
    const handleEdit = (key) => {
        setEdit(!edit);
        setEditKey(key);
        console.log(editKey);
    }
    const editData = (e) => {
        e.preventDefault();
        const patchDoc = [];
        if (employee.name) {
            patchDoc.push({
                op: 'replace',
                path: '/Name',
                value: employee.name
            })
        }
        if (employee.email) {
            patchDoc.push({
                op: 'replace',
                path: '/Email',
                value: employee.email
            })
        }
        if (employee.phoneNumber) {
            patchDoc.push({
                op: 'replace',
                path: '/PhoneNumber',
                value: employee.phoneNumber
            })
        }
        console.log(employee.id);
        axios.patch(`http://localhost:5164/api/Employee/${data[editKey].id}`, patchDoc)
            .then((res) => {
                console.log(res)
                fetchEmployees()
            })
            .catch((err) => {
                console.log(err)
            })
        setEdit(false);
    }

    const deleteItem = (key) => {
        let consent = confirm('Are you sure you want to delete this employee?');
        if (consent) {
            console.log(`delete item ${key}`);
            axios.delete(`http://localhost:5164/api/Employee/${data[key].id}`)
                .then((res) => {
                    console.log(res);
                    fetchEmployees()
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            console.log("cancel delete");
        }

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value })
    }
    useEffect(() => {
        fetchEmployees()
    }, [data])

    return (
        <div className="home">
            <h1>Employees List</h1>
            {add &&
                <form onSubmit={addData}>
                    Name: <input type="text" name="name" id="name" value={employee.name} onChange={handleChange} required/>
                    Email: <input type="email" name='email' id='email' value={employee.email} onChange={handleChange} required/>
                    Phone Number: <input type="tel" name='phoneNumber' id='phoneNumber' value={employee.phoneNumber} onChange={handleChange} required/>
                    <button type='submit'>Submit</button>
                </form>
            }
            <button className='add' onClick={() => setAdd(!add)}>Add Employee</button>
            <div className='items'>
                {data.map((item, key) => {
                    return (
                        <div className='item' key={key}>
                            {edit && editKey === key &&
                                <form onSubmit={editData}>
                                    Name: <input type="text" name="name" id="name" value={employee.name} onChange={handleChange} />
                                    Email: <input type="email" name='email' id='email' value={employee.email} onChange={handleChange} />
                                    Phone Number: <input type="tel" name='phoneNumber' id='phoneNumber' value={employee.phoneNumber} onChange={handleChange} />
                                    <button type='submit'>Submit</button>
                                </form>}
                            <div className="data">
                                <p>Name: {item.name}</p>
                                <p>Email: {item.email}</p>
                                <p>Phone Number: {item.phoneNumber}</p>
                            </div>
                            <div className="btns">
                                <button onClick={() => handleEdit(key)}>Edit</button>
                                <button onClick={() => deleteItem(key)}>Delete</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Home