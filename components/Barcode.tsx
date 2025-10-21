'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value }:{value:string}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, value, {
                format: 'CODE39', // Choose barcode format
                lineColor: '#000',
                width: 1,
                height: 35,
                displayValue: false,
            });
        }
    }, [value]);

    return <svg className='scale-50' ref={svgRef}></svg>;
};

export default Barcode;
