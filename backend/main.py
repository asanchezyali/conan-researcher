import uvicorn

from app.app_fastapi import app  # noqa

if __name__ == "__main__":
    uvicorn.run("app.app_fastapi:app", host="0.0.0.0", port=8000, reload=True)
