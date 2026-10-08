process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'fakeshield_test_secret_key_12345';

import './urlAnalyzer.test';
import './api.test';
