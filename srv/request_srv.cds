using demo.request from '../db/request';

service RequestService{
    entity Request as projection on request.Request;
    entity Request_state as projection on request.Request_state;

}