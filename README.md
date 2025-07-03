# Family Frontend

This project is a small HTML/JS interface that talks to a separate backend service. The constant `API_BASE` in [`js/app.js`](js/app.js) defines the base URL of that API. Adjust this value if you deploy the backend somewhere else.

The browser must be able to reach the backend. When running the frontend locally while the backend is on another host you might run into CORS errors. Make sure the backend allows your origin or serve both under the same domain.

## Serving the frontend

Use any static HTTP server to serve `index.html`. Two quick options are:

```bash
python3 -m http.server 8080
```
then open <http://localhost:8080/>, or with Node.js:

```bash
npx http-server .
```

## Sample data and offline use

The file [`js/familyData.js`](js/familyData.js) contains optional example data. As long as this script is included in `index.html` the app can run without a backend, showing the sample family tree. Remove or comment out the script tag if you want to rely solely on backend data. Without a backend running, only the tree view based on this sample data will work and other features will be limited.
