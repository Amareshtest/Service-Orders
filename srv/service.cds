
using { vehicle.service as db } from '../db/schema';

@path: '/vehicle'
service VehicleService {
    entity ServiceRequests as projection on db.ServiceRequests;
}
