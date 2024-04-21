import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { BrowserRouter as Router, RouterProvider, Routes, Route, Navigate } from 'react-router-dom';

//import UserContext
import { UserContext } from "./Auth/Context/UserContext";

import Home from "./Pages/Home";
import Cart from "./Pages/Cart";
import Admin from "./Admin/Admin";
import NotFound from "./Pages/NotFound";

import Register from "./Auth/Register";
import Login from "./Auth/Login";
import RegistrationMsg from "./Auth/RegistrationMsg";
import Checkout from "./Pages/Checkout";
import PaymentSuccess from "./Pages/PaymentSuccess";
import UserVerification from "./Pages/UserVerification";
import PrivateRoutes from "./Routes/PrivateRoutes";
import NotAuthRoutes from "./Routes/NotAuthRoutes";


const App = () => {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemsInCart, setItemsInCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

   

    useEffect(()=>{
        // Get List Of Products
        const getProducts = async () => {
            try {
                const response = await axios.get('/api/products', {"Content-Type":"application/json"});
                setProducts(response.data);
                setLoading(false);
            }catch(err){
                console.log(err)
            }
        }
        getProducts();
    },[]);

    
    
    //Add Product to cart
    const addToCart = (id) => {
        let cProduct = products.filter(product => product.id == id);
        let clickedProduct = {...cProduct[0], ...{itemQntity: 1}};
        setItemsInCart( itemsInCart => itemsInCart.concat(clickedProduct) );
        setTotalPrice(totalPrice + clickedProduct.price);
        //add class animation when product added to cart 
        document.querySelector('.added-cart-msg').classList.add('msg_animation')
        setTimeout(()=>{document.querySelector('.added-cart-msg').classList.remove('msg_animation')}, 1500)
    }


        // Set Product Quantity and price to shop
        const setQntity = (id, btn, price, i) => {
            let clickedProduct = itemsInCart.filter(product => product.id == id);
            let productsNotClicked = itemsInCart.filter(product => product.id != id);
            const items = itemsInCart;
            if(btn == 'increase'){
                if(items[i].itemQntity > 0){
                    items[i].itemQntity++;
                    setItemsInCart(items);
                    setTotalPrice(totalPrice + price);
                }
            }else{
                if (clickedProduct[0].itemQntity <= 0){
                    return false;
                }else{
                    if(items[i].itemQntity > 1){
                        items[i].itemQntity--;
                        setItemsInCart(items);
                        setTotalPrice(totalPrice - price);
                    }
                }
            }
        }
    


        //Delete item from cart
        const deleteItem = (id) => {
            const items = itemsInCart.filter(item => item.id != id);
            setItemsInCart(items);
            
            let tot = 0;
            for(let i=0; i<items.length; i++){
                tot += (items[i].price * items[i]. itemQntity );
            }
            setTotalPrice(tot);
        }



    return (

        <Router>
            <Routes>
                <Route exact path="/" element={ <Home products={products} setProducts={setProducts} loading={loading} setLoading={setLoading} itemsInCart={itemsInCart} addToCart={(id, e)=>addToCart(id, e)} /> } />
                <Route path="/cart" element={ <Cart products={products} itemsInCart={itemsInCart} totalPrice={totalPrice}  setQntity={setQntity} deleteItem={deleteItem} /> } />
                <Route path="/checkout" element={ <Checkout user={user} itemsInCart={itemsInCart} totalPrice={totalPrice} setItemsInCart={setItemsInCart} setTotalPrice={setTotalPrice}  />    } />
                
                <Route element={<PrivateRoutes />} >
                    <Route path="/admin" element={ <Admin products={products} loading={loading}  />  } />
                </Route>

                <Route element={<NotAuthRoutes />} >
                    <Route path="/register" element={ <Register /> } />
                    <Route path="/success" element={ <RegistrationMsg /> } />
                    <Route path="/login" element={ <Login /> } />
                </Route>
                

                
                <Route path="/payment/success" element={ <PaymentSuccess /> } />
                <Route path="/account/activation" element={ <UserVerification /> } />


                <Route path="/*" element={ <NotFound  /> } />
            </Routes>
        </Router>
    
    )
}

export default App;