// Validation codes from DHIS2 2.42 ValidationCode.java. Deliberately models
// only the actor's me probe and tracker DELETE validation reports.
const http = require('http');
http.createServer(async (req, res) => {
	const url = new URL(req.url, 'http://localhost');
	res.setHeader('Content-Type', 'application/json');
	if (req.method === 'GET' && url.pathname.endsWith('/me')) return res.end('{}');
	if (req.method !== 'POST' || !url.pathname.endsWith('/tracker') || url.searchParams.get('importStrategy') !== 'DELETE') {
		res.statusCode = 501;
		return res.end(JSON.stringify({ message: 'Endpoint not modeled' }));
	}
	const body = req.body;
	const errors = [];
	for (const [key, type, field] of [['trackedEntities', 'TRACKED_ENTITY', 'trackedEntity'], ['enrollments', 'ENROLLMENT', 'enrollment'], ['events', 'EVENT', 'event']]) {
		for (const record of body[key] || []) {
			const uid = record[field];
			const code = uid.match(/E\d{4}/)?.[0];
			if (!code) { res.statusCode = 501; return res.end(JSON.stringify({ message: 'Unknown fixture UID' })); }
			errors.push({ uid, trackerType: type, errorCode: code, args: [uid], message: 'Record is absent' });
		}
	}
	const report = { status: 'ERROR', validationReport: { errorReports: errors, warningReports: [] } };
	res.statusCode = errors.some(error => error.uid.includes('conflict')) ? 409 : 200;
	res.end(JSON.stringify(res.statusCode === 409 ? { httpStatusCode: 409, response: report } : report));
}).listen(process.env.PORT || 4500);
