# Frea
An IOS and Android app that notifies people of freebies, events, parties, and many other things that are nearby their area.

### Server-side
Frea uses [Express](https://expressjs.com/), [Socket.IO](https://socket.io/), and [MySQL](https://www.mysql.com/) for the server-side.
- Express is used to run the web-server
- Socket.IO is used to run the socket server, which wraps around the Express server
- MySQL is the database management server

Configure the server properties in the ```server.json``` file located in the ```config``` directory of the project.
- ```serverDomain``` is the public domain of your web-server
- ```serverPort``` is the port of your web-server
- ```dbHost``` is the host of your MySQL database
- ```dbUser``` is the user to access your MySQL database
- ```dbPassword``` is the password of the user
- ```dbName``` is the name of your MySQL database

Then setup the database by importing the ```frea.sql``` file in MySQL. The file is located in the ```app/sql``` directory of the project.

Once ```server.json``` is configured and the database is setup, install the server-side dependencies by running:
```console
cd app/server
npm install
```

Once the server-side dependencies are installed, start the server by running:
```console
cd app/server
node Index.js
```
- The server <b>must</b> be started in the ```app/server``` directory or uploading errors will occur

### Client-side
Frea uses React Native for the client-side, specifically with [Expo](https://expo.io/).

Install the client-side dependencies by running:
```console
npm install
```

Once the client-side dependencies are installed, start the Expo app by running:
```console
expo start
```
then follow the instructions on the console to load the app on your phone or emulator.

### Expo MapView
Frea uses Google Maps for Android phones and Apple Maps for IOS phones.

In order to render the map, Frea uses Expo's [MapView](https://docs.expo.io/versions/latest/sdk/map-view/), which is a Map component that uses Google or Maps on Android or IOS phones, respectively.

MapView will work when testing on the Expo client, but when publishing to the Apple or Google Play store the MapView will not render due to API key limitations.

In order for the map to render once publishing the app, follow the instructions from the Expo documentation [here](https://docs.expo.io/versions/latest/sdk/map-view/).

### SMTP Service
Frea uses the ```nodemailer``` package to send emails from the the server to users.

To setup SMTP, edit the ```email_service.json``` using your SMTP service. The file is located in the ```config/email``` directory.
