import axios from "axios";
import React, { useEffect, useState } from "react";

import { ImFilesEmpty } from 'react-icons/im'
import Swal from "sweetalert2";

function EditDeleteProduct({product, productControll, productControllView}) {
    const [data, setData] = useState({
        title:'',
        desc:'',
        price:0,
        quantity:0,
        category:0,
        images:[]
    });
    

    // Edit Product
    const editProduct = async (e, product) => {
        e.preventDefault();
        const form = document.getElementById('edit_product');
        const formData = new FormData(form);
        formData.append('name', data.title ? data.title : product.name);
        formData.append('description', data.desc ? data.desc : product.desc);
        formData.append('price', data.price ? data.price : product.price);
        formData.append('quantity', data.quantity? data.quantity : product.quantity) ;
        formData.append('category', data.category ? data.category : product.category);
        formData.append('images', data.images ? data.images : product.img);

        try{
            const response = await axios.post(`/api/product/edit/${product.id}`, formData);
            Swal.fire({
                icon: 'success',
                title: 'Product Edited successfully.'
            });
            console.log(response.data)
            setData({title:'', desc:'', price:0, quantity:0, category:0, images:[]});
            productControllView('');
        }catch(err){
            console.log(err);
        }
    }
    //Get Selected Images
    const getSelectedImages = () => {
        const files = document.getElementById('images').files;
        console.log(files)
        const filesNames = [];
        for(let i=0; i<files.length; i++){
            filesNames.push(files[i].name);
        }
        setData({...data, images: filesNames, files});
    }


    // Delete Product
    const deleteProduct = async (id) => {
        try {
            await axios.post(`/api/product/delete/${id}`,  {"Content-Type":"application/json"});
            Swal.fire({
                icon: 'success',
                title: 'Product deleted.'
            });
            productControllView('');

        }catch(err){
            console.log(err);
        }
    }



    if(productControll == 'edit') {
        return (
            <div className="product-operation edit">
                <form className="admin-forms" id="edit_product" onSubmit={e=>editProduct(e, product)} encType="multipart/form-data">
                    <input name="title" type="text" placeholder="Title" onChange={(e)=>setData({...data, title:e.target.value}) } value={data.title ? data.title : product.name} />
                    <textarea name="desc" placeholder="Description" cols={10} rows={10} onChange={(e)=>setData({...data, desc:e.target.value}) } value={data.desc ? data.desc : product.desc}></textarea>
                    <input name="price" type="number" placeholder="Price" onChange={(e)=>setData({...data, price:e.target.value}) } value={data.price ? data.price : product.price} />
                    <input name="quantity" type="number" placeholder="Quntity" onChange={(e)=>setData({...data, quantity:e.target.value}) }  value={data.quantity ? data.quantity : product.quantity} />
                    <select name="category" onChange={(e)=>setData({...data, category:e.target.value}) } value={data.category ? data.category : product.category} >
                        <option value="">Category</option>
                        <option value="Computers and Multimedia">Computers and Multimedia</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Clothing and Shoes">Clothing and Shoes</option>
                        <option value="Beauty and Accessories">Beauty and Accessories</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <label htmlFor="images">< ImFilesEmpty/>
                        {
                            data.images?.length ? 
                            data.images
                            :
                            product.img?.map((img, i) => (
                                <img key={i} src={img.src} alt="" style={ {width:'60px',height:'60px'} } />
                            ))
                        }
                    </label>
                    <input type="file" name="imag[]" id="images" multiple onChange={()=>getSelectedImages()} />
                    <div>
                        <button className="btn" type="submit">Edit</button>
                        <button className="btn" onClick={()=>productControllView('')}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    } else if (productControll == 'delete') {
        return (
            <div className="product-operation">
                <p>Are you sure to delete <strong>{product.name}</strong>?</p>
                <p>
                    <button className="btn" onClick={()=>deleteProduct(product.id)}>Yes</button>
                    <button className="btn" onClick={()=>productControllView('')}>No</button>
                </p>
            </div>
        )
    }
}


export default EditDeleteProduct;