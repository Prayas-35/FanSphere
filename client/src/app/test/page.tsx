"use client"

import React from 'react';
import { useSession } from 'next-auth/react';
interface Data {
    data: {
        token: {
            access_token: string;
            refresh_token: string;
        }
    }
}

const DashboardPage: React.FC = () => {
    const session = useSession();
    const { data }: Data = JSON.parse(JSON.stringify(session));
    const [about, setAbout] = React.useState<string>('fake');



    const handleClick = async () => {
        console.log("data", data);
        console.log("data.token:", data.token);
        console.log("data.token.access_token", data.token.access_token);
        console.log("data.token.refresh_token", data.token.refresh_token);

        const response = await fetch('/api/spotify', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data.token.access_token}`,
                Refresh: `Refresh ${data.token.refresh_token}`
            },
        });
        const res = await response.json();
        setAbout(JSON.stringify(res));
        console.log("res", res);
    }

    return (
        <div>
            <button onClick={handleClick}>Click Me</button>
            <p>{about}</p>
        </div>
    );
};

export default DashboardPage;