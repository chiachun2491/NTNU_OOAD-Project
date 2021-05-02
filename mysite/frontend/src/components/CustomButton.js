import React from "react";

import {Button} from 'react-bootstrap';


const CustomButton = (props) => {
    return (
        <Button variant='brown' className='btn-round my-3' size="" block > {props.children}</Button>
    );
};


export default CustomButton;