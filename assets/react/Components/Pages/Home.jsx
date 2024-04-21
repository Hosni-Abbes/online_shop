import React, { useEffect, useState } from "react";
import axios from 'axios';

import Header from '../Partials/Header';
import Footer from "../Partials/Footer";

import { BsSearch } from "react-icons/bs";
import { BsFilter } from "react-icons/bs";
import { BiFilterAlt } from "react-icons/bi";


const Home = ({setProducts, products, loading, setLoading, itemsInCart, addToCart}) => {
    const [advancedFilter, setAdvancedFilter] = useState(false);
    const [filterParams, setFilterParams] = useState({
        sword: '',
        category: '',
        minPrice: 0,
        maxPrice: ''
    });


    useEffect(()=>{
        // Filter Products
        const filterProducts = async () => {
            setProducts([]);
            try{
                const response = await axios(`/api/products/filter?sword=${filterParams.sword}&category=${filterParams.category}&min_price=${filterParams.minPrice}&max_price=${filterParams.maxPrice}`);
                setProducts(response.data);
                setLoading(false);
            }catch (error){
                console.log(error);
            }
        }
        filterProducts();
    },[filterParams]);


    // console.log(products);
    // Set Page Title
    document.title = 'Shop - Home';
    return (
        <>
            <Header itemsCount = {itemsInCart?.length} />

            <div className="container">


                {/* <h1 className="headings">Home</h1> */}
                <div className="main-content home-filter">
                    
                    <div className={advancedFilter ? "show-filter filter-products" : "filter-products d-none"}>
                        <div className="sticky">
                            <span className="close" onClick={()=>{ setAdvancedFilter(false); setFilterParams({sword: '',category: '',minPrice: 0,maxPrice: ''}); setLoading(true) }}>x</span>
                            <h4 className="sh-c-heading">Advanced filter</h4>
                            <div className="search-product">
                                <span><BsSearch /></span>
                                <input type="text" placeholder="Search for product" value={filterParams.sword} onChange={e => {setFilterParams({...filterParams, sword:e.target.value});setLoading(true) }}/>
                            </div>
                            <div className="search-product">
                                <span><BiFilterAlt /></span>
                                <select name="select-category" id="" value={filterParams.category} onChange={e => {setFilterParams({...filterParams, category:e.target.value});setLoading(true) }}>
                                    <option value="">Category</option>
                                    <option value="Computers and Multimedia">Computers and Multimedia</option>
                                    <option value="Vehicles">Vehicles</option>
                                    <option value="Clothing and Shoes">Clothing and Shoes</option>
                                    <option value="Beauty and Accessories">Beauty and Accessories</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                            <div className="search-product">
                                <small>Price ($)</small>
                                <input className="price" type="number" placeholder="Min" value={filterParams.minPrice} onChange={e => {setFilterParams({...filterParams, minPrice:e.target.value});setLoading(true) }} />
                                <input className="price" type="number" placeholder="Max" value={filterParams.maxPrice} onChange={e => {setFilterParams({...filterParams, maxPrice:e.target.value});setLoading(true) }} />
                            </div>
                        </div>
                    </div>
                    <div className="content normal">
                        <div className={advancedFilter ? "filter d-none" : "filter"}>
                            <div className="search-product">
                                <span><BsSearch /></span>
                                <input type="text" placeholder="Search for product" value={filterParams.sword} onChange={e => {setFilterParams({...filterParams, sword:e.target.value});setLoading(true) }} />
                            </div>
                            <div className="advanced-filter">
                                <span onClick={()=>setAdvancedFilter(true)}>
                                    <BsFilter /> 
                                    Advanced filter
                                </span>
                            </div>
                        </div>
                        <div className="products-list">
                            {
                                loading && <h3 className="loading">Loading...</h3>
                            }
                            
                            {
                                products?.length ?
                                <>
                                    {
                                    products && products.map(product => (
                                        <div key={product.id} className="product-item">
                                            <div className="product-img-container">
                                                <img src={product.image[0]?.src ? product.image[0].src : '' } alt={product.title} />
                                            </div>
                                            <h4 className="product-item-title">{product.title}</h4>
                                            <p className="product-item-desc">{product.desc}</p>
                                            <span className="product-item-price">{product.price}$</span>

                                            <p className={itemsInCart.filter(item => item.id == product.id)?.length ? 'add-to-cart btn-disable' : 'add-to-cart'} onClick={(e)=>{addToCart(product.id,e)}}>Add to cart</p>
                                        </div>
                                    ))}
                                    <div className="added-cart-msg">
                                        <span>Product added to cart.</span>
                                    </div>
                                </>
                                : 
                                
                                    !loading  ? 
                                        <div className='no-products-found'>
                                            <p> No products found! </p>
                                        </div>
                                    
                                    : ''
                                
                            }


                        </div>
                    </div>
                </div>
            </div>
            

            <Footer />
        </>
    
    )
}

export default Home;