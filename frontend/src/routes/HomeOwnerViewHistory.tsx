import React, { useState, useEffect } from 'react';
import '../css/HomeOwnerViewHistory.css';
import { Link } from 'react-router-dom';

interface UserAccountResponse {
    id: number
    username: string
    userProfile: string
}

interface History {
    cleanerName: string
    typeOfService: string
    price: number
    date: Date
}

const HomeOwnerViewHistory: React.FC = () => {
    const sessionUser: UserAccountResponse = JSON.parse(localStorage.getItem('sessionObject') || '{}');

    const [history, setHistory] = useState<History[]>([])
    const [search, setSearch] = useState('');

    

    return (
        <div>

        </div>
    )
}

export default HomeOwnerViewHistory