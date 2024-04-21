import axios from "axios";
import React, { useEffect, useState } from "react";

import { ImFilesEmpty } from 'react-icons/im'
import Swal from "sweetalert2";


function CreateProduct({productControll, productControllView}) {
    const [data, setData] = useState({
        title:'',
        desc:'',
        price:0,
        quantity:0,
        category:0,
        images:[]
    });
    
    // Delete Product
    const createProduct = async e => {
        e.preventDefault();
        const form = document.getElementById('add_product');
        const formData = new FormData(form);
        formData.append('name', data.title);
        formData.append('description', data.desc);
        formData.append('price', data.price);
        formData.append('quantity', data.quantity);
        formData.append('category', data.category);
        formData.append('images', data.images);
        // formData.append('files[]', data.files);
        try{
            const response = await axios.post('/api/product/add', formData);
            Swal.fire({
                icon: 'success',
                title: 'Product created successfully.'
            });
            setData({title:'', desc:'', price:0, quantity:0, category:0, images:[]});
            productControllView('');
        }catch(err){
            console.log(err);
        }

        
    }

    //Get Selected Images
    const getSelectedImages = () => {
        const files = document.getElementById('images').files;
        const filesNames = [];
        for(let i=0; i<files.length; i++){
            filesNames.push(files[i].name);
        }
        setData({...data, images: filesNames, files});
    }


    // useEffect(()=>{
    //     const renderForm = async () => {
    //         try {
    //             const res = await axios.get('/api/product/add');
    //         }catch(err){
    //             console.log(err);
    //         }
    //     }
    //     renderForm();
    // },[])
    

    if(productControll == 'create-product'){
        return (
            <div className="product-operation create">
                <form className="admin-forms" id="add_product" onSubmit={e=>createProduct(e)} encType="multipart/form-data">
                    <input name="title" type="text" placeholder="Title" onChange={(e)=>setData({...data, title:e.target.value}) } value={data.title} />
                    <textarea name="desc" placeholder="Description" cols={10} rows={10} onChange={(e)=>setData({...data, desc:e.target.value}) } value={data.desc}></textarea>
                    <input name="price" type="number" placeholder="Price" onChange={(e)=>setData({...data, price:e.target.value}) } value={data.price} />
                    <input name="quantity" type="number" placeholder="Quntity" onChange={(e)=>setData({...data, quantity:e.target.value}) }  value={data.quantity} />
                    <select name="category" onChange={(e)=>setData({...data, category:e.target.value}) } value={data.category} >
                        <option value="">Category</option>
                        <option value="Computers and Multimedia">Computers and Multimedia</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Clothing and Shoes">Clothing and Shoes</option>
                        <option value="Beauty and Accessories">Beauty and Accessories</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <label htmlFor="images">< ImFilesEmpty/>{data.images}</label>
                    <input type="file" name="imag[]" id="images" multiple onChange={()=>getSelectedImages()} />
                    <div>
                        <button className="btn" type="submit">Create</button>
                        <button className="btn" onClick={()=>productControllView('')}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}


export default CreateProduct;