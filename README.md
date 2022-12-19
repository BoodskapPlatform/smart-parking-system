# How to start the Smart Parking System?

### Getting Started
This plugin requires node `>= 6.0.0` and npm `>= 1.4.15` (latest stable is recommended).

```shell
> git clone https://github.com/BoodskapPlatform/boodskap-ui
```

Once the repository has been cloned:
```shell
> cd smart-parking-system
```

### NPM Module Installation

```shell
> npm install
```

## Configuration

### Properties
In `smartparking.properties` file,
```shell
#default property
[server]
port=4201
basepath=
ssl=false

[env]
development=false

[boodskap]
api=/api
cdnPath=https://cdn.jsdelivr.net/gh/BoodskapPlatform/cdn

[mqtt]
host=your_host_or_ip
port=80
ssl=false

[web]
domain=http://your.domain.name
debug=false

[google]
analytics.id=
```
To change the UI port, update the server property

#### Note
If you are downloading the platform (or) running in our own dedicated server.You may have to change the `boodskap` and `mqtt` property

### Build Properties
Once all the changes done in property file. Execute a command
```shell
> npm run-script build
```
or
```shell
> node build.js

> node build.js <CONFIG_PATH>
```
#### Output

```shell
***************************************
Boodskap - Smart Parking System
***************************************
1] Setting server properties success
2] Setting web properties success
Thu Jan 10 2019 14:09:22 GMT+0530 (IST) | Boodskap UI Build Success
Now execute > npm start
```

### How to start the UI node server?

```shell
> npm start
```
or
```shell
> node server.js
```
#### Output

```shell
************************************************************************************
Thu Jan 10 2019 14:11:51 GMT+0530 (IST) | Boodskap - Smart Parking System Listening on 4201
************************************************************************************
```
Open the Brower with this URL: http://0.0.0.0:4201
