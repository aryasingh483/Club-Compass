# OAuth2 Implementation Plan (Google Login)

This plan details the integration of Google OAuth2 for the `bmsce.ac.in` domain. We will use the **Google Identity Services (GIS)** "Sign In With Google" flow. This involves the frontend receiving an ID Token from Google and sending it to the backend for verification. This is the most secure and modern approach for authentication-only use cases.

**Confidence Score:** 95/100

---

## 1. 📦 Dependencies & Environment

### Backend (`backend/requirements.txt`)
We need `google-auth` to securely verify the ID tokens sent by the frontend.
```text
google-auth>=2.23.0
requests>=2.31.0
```

### Frontend (`frontend/package.json`)
We will use the official React wrapper for Google Identity Services.
```json
"@react-oauth/google": "^0.12.1"
```

### Environment Variables
**Backend (`backend/.env`):**
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Frontend (`frontend/.env.local`):**
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## 2. 🗄️ Database Changes (Migration)

The `User` model currently requires a password. OAuth users won't have one.

**Action:** Create a new Alembic migration (`alembic revision -m "allow_nullable_password"`) to:
1.  Make `password_hash` nullable.
2.  Add an `auth_provider` column to distinguish users.

```python
# backend/alembic/versions/xxx_allow_nullable_password.py

def upgrade():
    # Make password nullable
    op.alter_column('users', 'password_hash', existing_type=sa.VARCHAR(length=255), nullable=True)
    # Add auth_provider column
    op.add_column('users', sa.Column('auth_provider', sa.String(length=50), server_default='email', nullable=False))

def downgrade():
    op.drop_column('users', 'auth_provider')
    op.alter_column('users', 'password_hash', existing_type=sa.VARCHAR(length=255), nullable=False)
```

---

## 3. 🐍 Backend Implementation

### A. Configuration (`backend/app/core/config.py`)
Add the Client ID to the settings.

```python
class Settings(BaseSettings):
    # ... existing settings ...
    GOOGLE_CLIENT_ID: str = ""
```

### B. Schemas (`backend/app/schemas/user.py`)
Add a schema to validate the payload received from the frontend.

```python
class GoogleLoginRequest(BaseModel):
    credential: str  # The ID token from Google
```

### C. Service Logic (`backend/app/services/auth_service.py`)
Add logic to verify the token and manage the user.

```python
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.core.config import settings

class AuthService:
    # ... existing code ...

    @staticmethod
    def authenticate_google_user(db: Session, token: str) -> User:
        try:
            # 1. Verify the token with Google
            id_info = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            # 2. Check Domain Restriction
            if id_info.get('hd') != 'bmsce.ac.in':
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only @bmsce.ac.in email addresses are allowed."
                )

            email = id_info.get('email')
            name = id_info.get('name')
            
            # 3. Find or Create User
            user = AuthService.get_user_by_email(db, email)
            
            if not user:
                # Create new user without password
                user = User(
                    email=email.lower(),
                    full_name=name,
                    password_hash=None, # Nullable now
                    email_verified=True, # Trusted from Google
                    auth_provider="google",
                    is_active=True
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            else:
                # Optional: Link account if previously created via email/pass
                if user.auth_provider == 'email':
                    # You might want to update this or just allow login
                    pass
            
            return user
            
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
```

### D. API Endpoint (`backend/app/api/v1/auth.py`)

```python
from app.schemas.user import GoogleLoginRequest

@router.post("/google", response_model=TokenResponse)
async def google_login(
    login_data: GoogleLoginRequest, 
    db: Session = Depends(get_db)
):
    """
    Login or Register with Google (BMSCE only)
    """
    user = auth_service.authenticate_google_user(db, login_data.credential)
    
    # Generate our app's JWTs
    tokens = auth_service.create_tokens(user)
    
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        user=UserResponse.model_validate(user),
    )
```

---

## 4. ⚛️ Frontend Implementation

### A. API Client (`frontend/src/lib/api/auth.ts`)

```typescript
googleLogin: async (credential: string): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>('/auth/google', {
            credential 
        })
        return response.data
    } catch (error) {
        return handleApiError(error)
    }
}
```

### B. Login Page (`frontend/src/app/(auth)/login/page.tsx`)

Wrap the application or just the button in `GoogleOAuthProvider`.

```tsx
'use client'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { authApi } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/auth' // Assuming Zustand store exists
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    // ... existing state ...

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                const data = await authApi.googleLogin(credentialResponse.credential)
                // Store tokens/user
                // Redirect
                router.push('/dashboard')
            }
        } catch (error) {
            console.error("Google Login Failed", error)
        }
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {/* Existing Form */}
            
            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    useOneTap
                    theme="outline"
                    shape="circle"
                />
            </div>
        </GoogleOAuthProvider>
    )
}
```

---

## 5. Security & Verification

1.  **Token Integrity:** The backend uses `verify_oauth2_token` which cryptographically validates the JWT signature against Google's public keys.
2.  **Audience Check:** It explicitly checks that the token was issued for *our* `GOOGLE_CLIENT_ID`.
3.  **Domain Restriction:** The explicit `hd` (hosted domain) check ensures only `bmsce.ac.in` users can sign in.
4.  **No Client Secret:** This flow ("Implicit" style for ID token) does not require the backend to hold a `GOOGLE_CLIENT_SECRET`, reducing leakage risk.

## 6. Rollout Plan

1.  **Local:** Run migration, set env vars, test with a `@bmsce.ac.in` account.
2.  **Deploy:**
    -   Update `backend` Env vars in Cloud Run.
    -   Update `frontend` build args/env vars.
    -   Run database migrations on the Cloud SQL instance.
