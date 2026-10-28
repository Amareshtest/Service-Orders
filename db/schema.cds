namespace vehicle.service;
entity ServiceRequests {
    key ID       : UUID;
    customerName : String(100);
    title        : String(200);
    priority     : String(20);
    status       : String(20) default 'OPEN';
}
