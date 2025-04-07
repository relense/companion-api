function decodeHeader(req, headerName) {
    const val = req.headers[headerName];
    if (val != undefined) {
        return val.toString();
    }
}
export { decodeHeader };
