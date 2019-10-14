//Load HTTP module

const http = require("http");
const axios = require("axios");

const hostname = "192.168.56.101";//the ip address to host and access this server
const port = 8000;//the port where this server is listening

const baseAPIUrl = "http://testapi.com";//the base url where this server should connect
const loginCred = "username:password";//assuming the api takes basic auth
let buff = new Buffer(loginCred);
const basicAuth = "Basic " + buff.toString("base64");
const testUserId = "123456"; //test user id

//Create Http Server
const server = http.createServer((req, res) => {
  var headers = {};//setup header for CORS
  headers["Access-Control-Allow-Origin"] = "http://localhost:8080";
  headers["Access-Control-Allow-Credentials"] = true;
  headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS,DELETE,PUT";
  headers["Access-Control-Allow-Headers"] =
    "Origin, X-Requested-With, Content-Type, Accept";
  res.writeHead(200, headers);

  if (req.method === "OPTIONS") {
      //returns the headers as define above
    res.end();
  } else if (req.method === "PUT") {
    let body = "";
    req
      .on("data", chunk => {
        body += chunk.toString(); // convert Buffer to string
      })
      .on("end", () => {

        //var putPayload = JSON.stringify(body);
        putRequestHandler("/path/to/endpoint", body).then(
          response => {
            console.log(response);
            var registrationResp = JSON.stringify(response.data);
            res.end(registrationResp);
          },
          error => {
            console.log(error);
            res.writeHead(error.response.status, headers);
            var errorResp = JSON.stringify(error.response.data);
            res.end(errorResp);
          }
        );
      });
  } else if (req.method === "GET") {
    switch (req.url) {
      case "/path/to/get1":
        get1Handler("/path/to/mapped/api/endpoint").then(resp => {
          //console.log(resp);
          var allEventsResp = JSON.stringify(resp);
          res.end(allEventsResp);
        });
        break;
      case "/path/to/get2":
        get2Handler(
          `/path/to/mapped/endpoint?userId=${testUserId}`
        ).then(resp => {
          var allEventsResp = JSON.stringify(resp);
          res.end(allEventsResp);
        });
        break;
      default:
        break;
    }
  } else {
    console.log("req", req);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});

const get1Handler = endpoint => {
  return axios
    .get(`${baseAPIUrl}${endpoint}`, {
      headers: { Authorization: basicAuth }
    })
    .then(
      response => {
        return response.data;
      },
      error => error
    );
};

const get2Handler = endpoint => {
  return axios
    .get(`${baseAPIUrl}${endpoint}`, {
      headers: { Authorization: basicAuth }
    })
    .then(
      response => {
        //console.log("getAllEventsHandler", response);
        return response.data;
      },
      error => error
    );
};

const putRequestHandler = (endpoint, body) => {
  return axios.put(`${baseAPIUrl}${endpoint}`, body, {
    headers: {
      Authorization: basicAuth,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
