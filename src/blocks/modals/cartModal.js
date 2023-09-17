import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {useEffect, useState} from "react";
import CloseButton from "react-bootstrap/CloseButton";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const [open, setOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);


    function AddQuantity(){
        setQuantity(quantity+1)
    }
    function RemoveQuantity(){
        setQuantity(quantity-1)
    }

    function handleClose() {
        setOpen(false);
        props.setIsOpen(false);
    }

    useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])


    return (
        <div>
            {props.item ?
                <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    className={'product-order'}
                >
                    <img src={props.item.photo} width={100} height={220} alt={props.item.title} />
                    <h3>{props.item.title}</h3>
                    <p>{props.item.description}</p>
                    <div className={'addToCartBlock'}>
                        <h4 className={'price-product'}>{quantity*props.item.price} сум</h4>
                        <div className={'counter'}>
                            <p>Количество</p>
                            <button onClick={RemoveQuantity} disabled={quantity===1 ? true : false} className={`quantityBtn`}>-</button>
                            <span className={'quantity'}>{quantity}</span>
                            <button onClick={AddQuantity} className={'quantityBtn'} >+</button>
                        </div>
                        <button className={'addToCartBtn'}>Добавить в корзину</button>
                    </div>
                    <CloseButton className={'close-btn'} onClick={handleClose}/>
                </Dialog>
                : <div>Loading...</div>}
        </div>
    );
}