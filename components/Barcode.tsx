'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value }:{value:string}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, value, {
                format: 'CODE128', // Choose barcode format
                lineColor: '#000',
                width: 2,
                height: 40,
                displayValue: false,
            });
        }
    }, [value]);

    return <svg ref={svgRef}></svg>;
};

export default Barcode;
