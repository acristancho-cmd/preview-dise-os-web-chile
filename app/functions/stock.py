from functools import lru_cache
import time
import requests


LOCAL_STOCKS_ALLOWED = {
    "aguas-a":    "SNSE:AGUAS_A",
    "almedral":   "SNSE:ALMENDRAL",
    "andina-b":   "SNSE:ANDINA_B",
    "antarchile": "SNSE:ANTARCHILE",
}


def split_list_by_mgc(data_list):
    """Split list by local or global"""
    global_list = []
    local_list = []

    def check_tags(item):
        item_values = data_list[item]
        item_values["codeStockLow"] = f"{item}".lower()
        if (
            item_values
            and "tags" in item_values
            and item_values["refPrice"] is not None
        ):
            if "global" in item_values["tags"]:
                global_list.append(item_values)
            elif "local" in item_values["tags"] and item_values["codeStockLow"] in LOCAL_STOCKS_ALLOWED:
                item_values["tvSymbol"] = LOCAL_STOCKS_ALLOWED[item_values["codeStockLow"]]
                local_list.append(item_values)

    list(map(check_tags, data_list))
    return {"global": global_list, "local": local_list}


def get_ttl_hash(seconds=15000):
    """Return the same value withing `seconds` time period"""
    return round(time.time() / seconds)


@lru_cache()
def get_stocks_info(ttl_hash=None):
    """Get stocks info"""
    url = "https://storage.googleapis.com/prices-stocks/stock-prices-CO.json"
    # Send a GET request to the URL
    response = requests.get(url, timeout=15)

    result = {"global": [], "local": [], "time": ttl_hash}  # default value
    # Check if the request was successful
    if response.status_code == 200:
        json_content = response.json()
        # split list by local or global
        result = split_list_by_mgc(json_content)
        return result

    return result
