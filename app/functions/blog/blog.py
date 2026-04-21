import unicodedata

# Third-Party
from fastapi import Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

# App
from app.config.db.instance import get_session
from app.models.blog import Post


def remove_accents(input_str):
    """Remove accents from the input string"""
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])


def process_slug(text: str, id_post: int):
    """Process the slug text."""
    max_size = 50
    # Remove special characters and whitespace
    text = text.replace(" ", "-").replace("_", "-").lower()
    text = remove_accents(text)
    valid_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_"
    text = "".join(c for c in text if c in valid_chars)

    # Truncate the text to the maximum allowed size
    text = text[:max_size]

    # Remove the last character if it's a hyphen
    if text[-1] == "-":
        text = text[:-1]

    return f"{text}-{id_post}"


async def get_list_post(
    db_session: AsyncSession = Depends(get_session),
):
    """Create cashout full in broker."""
    try:
        blog_list = (
            (await db_session.execute(select(Post).limit(152).order_by(Post.id.desc())))
            .scalars()
            .all()
        )
        return list(
            map(
                lambda x: {**x.model_dump(), **{"slug": process_slug(x.title, x.id)}},
                blog_list,
            )
        )
    except Exception:
        return []


async def get_post(
    slug_blog: str,
    db_session: AsyncSession = Depends(get_session),
):
    """Obtiene un post por slug (formato título-id)."""
    try:
        id_post = int(slug_blog.split("-")[-1])
    except (ValueError, IndexError):
        return None
    try:
        item = (
            (await db_session.execute(select(Post).where(Post.id == id_post)))
            .scalars()
            .one_or_none()
        )
        if item is None:
            return None
        slug = process_slug(item.title, item.id)
        item = item.model_dump()
        item["slug"] = slug
        if "inserted_at" in item and item["inserted_at"]:
            item["date_creation"] = item["inserted_at"].strftime("%d de %B de %Y")
        else:
            item["date_creation"] = ""
        return item
    except Exception:
        return None


async def get_list_related_post(
    slug_blog: str,
    db_session: AsyncSession = Depends(get_session),
):
    """Create cashout full in broker."""
    try:
        id_post = int(slug_blog.split("-")[-1])
        blog_list = (
            (
                await db_session.execute(
                    select(Post).where(Post.id != id_post).order_by(func.random())
                )
            )
            .scalars()
            .all()
        )
        return list(
            map(
                lambda x: {**x.model_dump(), **{"slug": process_slug(x.title, x.id)}},
                blog_list,
            )
        )
    except Exception:
        return []
