import sys
import os
from pathlib import Path

BASE_DIR = str(Path(__file__).parent)
sys.path.append(BASE_DIR)

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from middleware import LogMiddleware, setup_cors

from routes.sentiment_route import router


app = FastAPI()
app.add_middleware(LogMiddleware)
setup_cors(app)
app.include_router(router)

templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse(
        "homepage.html",
        {
            "request": request
        }
    )
    
app.mount("/static", StaticFiles(
directory=os.path.join(BASE_DIR, "static"), html=True), name="static")