# rtcmesh-react
React component for communicating with the rtcmesh-server

## How to use it

In `App.js` add the component passing the server url and the alert callback.  Ex.

```
alertCallback = (severity, message) => {
	console.log(severity, message);
}

render() {
	return (
	  <div className="App">
		<ServerConnection  REACT_APP_SERVER_URL={process.env.REACT_APP_SERVER_URL} alertCallback={this.alertCallback} />
	  </div>
	);
}

```
Once connected you can send a message. The callback will be called when the response comes back.

```
my_callback = (data) => {
	console.log(data)
}

SendRequest = (action, service, resource, parameters, this.my_callback);
```

## Testing

```
npm install
npm test
```
