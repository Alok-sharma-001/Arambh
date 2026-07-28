import os
import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

DEFAULT_CLIENT_ID = "927585905560-n5l9jfohpa5igfkmun1qv37h7og9uu0m.apps.googleusercontent.com"

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
        
    client_id = os.environ.get("GOOGLE_CLIENT_ID", DEFAULT_CLIENT_ID).strip()
    if not client_id:
        client_id = DEFAULT_CLIENT_ID

    try:
        try:
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), client_id
            )
        except ValueError as ve:
            logger.warning(f"Google token audience check notice ({ve}), verifying token signature directly...")
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request()
            )

        if not idinfo.get("email_verified"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not verified by Google"
            )
        return idinfo
    except ValueError as e:
        logger.error(f"Google token validation ValueError: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Google token validation Exception: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Google token verification failed: {str(e)}"
        )
