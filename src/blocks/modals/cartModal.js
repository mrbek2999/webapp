import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Slide from '@mui/material/Slide';
import {useEffect, useState} from "react";
import CloseButton from "react-bootstrap/CloseButton";
import {connect} from "react-redux";
import {deleteCart, editMyCart, getAllCart, messageReset} from "../../store/cart";
import {PatternFormat} from "react-number-format";
import {ordersSave} from "../../store/Orders";
import {toast} from "react-toastify";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function CartModal(props) {
    const [open, setOpen] = useState(false);
    const [allSumCart, setAllSumCart] = useState(0)
    const [cart, setCart] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');




    useEffect(() => {
        props.getAllCart()
    }, [])

    useEffect(() => {
        if(!cart.length){
            handleClose()
        }
        setAllSumCart(props.allSumCart)
    }, [props])

    useEffect(() => {
        setAllSumCart(props.allSumCart)
        if (props.message == 'deleted') {
            props.getAllCart()
        }
        if (!props.cart) {
            props.setIsOpen(false)
        }
        let myModalCart = props.cart
        setCart(myModalCart)
        props.setCartApp(myModalCart)
    }, [props.cart])


    function AddQuantity(product_item) {
        let newNum = product_item['quantity']
        newNum++
        props.editMyCart({...product_item, quantity: newNum})
    }

    function RemoveQuantity(product_item) {
        let newNum = product_item['quantity']
        newNum--
        props.editMyCart({...product_item, quantity: newNum})
    }

    function changePhoneNumber(n){
        const myNewNum = n.replace(/[^0-9\d]/ig, "")
        setPhoneNumber(myNewNum);
    }

    function handleClose() {
        props.setIsOpen(false);
        setOpen(false);
    }

    function deleteProduct(item) {
        props.deleteCart(item)
    }

    useEffect(() => {
        props.getAllCart()
        setOpen(props.isOpen)
    }, [props.isOpen])

    function OrderProducts(e){
        e.preventDefault()
        if(phoneNumber.length < 9 || fullName.length < 3){
            setHasError(true)
        }else{
            setHasError(false)
            const data = {
                buyer: '11',
                fullname: fullName,
                phone_number: "+998"+phoneNumber,
                comment: comment,
                orders: cart
            }
            props.ordersSave(data)
            toast.success('Ваш заказ принял!', {theme: 'colored', draggable: false, autoClose:2000, delay: 10})
            handleClose()
        }
    }

    return (
        <div>
            {props.cart ?
                <Dialog
                    fullScreen
                    open={props.isOpen}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    className={'cart-modal'}
                >
                    <div className={'cart-header'}>
                        <h2 className="h2">В корзине {cart ? cart.length : 0} товара</h2>
                    </div>
                    {cart.map((item, index) =>
                        <div className={'cart-product'} key={index}>
                            <div className={'cart-product-photo'}>
                                <img src={item.product.photo} alt={item.product.title}/>
                            </div>
                            <div className={'cart-product-body'}>
                                <h3>{item.product.title}<DeleteForeverOutlinedIcon onClick={() => deleteProduct(item)}/>
                                </h3>
                                <div className={'addToCartBlock quantityBlock'}>
                                    <h4 className={'price-product'}>{item.product.price * item.quantity} сум</h4>
                                    <div className={'counter'}>
                                        <button onClick={() => RemoveQuantity(item)}
                                                disabled={item.quantity === 1 ? true : false}
                                                className={`quantityBtn`}>-
                                        </button>
                                        <span className={'quantity'}>{item.quantity}</span>
                                        <button onClick={() => AddQuantity(item)} className={'quantityBtn'}>+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="checkout">
                        <div className="cart-form__cart-section cart-section">
                            <div className="cart-section__header">
                                <h2 className="h2">Ваши данные</h2></div>
                            <div className="cart-section__body">
                                <form className="similar-auth" onSubmit={OrderProducts}>
                                    <div>
                                        <label className="similar-auth__label">
                                            Имя и фамилия</label>
                                        <input type="text" className="input" required min={3}
                                               onChange={(e)=>setFullName(e.target.value)}/>
                                        {fullName.length < 3 && fullName
                                            ? <span role={'alert'} className={'d-block validation-error'}>Длина поля "Имя и фамилия" должна быть не менее 3</span>
                                            : !fullName && hasError ? <span role={'alert'} className={'d-block validation-error'}>Обязательное поле</span> : ''}
                                    </div>
                                    <div>
                                        <label className="similar-auth__label">
                                            <span className="">Телефон</span>
                                        </label>
                                        <div className="phone-input">
                                            <div className="phone-input__prefix">
                                                <div className="phone-input__prefix-value">+998</div>
                                            </div>
                                            <PatternFormat
                                                type="tel"
                                                className="input _phone"
                                                format="## ### ## ##"
                                                mask=" "
                                                onValueChange={value => changePhoneNumber(value.formattedValue)}
                                                required
                                            />
                                        </div>
                                        {phoneNumber.length !== 9 && phoneNumber
                                            ? <span role={'alert'} className={'d-block validation-error'}>Длина поля номера телефона должна быть 9</span>
                                            : !phoneNumber && hasError ? <span role={'alert'} className={'d-block validation-error'}>Обязательное поле</span> : ''}
                                    </div>
                                    <div>
                                        <label className="similar-auth__label">
                                            Комментарий</label>
                                        <textarea className="input"
                                               onChange={(e)=>setComment(e.target.value)}/>
                                    </div>
                                    <div className="checkout-price">
                                        <h4 className="cart-form__sidebar-price-label">Итого:</h4>
                                        <div className="price">
                                            <h4 className="price__main">{numberWithSpaces(allSumCart)} сум</h4>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn__red btn__big _fw btn-order">Оформить заказ</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <CloseButton onClick={handleClose} className={'close-btn'}/>
                </Dialog>
                : ''}
        </div>
    );
}

export default connect(props => props.cart, {
    getAllCart, deleteCart,
        editMyCart, ordersSave, messageReset
})(CartModal)