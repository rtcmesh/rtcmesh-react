import React from 'react';
import { create } from 'react-test-renderer';
import WS from 'jest-websocket-mock';
import ServerConnection from '../ServerConnection';
import send_request from '../send_request';

describe('ServerConnection', () => {
    const REACT_APP_SERVER_URL = 'ws: //localhost: 8000/';

    it("Handle message.", () => {
        return new Promise((resolve) => {
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                console.log('alert_callback:', severity, message);
            };
            const onopen    = () => {
                send_request('retrieve', 'hc_kld-auction_inventory', 'items', null, (response) => {
                    expect(response.code).toBe(200);
                    expect(response.test).toBe('test');
                    server.close();
                    resolve();
                });
                server.nextMessage.then((message) => {
                    let data  = JSON.parse(message);
                    data.response = { code: 200, test: 'test' };
                    server.send(JSON.stringify(data));
                });
                
            };
            const serverConnection = create(
                <ServerConnection 
                    REACT_APP_SERVER_URL = {REACT_APP_SERVER_URL} 
                    alert_callback = {callback} 
                    onopen = {onopen} />
            );
        });
    });

    it("Trying to reconnect when server closed.", () => {
        return new Promise((resolve) => {
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                expect(severity).toBe('danger');
                expect(message).toBe('Connection to server LOST - Trying to reconnect...');
                resolve();
            };
            const serverConnection = create(
                <ServerConnection 
                    REACT_APP_SERVER_URL = {REACT_APP_SERVER_URL} 
                    alert_callback = {callback} />
            );
            server.close();
        });
    });

});