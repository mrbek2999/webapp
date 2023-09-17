import {connect} from "react-redux";
import {useEffect, useState} from "react";
import Dialog from '@mui/material/Dialog';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";
import {deleteDocument} from "../store/documents";

function DeleteDocument(props){
    const {t, i18n} = useTranslation()

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
        props.setOpen(false)
        props.setOpenItem(false)
    };

    function toDelete(){
        props.deleteDocument(props.openItem)
        props.setOpen(false)
        props.setOpenItem(false)
    }

    useEffect(()=>{
        if(props.open){
            setOpen(props.open)
        }
    }, [props])

    return <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className={'delete-modal'}>
                <div className="icon">
                    <HighlightOffIcon color={'error'}/>
                </div>
                <h2>{t('delete_title')}</h2>
                <p>{t('delete_desc')}</p>
                <p>{t('delete_desc_plus')}</p>
                <div className="buttons">
                    <Button variant="contained" className={'cancel-btn'} onClick={handleClose}>
                        {t('cancel')}
                    </Button>
                    <Button variant="contained" className={'delete-btn'} onClick={toDelete}>
                        {t('delete')}
                    </Button>
                </div>
            </div>
        </Dialog>
    </div>
}
export default connect(props => props.documents, {deleteDocument})(DeleteDocument)