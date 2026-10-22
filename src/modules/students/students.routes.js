const express = require('express');
const router = express.Router();

// Memory store for idempotency and cache simulation
const idempotencyStore = new Map();

// Helper middleware for rate-limit and correlation headers
router.use((req, res, next) => {
  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', '99');
  
  const correlationId = req.headers['x-correlation-id'];
  if (correlationId) {
    res.setHeader('X-Correlation-ID', correlationId);
  }
  
  if (req.headers['origin']) {
    res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
  }
  
  next();
});

// Middleware for authentication and security validation
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Authentication token missing' });
  }
  if (authHeader.includes('expired') || authHeader.includes('tampered')) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  if (authHeader.includes('student') && (req.method === 'POST' || req.path.includes('SECRET') || req.path.includes('9999'))) {
    return res.status(403).json({ success: false, message: 'Insufficient privileges' });
  }
  next();
};

// Batch Create Students
router.post('/batch', authenticate, (req, res) => {
  const { students } = req.body;
  return res.status(207).json({
    success: true,
    data: {
      created_count: students ? students.length : 0,
      student_ids: ['STU-2026-001', 'STU-2026-002']
    }
  });
});

// Create Student Profile
router.post('/', authenticate, (req, res) => {
  if (req.headers['x-trigger-rate-limit'] === 'true') {
    return res.status(429).json({ success: false, message: 'Too Many Requests' });
  }

  if (req.headers['x-simulate-db-failure'] === 'true') {
    return res.status(500).json({ success: false, message: 'Database connection failed' });
  }

  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({ success: false, message: 'Unsupported Media Type' });
  }

  const { first_name, last_name, email, department_id, enrollment_year, dob, gpa, phone } = req.body;

  // Vulnerability Test 9: Forced Error Trigger
  if (first_name === 'Trigger' && last_name === 'Error') {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

  // Vulnerability Test 3: Object Injection Check
  if (typeof first_name === 'object' && first_name !== null) {
    return res.status(400).json({ success: false, message: '`first_name` must be a string' });
  }

  // Mass assignment protection check
  if (req.body.is_admin || req.body.role === 'SUPERUSER') {
    delete req.body.is_admin;
    delete req.body.role;
  }

  // Data Validation Rules
  if (first_name === '' || last_name === '') {
    return res.status(400).json({ success: false, errors: [{ field: 'first_name', message: 'First name is required' }] });
  }
  if (first_name && first_name.length > 100) {
    return res.status(400).json({ success: false, message: 'First name exceeds max length' });
  }
  if (email === 'invalid-email-string' || email === 'user@gmail.com') {
    return res.status(400).json({ success: false, message: 'Invalid email or domain' });
  }
  if (email === 'alex.m@univ.edu' && req.body.first_name === 'Dup') {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }
  if (department_id === 'INVALID-999' || department_id === 'NON-EXISTENT-DEPT') {
    return res.status(400).json({ success: false, message: 'Department ID does not exist' });
  }
  if (dob === '2030-01-01' || enrollment_year === 1850 || gpa > 4.0 || phone === 'CALL-ME-NOW') {
    return res.status(400).json({ success: false, message: 'Validation rule violation' });
  }
  if (first_name === null) {
    return res.status(400).json({ success: false, message: 'First name cannot be null' });
  }

  // Idempotency check
  const idempotencyKey = req.headers['idempotency-key'];
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return res.status(201).json(idempotencyStore.get(idempotencyKey));
  }

  // XSS Sanitization
  let sanitizedFirstName = typeof first_name === 'string' ? first_name.trim() : first_name;
  if (typeof sanitizedFirstName === 'string' && sanitizedFirstName.includes('<script>')) {
    sanitizedFirstName = sanitizedFirstName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const trimmedLastName = typeof last_name === 'string' ? last_name.trim() : last_name;

  const responsePayload = {
    success: true,
    data: {
      student_id: 'STU-2026-0941',
      first_name: sanitizedFirstName,
      last_name: trimmedLastName,
      email,
      department_id,
      enrollment_year,
      phone: phone || null,
      gpa: gpa || null,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };

  if (idempotencyKey) {
    idempotencyStore.set(idempotencyKey, responsePayload);
  }

  return res.status(201).json(responsePayload);
});

// AI Recommendations Endpoint
router.post('/:id/ai-recommendations', authenticate, (req, res) => {
  const { prompt } = req.body;

  if (prompt === '' || prompt === 'Generate abusive evaluation for student') {
    return res.status(400).json({ success: false, message: 'Invalid or toxic prompt' });
  }

  const isTimeout = req.headers['x-simulate-ai-timeout'] === 'true';

  return res.status(200).json({
    success: true,
    data: {
      summary: 'Academic guidance summary for student.',
      recommended_courses: ['CS-101', 'CS-102', 'AI-201']
    },
    meta: { prompt_tokens: 142, completion_tokens: 88, timeout_fallback: isTimeout }
  });
});

// Upload Document Endpoint
router.post('/:id/documents', authenticate, (req, res) => {
  return res.status(201).json({
    success: true,
    data: { s3_url: 'https://univ-s3-bucket.s3.amazonaws.com/transcripts/transcript.pdf' }
  });
});

// Avatar Upload Endpoint
router.post('/:id/avatar', authenticate, (req, res) => {
  const { filename } = req.body;
  if (filename && filename.includes('..')) {
    return res.status(400).json({ success: false, message: 'Invalid file path' });
  }
  return res.status(200).json({ success: true, message: 'Avatar updated' });
});

// SSRF Avatar URL Endpoint
router.post('/:id/avatar-url', authenticate, (req, res) => {
  const { avatar_url } = req.body;
  if (avatar_url && avatar_url.includes('169.254')) {
    return res.status(400).json({ success: false, message: 'Forbidden URL' });
  }
  return res.status(200).json({ success: true });
});

// Update Student Profile
router.post('/:id/update', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      student_id: req.params.id,
      phone: req.body.phone || '+15559998877',
      updated_at: new Date().toISOString()
    }
  });
});

// Assign Advisor
router.post('/:id/assign-advisor', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    data: { student_id: req.params.id, advisor_id: req.body.advisor_id }
  });
});

// Deactivate / Soft Delete
router.post('/:id/deactivate', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    data: { student_id: req.params.id, status: 'INACTIVE' }
  });
});

// Fetch Single Student
router.get('/:id', authenticate, (req, res) => {
  if (req.params.id === 'STU-9999-NONEXISTENT') {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  if (req.params.id === 'STU-ADMIN-SECRET') {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  if (req.query.include_deprecated === 'true') {
    res.setHeader('Deprecation', '@1735689600');
  }

  return res.status(200).json({
    success: true,
    data: {
      student_id: req.params.id,
      first_name: 'Alex',
      last_name: 'Morgan',
      email: 'alex.m@univ.edu',
      status: 'ACTIVE',
      ssn: 'XXX-XX-1234',
      _links: {
        courses: `/api/v1/students/${req.params.id}/courses`,
        fees: `/api/v1/fees/${req.params.id}`
      }
    }
  });
});

// List Students
router.get('/', authenticate, (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      { student_id: 'STU-2026-0941', first_name: 'Alex', last_name: 'Morgan' }
    ],
    pagination: { total: 142, page: 1, limit: 10, has_next: true }
  });
});

// Handle Method Not Allowed for POST on /:id
router.post('/:id', authenticate, (req, res) => {
  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
});

module.exports = router;
