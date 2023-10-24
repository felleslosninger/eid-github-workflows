const fetch = require('cross-fetch');

module.exports.truncate_bucket = function(bucket) {
  console.log("Bucket:", bucket);
  const timeInterval = {
    start: "2023-01-01T00:00:00.00Z",
    stop: (function() {
      const date = new Date();
      const month = String(date.getMonth()+1).padStart(2, '0');
      const day = String(date.getDate()+1).padStart(2, '0');
      const stopPoint = date.getFullYear() + "-" + month + "-" + day + "T00:00:00.00Z";
      return stopPoint;
    }())
  }
  const url = `https://westeurope-1.azure.cloud2.influxdata.com/api/v2/delete?bucket=${bucket}`;
  const response = fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${process.env.INFLUXDB_TOKEN}`
    },
    body: JSON.stringify(timeInterval),
  }).then(response => {
    if (!response.ok) {
      console.error("Status:", response.status, response.statusText);
      throw new Error(`An error has occured: ${response.status} url: ${response.url}`);
    } else {
      console.log("Successfully truncated bucket");
    }
  }).catch(error => {
      console.error(error.message);
  });
}

module.exports.write_to_bucket = function(bucket, data) {
  const url = `https://westeurope-1.azure.cloud2.influxdata.com/api/v2/write?org=eid&bucket=${bucket}&precision=ns`;
  setTimeout(function () {
    const response = fetch(url, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": `Token ${process.env.INFLUXDB_TOKEN}`,
        "Content-Type": "text/plain; charset=utf-8"
      },
      body: data
    }).then(response => {
      if (!response.ok) {
        console.error("Status:", response.status, response.statusText);
        throw new Error(`An error has occured: ${response.status} url: ${response.url}`);
      } else {
        console.log("Successfully added data to bucket");
      }
    }).catch(error => {
      console.error(error.message);
    });
  },1000);
}
