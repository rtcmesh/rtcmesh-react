import React from 'react';
import { create } from 'react-test-renderer';
import WS from 'jest-websocket-mock';
import mockConsole from 'jest-mock-console';
import ServerConnection from '../ServerConnection';
import SendRequest from '../send_request';

describe('ServerConnection', () => {
    const REACT_APP_SERVER_URL = 'ws: //localhost: 8000/';

    it("Message not handled", () => {
        return new Promise((resolve) => {
            const restoreConsole = mockConsole();
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                console.log('alertCallback:', severity, message);
            };
            const onOpen    = () => {
                SendRequest('retrieve', 'hc_kld-auction_inventory', 'items', null, null);
                server.nextMessage.then((message) => {
                    let data  = JSON.parse(message);
                    server.send(JSON.stringify(data));
                });
            };
            const serverConnection = create(
                <ServerConnection 
                    REACT_APP_SERVER_URL = {REACT_APP_SERVER_URL} 
                    alertCallback = {callback} 
                    onOpen = {onOpen} />
            );
            setTimeout(() => {
                expect(console.log).toHaveBeenCalled();
                server.close();
                restoreConsole();
                resolve();
            }, 5000);
        });
    });

    it("Handle message with unsuccessful response", () => {
        return new Promise((resolve) => {
            const restoreConsole = mockConsole();
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                console.log('alertCallback:', severity, message);
            };
            const onOpen    = () => {
                SendRequest('retrieve', 'hc_kld-auction_inventory', 'items', null, null);
                server.nextMessage.then((message) => {
                    let data  = JSON.parse(message);
                    data.response = { code: 400, test: 'test' };
                    server.send(JSON.stringify(data));
                });
            };
            const serverConnection = create(
                <ServerConnection 
                    REACT_APP_SERVER_URL = {REACT_APP_SERVER_URL} 
                    alertCallback = {callback} 
                    onOpen = {onOpen} />
            );
            setTimeout(() => {
                expect(console.error).toHaveBeenCalled();
                server.close();
                restoreConsole();
                resolve();
            }, 5000);
        });
    });

    it("Show a message when error occurred in server", () => {
        return new Promise((resolve) => {
            const restoreConsole = mockConsole();
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                console.log('alertCallback:', severity, message);
            };
            const onOpen    = () => {
                SendRequest('retrieve', 'hc_kld-auction_inventory', 'items', null, null);
                server.error();                
            };
            const serverConnection = create(
                <ServerConnection 
                    REACT_APP_SERVER_URL = {REACT_APP_SERVER_URL} 
                    alertCallback = {callback} 
                    onOpen = {onOpen} />
            );
            setTimeout(() => {
                expect(console.error).toHaveBeenCalled();
                server.close();
                restoreConsole();
                resolve();
            }, 5000);
        });
    });

    it("Handle message with successful response", () => {
        return new Promise((resolve) => {
            const server    = new WS(REACT_APP_SERVER_URL);
            const callback  = (severity, message) => {
                console.log('alertCallback:', severity, message);
            };
            const onOpen    = () => {
                SendRequest('retrieve', 'hc_kld-auction_inventory', 'items', null, (response) => {
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
                    alertCallback = {callback} 
                    onOpen = {onOpen} />
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
                    alertCallback = {callback} />
            );
            server.close();
        });
    });

});