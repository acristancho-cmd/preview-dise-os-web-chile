from fastapi import APIRouter
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from Secweb.StrictTransportSecurity import HSTS
from Secweb.XFrameOptions import XFrame
from Secweb.xXSSProtection import xXSSProtection
from Secweb.ReferrerPolicy import ReferrerPolicy
from Secweb.XDownloadOptions import XDownloadOptions
from Secweb.OriginAgentCluster import OriginAgentCluster
from Secweb.XContentTypeOptions import XContentTypeOptions
from Secweb.XDNSPrefetchControl import XDNSPrefetchControl
from Secweb.ContentSecurityPolicy import ContentSecurityPolicy
from Secweb.XPermittedCrossDomainPolicies import XPermittedCrossDomainPolicies

from app.routes import web

app = FastAPI(
    docs_url=None,  # Disable docs (Swagger UI)
    redoc_url=None,  # Disable redoc
)

app.add_middleware(XDownloadOptions)
app.add_middleware(XContentTypeOptions)
app.add_middleware(
    ContentSecurityPolicy,
    Option={
        "default-src": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["*"],
        "frame-src": [
            "'self'",
            "www.googletagmanager.com",
            "challenges.cloudflare.com",
            "static.hotjar.com",
            "cx.trii.ws",
            "https://www.youtube.com",
            "https://youtube.com",
            "https://www.youtube-nocookie.com",
            "https://tradingview.com",
            "tradingview.com",
            "https://www.tradingview.com",
            "www.tradingview.com",
            "https://*.tradingview.com",
            "*.tradingview.com",
            "https://s3.tradingview.com",
            "s3.tradingview.com",
            "https://tradingview-widget.com",
            "tradingview-widget.com",
            "https://*.tradingview-widget.com",
            "*.tradingview-widget.com",
        ],
        "connect-src": [
            "'self'",
            "'unsafe-inline'",
            "https://www.google-analytics.com",
            "cx.trii.ws",
            "https://trii-growth.app.n8n.cloud",
            "https://tradingview.com",
            "tradingview.com",
            "https://www.tradingview.com",
            "www.tradingview.com",
            "https://*.tradingview.com",
            "*.tradingview.com",
            "https://s3.tradingview.com",
            "s3.tradingview.com",
            "https://tradingview-widget.com",
            "tradingview-widget.com",
            "https://*.tradingview-widget.com",
            "*.tradingview-widget.com",
        ],
        "font-src": [
            "'self'",
            "fonts.gstatic.com",
            "https://cdnjs.cloudflare.com",
            "cdnjs.cloudflare.com",
        ],
        "style-src": [
            "'self'",
            "'unsafe-inline'",
            "fonts.googleapis.com",
            "cx.trii.ws",
            "https://cdnjs.cloudflare.com",
            "cdnjs.cloudflare.com",
        ],
        "script-src": [
            "'self'",
            "'unsafe-inline'",
            "www.googletagmanager.com",
            "challenges.cloudflare.com",
            "static.hotjar.com",
            "cx.trii.ws",
            "https://s3.tradingview.com",
            "s3.tradingview.com",
            "https://*.tradingview.com",
            "*.tradingview.com",
            "https://tradingview-widget.com",
            "tradingview-widget.com",
            "https://*.tradingview-widget.com",
            "*.tradingview-widget.com",
        ],
        "img-src": [
            "'self'",
            "www.googletagmanager.com",
            "storage.googleapis.com",
            "data:",
            "https://tradingview.com",
            "tradingview.com",
            "https://www.tradingview.com",
            "www.tradingview.com",
            "https://*.tradingview.com",
            "*.tradingview.com",
            "https://s3.tradingview.com",
            "s3.tradingview.com",
            "https://tradingview-widget.com",
            "tradingview-widget.com",
            "https://*.tradingview-widget.com",
            "*.tradingview-widget.com",
        ],
        "base-uri": ["'self'"],
        "block-all-mixed-content": [],
    },
    script_nonce=False,
    style_nonce=False,
)

app.add_middleware(XFrame, Option="DENY")
app.add_middleware(HSTS, Option={"max-age": 4, "preload": True})
app.add_middleware(xXSSProtection)
app.add_middleware(XDNSPrefetchControl, Option="on")
app.add_middleware(
    ReferrerPolicy, Option={"Referrer-Policy": "strict-origin-when-cross-origin"}
)
app.add_middleware(XPermittedCrossDomainPolicies, Option="none")
app.add_middleware(OriginAgentCluster)

app.mount("/static", StaticFiles(directory="static"), name="static")

# mid-router
api_router = APIRouter()
api_router.include_router(web.router)
# app setup router
app.include_router(api_router)


# path directory
