import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")

def verify_google_token(token: str) -> dict:
    """
    Cryptographically verifies Google ID Token using Google's public keys.
    Returns payload containing 'sub', 'email', 'email_verified', 'name', 'picture'.
    """
    if not token or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
        
    client_id = os.environ.get("GOOGLE_CLIENT_ID", GOOGLE_CLIENT_ID)
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests.Request(), client_id if client_id else None
        )
        if not idinfo.get("email_verified"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not verified by Google"
            )
        return idinfo
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token verification failed: {str(e)}"
        )
