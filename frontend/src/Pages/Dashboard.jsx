import React from 'react';
import AddAuction from './AddAuction';
import AuctionList from './AuctionList';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <AddAuction />
            <AuctionList />
        </div>
    );
};

export default Dashboard;