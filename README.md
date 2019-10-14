# rtcmesh-react
React component for communicating with the rtcmesh-server

Will publish on npm when ready; targeting the end of October 2019.

## How to use it

In `App.js` add the component passing the server url and the alert callback.  Ex.

```
alert_callback = (severity, message) => {
	console.log(severity, message);
}

render() {
	return (
	  <div className="App">
		<ServerConnection  REACT_APP_SERVER_URL={process.env.REACT_APP_SERVER_URL} alert_callback={this.alert_callback} />
	  </div>
	);
}

```
Once connected you can send a message. The callback will be called when the response comes back.

```
my_callback = (data) => {
	console.log(data)
}

send_request = (action, service, resource, parameters, this.my_callback);
```

## Testing

```
npm install
npm test
```
