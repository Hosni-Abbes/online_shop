import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FaListUl } from 'react-icons/fa';
import { SlBasket } from 'react-icons/sl';
import { HiUsers } from 'react-icons/hi';
import { FaPlus } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';

import Header from "../Partials/Header";
import Footer from "../Partials/Footer";
import EditDeleteProduct from "./EditDeleteProduct";
import CreateProduct from "./CreateProduct";

import Orders from "./Orders/Orders";
import Users from "./Users/Users";
import Settings from "./Settings/Settings";


function Admin({products, loading}) {
    const [productControll, setProductControll] = useState('');
    const [view, setView] = useState('products');
    // const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});

    // useEffect(()=>{
    //     // Get List Of Products
    //     const getProducts = async () => {
    //         try {
    //             const response = await axios.get('/api/products', {"Content-Type":"application/json"});
    //             setProducts(response.data);
    //             setLoading(false);
    //         }catch(err){
    //             console.log(err)
    //         }
    //     }
    //     getProducts();
    // },[product]);


    // const createProduct = async (e) => {
    //     try {
    //         const res = axios.post('/api/product/add', data, {headers: {"Content-Type":"application/json"} })
    //         console.log(res);
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }


    // Render View
    const renderView = () => {
        if (view == 'products') {
            return (
                <div className="products-list">
                    {
                        loading && <h3 className="loading">Loading...</h3>
                    }
                    
                    {
                        products?.length ?
                        products && products.map(product => (
                            <div key={product.id} className="product-item">
                                <div className="product-img-container">
                                    <img src={product.image[0]?.src ? product.image[0].src : '' } alt={product.title} />
                                </div>
                                <h4 className="product-item-title">{product.title}</h4>
                                <p className="product-item-desc">{product.desc}</p>
                                <span className="product-item-price">{product.price}$</span>
                                <div className="product-item-bottom">
                                    <button className="btn" onClick={()=>productControllView('edit', product.id, product.title, product.price,product.desc, product.category, product.quantity, product.image) }>Edit</button>
                                    <button className="btn" onClick={()=>productControllView('delete', product.id, product.title, product.price,product.desc, product.image) }>Delete</button>
                                </div>
                            </div>
                        ))
                        :
                        !loading  ? 
                            <div className='no-products-found'>
                                <p> No products found! </p>
                                <p> 
                                    <Link onClick={()=>productControllView('create-product')}>Click here! </Link> to create Products.
                                </p>
                                
                            </div>
                    
                        : ''
                    }
                </div>
            )
        }else if (view == 'orders') {
            return (
                < Orders />
            )
        }else if (view == 'users') {
            return (
                < Users />
            )
        }
        // else if (view == 'settings') {
        //     return (
        //         < Settings />
        //     )
        // }
    }


    // render Product controll views
    const productControllView = (productControllState, id, name, price, desc, category, quantity, img) => {
        setProductControll(productControllState)
        setProduct({
            id, name, price, desc, category, quantity, img
        })
        productControllState != '' ? document.body.style.setProperty('overflow', 'hidden')
        : document.body.style.setProperty('overflow', 'visible');
    }




    // Set Page Title
    document.title = 'Shop - Administration';

    return (
        <>
            { productControll != '' ?
                <div className="overlay" onClick={()=>productControllView('')}></div>
                : null
            }

            <Header />

                <div className="container">
                    <h3 className="admin-dash">Dashboard</h3>
                    <div className="main-content">
                        {/* Sidebar */}
                        <div className="dashboard-side">
                            <span className={view == "products" ? "dash-controls active" : "dash-controls"}  onClick={()=>setView('products')}>{<FaListUl />} Products<br/>
                                <span className="product-create" onClick={()=>productControllView('create-product')}><FaPlus/> Create</span>
                            </span>
                            <span className={view == "orders" ? "dash-controls active" : "dash-controls"}  onClick={()=>setView('orders')} >{<SlBasket />} Orders</span>
                            <span className={view == "users" ? "dash-controls active" : "dash-controls"} onClick={()=>setView('users')} >{<HiUsers />} Users</span>
                            {/* <span className={view == "settings" ? "dash-controls active" : "dash-controls"} onClick={()=>setView('settings')} >{<IoSettings />} Settings</span> */}
                        </div>
                    
                        {/* content */}
                        <div className="content admin">
                            { renderView('products') }
                            { <EditDeleteProduct productControll={productControll} product={product} productControllView={productControllView} /> }
                            { <CreateProduct productControll={productControll} productControllView={productControllView} /> }
                            
                        </div>

                    </div>
                </div>
                



            <Footer />
        </>
    )
}



export default Admin;