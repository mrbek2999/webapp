import {connect} from "react-redux";
import {getAlLDocuments, messageReset} from "../store/documents";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllVerifyResponse} from "../store/logIn";
import DownloadIcon from '@mui/icons-material/Download';
import Header from "../blocks/header";
import Dashboard from "../blocks/dashboard";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import Box from "@mui/material/Box";
import Copyright from "../blocks/copyright";
import {useTranslation} from "react-i18next";
import ReactPaginate from "react-paginate";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteDocument from "../blocks/deleteDocument";
import {toast} from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function Documents(props) {
    const is_main = JSON.parse(localStorage.getItem('is_main'));
    const navigate = useNavigate()
    const params = useParams()
    const [regionId, setRegionId] = useState(false)
    useEffect(()=>{
        setRegionId(params.id)
    }, [params.id])
    const toBack = () => {
        navigate(-1);
    }
    const {t, i18n} = useTranslation()
    const [documents, setDocuments] = useState([])
    const [open, setOpen] = useState(false)
    const [openItem, setOpenItem] = useState(false)

    useEffect(() => {
        if (props.message === 'deleted') {
            toast.success(t('delete_success'), {theme: 'colored'})
            setOpenItem(false)
            props.messageReset()
        } else if (props.message === 'error') {
            toast.error(t('save_error'), {theme: 'colored'})
            props.messageReset()
        } else if (props.message === true) {
            toast.success(t('save_success'), {theme: 'colored'})
            props.messageReset()
        }
    }, [props.message])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            const data = {
                "token": JSON.parse(token)
            }
            props.getAllVerifyResponse(data)
        }
        props.getAlLDocuments()
    }, [])

    useEffect(() => {
        if (props.verify === false) {
            navigate("/login/");
        }
        setDocuments(props.documents)
    }, [props])


    // Pagination

    const [itemsPerPage, setItemsPerPage] = useState(10)

    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = documents.filter(item=>regionId ? item.user.id == regionId : item).slice(itemOffset, endOffset);
    const pageCount = Math.ceil(documents.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % documents.length;
        setItemOffset(newOffset);
    };

    if (pageCount !== 0 && currentItems.length === 0 && documents.filter(item=>regionId ? item.user.id == regionId : item).length !== 0) {
        let li_lenght = document.querySelectorAll('.pagination ul li').length
        document.querySelectorAll('.pagination ul li')[li_lenght - 2].previousSibling.className = 'selected'
        const data = {"selected": pageCount - 1}
        handlePageClick(data)
    }

    function toAdd() {
        navigate('/add-document/')
    }

    function toEdit(data) {
        navigate('/edit-document/' + data.id)
    }

    function toDelete(item) {
        setOpenItem(item)
        setOpen(true)
    }

    return <div>
        <div className={'page worker-page documents'}>
            {open ? <DeleteDocument setOpenItem={setOpenItem} openItem={openItem} open={open} setOpen={setOpen}/> : ''}
            <Header/>
            <Dashboard/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}>
                <Toolbar/>
                <div className={'main'}>
                        <Button variant="outlined" startIcon={<ChevronLeftIcon />} onClick={toBack}>
                            {t('back')}
                        </Button>
                    <div className={'header-page'}>
                        <h2 className={'page-title'}>{t('required_documents')}</h2>
                        {regionId ? '' : <Button variant="contained" title={t('add_document')} endIcon={<AddIcon/>}
                                              onClick={toAdd}>
                            {t('add_document')}
                        </Button>}

                    </div>
                    {currentItems.length ? <table className="table table-hover table-responsive ">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            {is_main ? <th scope="col">{t('title_company')}</th> : ''}
                            <th scope="col">{t('document_title')}</th>
                            <th scope="col">{t('download')}</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.length ? currentItems.map((item, index) => <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                {is_main ? <td>{item.user.user_name ? item.user.user_name : 'ADMIN'}</td> : ''}
                                <td>{item.title}</td>
                                <td><a href={item.file} target={'_blank'}><DownloadIcon title={t('download')}/></a></td>
                                {is_main || !item.user.is_main ?
                                    <td>
                                        {is_main ? <Button variant="contained" title={"O'zgartirish"} color={"info"}
                                                          endIcon={<EditIcon/>}
                                                          onClick={() => toEdit(item)}/> : ''}
                                        <Button variant="contained" title={"O'chirish"} color={"error"}
                                                endIcon={<DeleteIcon/>}
                                                onClick={() => {
                                                    toDelete(item)
                                                }}
                                        />
                                    </td>
                                    : <td style={{minHeight:"42px"}}/>}
                            </tr>)
                            :
                            ''
                        }
                        </tbody>
                    </table> : ''}
                    {pageCount > 1 ? <div className={'pagination'}>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel={<KeyboardArrowRightIcon/>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel={<KeyboardArrowLeftIcon/>}
                            renderOnZeroPageCount={null}
                        />
                    </div> : ''}
                </div>
                <Copyright/>
            </Box>
        </div>
    </div>
}

export default connect(props => props.documents, {getAlLDocuments, getAllVerifyResponse, messageReset})(Documents)