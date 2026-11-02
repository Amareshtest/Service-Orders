const cdsLog = require("@sap/cds/lib/log/cds-log");
const cds = require('@sap/cds');

module.exports = (srv) => {

    srv.before('CREATE', 'ServiceRequests', (req) => {

        const { customerName, title, priority } = req.data;

        // Validate mandatory fields
        if (!customerName?.trim() || !title?.trim()) {
            return req.reject(400, 'Customer name and title are mandatory');
        }

        // Validate priority
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

        if (!validPriorities.includes(priority)) {
            return req.reject(400, 'Invalid priority');
        }

        // Set default status
        req.data.status = 'OPEN';

    });

    
srv.before('UPDATE', 'ServiceRequests', async (req) => {

    console.log('UPDATE HANDLER EXECUTED');

    const { status, priority } = req.data;

    const validStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

    if (status !== undefined && !validStatuses.includes(status)) {
        return req.reject(400, 'Invalid status');
    }

    if (priority !== undefined && !validPriorities.includes(priority)) {
        return req.reject(400, 'Invalid priority');
    }

    if (status !== undefined) {

        const existingRequest = await cds.tx(req).run(
            SELECT.one.from(req.subject)
        );

        if (!existingRequest) {
            return req.reject(404, 'Service request not found');
        }

        console.log('OLD STATUS:', existingRequest.status);
        console.log('NEW STATUS:', status);

        if (
            existingRequest.status === 'CLOSED' &&
            status !== 'CLOSED'
        ) {
            return req.reject(
                400,
                'Once closed, a request cannot be reopened'
            );
        }
    }

    console.log('UPDATE validation passed');
});





};