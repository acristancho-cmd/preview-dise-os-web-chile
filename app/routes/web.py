from fastapi import APIRouter, Request, Form, Depends, Response, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from app.functions.contact import send_email_contact
from app.functions.stock import get_stocks_info, get_ttl_hash
from app.functions.sitemap.sitemap import get_sitemap
from app.config.settings import settings

from app.config.db.instance import get_session
from app.functions.blog.blog import get_list_post, get_post, get_list_related_post


router = APIRouter()


templates = Jinja2Templates(directory="app/templates")
PSE_REDIRECT_URL = settings.PSE_REDIRECT_URL


@router.get("/", response_class=HTMLResponse)
async def render_home(request: Request):
    """render the home page
    :param: request object
    :return: rendered home.html template
    """
    return templates.TemplateResponse("home.html", {"request": request})


@router.get("/about", response_class=HTMLResponse)
async def render_weare(request: Request):
    """render the page we are
    :param: request object
    :return: rendered about.html template
    """
    return templates.TemplateResponse("about.html", {"request": request})


@router.get("/contact", response_class=HTMLResponse)
async def render_contact(request: Request):
    """render the contact page
    :param: request object
    :return: rendered contact.html template
    """
    return templates.TemplateResponse("contact/contact.html", {"request": request})


@router.post("/contact", response_class=HTMLResponse)
async def process_contact(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...),
):
    """handling form post contact
    :param: request object
    :return: rendered contact.html template
    """
    if settings.is_static_preview:
        raise HTTPException(
            status_code=503,
            detail="Formulario de contacto no disponible en esta vista previa.",
        )
    send_email_contact(name, email, message)
    return templates.TemplateResponse("contact/response.html", {"request": request})


@router.get("/faq", response_class=HTMLResponse)
async def render_faq(request: Request):
    """render the faq page
    :param: request object
    :return: rendered faq.html template
    """
    return templates.TemplateResponse("faq.html", {"request": request})


@router.get("/stock-list", response_class=HTMLResponse)
async def render_stock_list(request: Request):
    """render the actions page
    :param: request object
    :return: rendered stock-list.html template
    """
    stocks = get_stocks_info(ttl_hash=get_ttl_hash())
    # Calculate total companies
    stocks["companies"] = len(stocks.get("local", [])) + len(stocks.get("global", []))

    return templates.TemplateResponse(
        "stock-list.html", {"request": request, "stocks": stocks}
    )


# pylint: disable=unused-argument
@router.get("/terms", response_class=HTMLResponse)
async def render_terms(request: Request):
    """render the terms page
    :param: request object
    :return: rendered terms.html template
    """

    return templates.TemplateResponse("terms.html", {"request": request})


# pylint: disable=unused-argument
@router.get(
    "/privacy",
    # response_class=HTMLResponse
)
async def read_privacy(request: Request):
    """render the faq page
    :param: request object
    :return: rendered faq.html template
    """
    return templates.TemplateResponse("privacy.html", {"request": request})


@router.get("/politica-de-privacidad", response_class=HTMLResponse)
async def read_trii_pro_terms(request: Request):
    """render the faq page
    :param: request object
    :return: rendered faq.html template
    """
    return templates.TemplateResponse("privacy_actual.html", {"request": request})


@router.get("/terms-pro", response_class=HTMLResponse)
async def read_privacy_actual(request: Request):
    """render the faq page
    :param: request object
    :return: rendered faq.html template
    """
    return templates.TemplateResponse("trii_pro_terms.html", {"request": request})


@router.get("/contract", response_class=HTMLResponse)
async def render_contract(request: Request):
    """render the contract page
    :param: request object
    :return: rendered contract.html template
    """
    return templates.TemplateResponse("contract.html", {"request": request})


# Rutas Copilot (desconectadas temporalmente - secciones Asistente IA, Radar, Rutas)
# @router.get("/copilot/asistente-ia", response_class=HTMLResponse)
# async def render_asistente_ia(request: Request):
#     """Render the Asistente de IA (Copilot) page."""
#     return templates.TemplateResponse("copilot/asistente-ia.html", {"request": request})


# @router.get("/copilot/radar-mercado", response_class=HTMLResponse)
# async def render_radar_mercado(request: Request):
#     """Render the Radar de mercado (Copilot) page."""
#     return templates.TemplateResponse("copilot/radar-mercado.html", {"request": request})


# @router.get("/copilot/rutas-aprendizaje", response_class=HTMLResponse)
# async def render_rutas_aprendizaje(request: Request):
#     """Render the Rutas de aprendizaje (Copilot) page."""
#     return templates.TemplateResponse("copilot/rutas-aprendizaje.html", {"request": request})


@router.get("/fondos", response_class=HTMLResponse)
async def render_funds_list(request: Request):
    """Listado de fondos con widget de TradingView."""
    return templates.TemplateResponse("fondos.html", {"request": request})


@router.get("/etf", response_class=HTMLResponse)
async def render_etf(request: Request):
    """Landing ETFs (fondos cotizados en bolsa)."""
    return templates.TemplateResponse("etf.html", {"request": request})


@router.get("/diatrii", response_class=HTMLResponse)
async def render_diatrii(request: Request):
    """render the diatrii page"""
    return templates.TemplateResponse("diatrii.html", {"request": request})


@router.get("/blog", response_class=HTMLResponse)
async def render_blog_list(
    request: Request,
    db_session: AsyncSession = Depends(get_session),
):
    """Listado de posts desde la base de datos."""
    list_post = await get_list_post(db_session)
    return templates.TemplateResponse(
        "blog/list.html", {"request": request, "list_post": list_post}
    )


@router.get("/blog/{slug_blog}", response_class=HTMLResponse)
async def render_blog_post(
    request: Request,
    slug_blog: str,
    db_session: AsyncSession = Depends(get_session),
):
    """Vista de un post desde la base de datos."""
    blog = await get_post(slug_blog, db_session)
    related_post = await get_list_related_post(slug_blog, db_session)
    if blog is None:
        return RedirectResponse(status_code=301, url="/blog")
    return templates.TemplateResponse(
        "blog/view.html",
        {"request": request, "blog": blog, "related_post": related_post},
    )


@router.get("/sitemap.xml", response_class=HTMLResponse)
async def render_sitemap():
    """render the page we are
    :param: request object
    :return: rendered about.html template
    """
    body = get_sitemap()
    return Response(content=body, media_type="application/xml")



@router.get("/redirect-to-app", response_class=HTMLResponse)
async def render_redirect(request: Request):
    """render the contract page
    :param: request object
    :return: rendered redirect.html template
    """
    return templates.TemplateResponse("/redirect-to-app.html", {"request": request})


@router.get("/robots.txt", response_class=HTMLResponse)
async def render_robots():
    """render the page we are
    :param: request object
    :return: rendered about.html template
    """
    body = """
User-agent: *
Allow: /
Sitemap: https://trii.co/sitemap.xml
    """
    return Response(content=body, media_type="application/txt")



@router.get("/pse")
async def pse_redirect(request: Request):
    """Redirect desktop users to web.trii.ws, render home template for mobile users
    :param: request object
    :return: redirect response for desktop, rendered home.html template for mobile
    """
    user_agent = request.headers.get("user-agent", "").lower()

    # Check if the user is on a mobile device
    mobile_indicators = [
        "mobile",
        "android",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
        "opera mini",
        "iemobile",
        "mobile safari",
    ]

    is_mobile = any(indicator in user_agent for indicator in mobile_indicators)

    redirect_url = PSE_REDIRECT_URL
    if is_mobile:
        # Render home template for mobile users
        return templates.TemplateResponse("home.html", {"request": request})

    if request.url.query:
        redirect_url += f"?{request.url.query}"
    return RedirectResponse(url=redirect_url, status_code=302)


@router.get("/triipro", response_class=HTMLResponse)
async def render_triipro(request: Request):
    """render the triipro page
    :param: request object
    :return: rendered triipro.html template
    """
    return templates.TemplateResponse("triipro.html", {"request": request})


@router.get("/{path:path}")
async def catch_all(request: Request, path: str):
    """Error 404 page"""

    ## redirect old url
    redirects = {
        "blog/25": "/blog/Trii-permitiraacute-comprar-acciones-de-bolsas-de-25",
        "static_files/images/trii_principal_logo.svg": "/static/icons/trii_logo.svg",
        "blog/24": "/blog/Durante-la-semana-del-emisor-se-realizaron-3442-tr-24",
        "blog/23": "/blog/Trii-registroacute-maacutes-de-8000-operaciones-en-23",
        "blog/2": "/blog/Trii-permitir-comprar-acciones-de-bolsas-de-Estado-2",
        "blog/1": "/faq",
    }

    if path.startswith(tuple(redirects.keys())):
        redirect_url = redirects[path]
        return RedirectResponse(url=redirect_url, status_code=301)

    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)
