# Code Audit Report

## Vulnerabilities

### 1. Hardcoded Secrets in Repository
- **Severity:** Critical
- **Location:** `backend/.env`
- **Description:** A `.env` file containing sensitive production credentials (including `DATABASE_URL`, `REDIS_URL`, and a concrete `SECRET_KEY`) is present in the source code directory. If this file is committed to version control, it exposes the application to immediate compromise.
- **Recommendation:** 
    1. Immediately add `.env` to `.gitignore`.
    2. Revoke and rotate all secrets currently in that file (Database passwords, API keys, Secret Keys).
    3. Use a secrets manager or environment variable injection during deployment (as per the `cloud_deployment.md` guide) instead of relying on a file.

### 2. Potential CORS Misconfiguration
- **Severity:** High
- **Location:** `backend/app/core/config.py` (Line 42) and Cloud Deployment Guide
- **Description:** The default configuration allows localhost. The deployment guide temporarily suggests setting `ALLOWED_ORIGINS=*`. If this "wildcard" permission is left active in production, it allows any website to make authenticated requests to the API on behalf of a user (CSRF-like behavior, though mitigated by SameSite cookies if used, but dangerous for API-based auth).
- **Recommendation:** strict enforcement of `ALLOWED_ORIGINS` to only match the exact Frontend URL (e.g., `https://clubcompass-frontend-xyz.a.run.app`). Ensure this environment variable is set during the `gcloud run deploy` command and never left as `*`.

### 3. CSV Bulk Import DoS Risk
- **Severity:** Medium
- **Location:** `backend/app/api/v1/admin.py` (Line 444, `bulk_import_clubs`)
- **Description:** The bulk import endpoint reads the entire uploaded file into memory using `await file.read()` before processing it with Pandas. A malicious admin or compromised account could upload a massive file (e.g., "zip bomb" equivalent or simply gigabytes of text) to trigger an Out-Of-Memory (OOM) crash, taking down the backend service.
- **Recommendation:** Implement a file size validation check using `file.size` (if available in headers) or stream the file content in chunks. Set a strict limit (e.g., 5MB) for CSV uploads.

### 4. Raw SQL Usage in Search
- **Severity:** Medium
- **Location:** `backend/app/services/club_service.py` (Line 59)
- **Description:** The application uses `sqlalchemy.text()` to construct Full-Text Search queries. While the current implementation uses parameter binding (`.params()`), the manual string sanitization (`replace("'", "''")`) suggests an attempt to manually handle escaping, which is error-prone. Future modifications might inadvertently introduce injection vulnerabilities if parameters are not strictly used.
- **Recommendation:** encapsulate the search logic into a dedicated safe builder or strictly adhere to SQLAlchemy's `bindparam`. Ensure no user input is ever interpolated directly into the query string using f-strings.

### 5. Sensitive Information in Error Logs
- **Severity:** Low
- **Location:** `backend/app/api/v1/auth.py` (Line 47)
- **Description:** The generic exception handler in the registration endpoint prints the error: `print(f"Failed to send verification email: {email_error}")`. In a production environment, sending raw error details to stdout (which might be aggregated by logging services) could leak internal details like SMTP credentials or user email addresses if the exception object contains them.
- **Recommendation:** Use a proper logging library (like the integrated `sentry` or Python's `logging` module) with appropriate log levels. Sanitize error messages before logging them to avoid leaking PII or credentials.

### 6. Missing Content Security Policy (CSP)
- **Severity:** Low
- **Location:** `frontend/next.config.ts` (Not explicitly configured)
- **Description:** There is no evidence of a Content Security Policy (CSP) being enforcing. A CSP helps mitigate XSS attacks by restricting the sources from which scripts, styles, and images can be loaded.
- **Recommendation:** Configure headers in `next.config.ts` to include a strict `Content-Security-Policy`. For example, restrict `script-src` to `'self'` and trusted domains (like Google Analytics if used).
