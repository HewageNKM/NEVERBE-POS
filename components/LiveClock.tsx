import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="w-fit h-fit p-4">
            <div className="flex items-center gap-2">
                <Clock className="h-fit w-fit text-gray-500"/>
                <time className="text-sm font-medium">
                    {time.toLocaleString()}
                </time>
            </div>
        </Card>
    );
};

export default LiveClock;