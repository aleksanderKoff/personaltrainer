import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import AddTraining from './AddTraining';

function Customerlist() { 
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [gridApi, setGridApi] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    };

    const onBtnExport = () => {
        gridApi.exportDataAsCsv();
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    };

    const deleteCustomer = (url) => {
        if (window.confirm('Are you sure?')) {
            fetch(url, { method: 'DELETE'})
            .then(response => {
                if (response.ok) {
                    setMsg('Customer deleted');
                    setOpen(true);
                    fetchCustomers();
                }
                else {
                    alert('Something went wrong!');
                }
            })
            .catch((err) => console.error(err));
        }
    };

    const addCustomer = customer => {
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then((response) => fetchCustomers())
        .catch((err) => console.error(err));
    };

    const editCustomer = (link, updatedCustomer) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        })
        .then(response => {
            if (response.ok) {
                setMsg('Customer info updated')
                setOpen(true);
                fetchCustomers();
            }
            else {
                alert('Something went wrong!');
            }
        })
        .catch((err) => console.error(err));
    };

    const addTraining = training => {
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(training)
        })
        .then((response) => fetchCustomers())
        .catch((err) => console.error(err));
    };

    const columns = [
        {field: 'firstname', sortable: true, filter: true},
        {field: 'lastname', sortable: true, filter: true},
        {field: 'streetaddress', sortable: true, filter: true},
        {field: 'postcode', sortable: true, filter: true},
        {field: 'city', sortable: true, filter: true},
        {field: 'email', sortable: true, filter: true},
        {field: 'phone', sortable: true, filter: true},
        {
            headerName: "",
            sortable: false,
            filter: false,
            width: 90,
            field: "links[0].href",
            cellRendererFramework: params => (
                <AddTraining addTraining={addTraining} row={params}  />
            )
        },
        {
            headerName: "",
            sortable: false,
            filter: false,
            width: 120,
            field: "links[0].href",
            cellRendererFramework: params => (
                <EditCustomer editCustomer={editCustomer} row={params}  />
            )
        },
        {
            headerName: "",
            sortable: false,
            filter: false,
            width: 120,
            field: "links[0].href",
            cellRendererFramework: params => (
                <Button
                    size="small"
                    color="error"
                    onClick={() => deleteCustomer(params.data.links[0].href)}
                >
                Delete
                </Button>
            )
        }
    ];
    
    return(
        <div>
            <AddCustomer addCustomer={addCustomer} />
            <Button onClick={() => onBtnExport()}>Download CSV File</Button>
            <div className="ag-theme-material" style={{height: 800, width: '90%', margin:'auto'}}>
                <AgGridReact
                    defaultColDef={{
                        editable: true,
                        resizable: true,
                        minWidth: 100,
                        flex: 1,
                    }}
                    suppressExcelExport={true}
                    popupParent={document.body}
                    rowData={customers}
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellSelection={false}
                    onGridReady={onGridReady}
                />
            </div>
            <Snackbar
                open={open}
                message={msg}
                autoHideDuration={3000}
                onClose={handleClose}
            />
        </div>
    );
}

export default Customerlist;