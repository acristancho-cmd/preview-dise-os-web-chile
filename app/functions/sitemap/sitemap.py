def get_sitemap():
    """Read and return sitemap"""
    with open("app/functions/sitemap/sitemap.xml", "r") as file:
        file_content = file.read()
        return file_content
