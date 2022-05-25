import React, { useState, useEffect } from 'react';
// import './SchedulaeUIcomp.css'
import { Form, Button } from "react-bootstrap";

function SchedularUIcomp(props) {
    const optionList = ["Apple", "Apple", "Apple"];
    const [showDropdown, setshowDropdown] = useState(false)
    const [Data, setData] = useState([true, false, true])
    const [numberSelected, setnumberSelected] = useState(null)
    
    useEffect(() => {
        let numselected = Data.map((option) => option ? 1 : 0).reduce((a, b) => a + b, 0);
        setnumberSelected(numselected);
    }, [Data])

    return (
        <div style={{ zIndex: '2', width: '200px' }}>
            <div onClick={() => { setshowDropdown(!showDropdown) }} className='border rounded  justify-content-center align-items-center d-flex px-2' style={{ height: '36px', textAlign: 'center' }}>
                <div >Select the value {numberSelected} </div>
                <div style={{ marginLeft: 'auto' }}><i className="fas fa-chevron-down"></i></div>
            </div>
            {showDropdown && <div className="search-drop-down border rounded mt-1" style={{ marginTop: '0px', position: 'absolute', width: '200px' }}>
                {
                    optionList.map((option, index) => {
                        return <><input type="checkbox" id={'SchedularUIcheckbox' + index} onChange={() => {
                            let tempData = [...Data];
                            tempData[index] = !tempData[index];
                            setData(tempData)
                        }} checked={Data[index]} />
                            <label for={'SchedularUIcheckbox' + index}> {option}</label>
                            <br /></>
                    })
                }

            </div>}
        </div>
    );
}

export default SchedularUIcomp;