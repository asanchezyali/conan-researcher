from datetime import datetime
from typing import Optional, Union

def handle_date(date_value: Optional[Union[str, datetime]]) -> str:
    if date_value is None:
        return None
    elif isinstance(date_value, datetime):
        return date_value.strftime('%Y-%m-%dT%H:%M:%S.%f')
    elif isinstance(date_value, str):
        return date_value.rstrip('Z')
    else:
        return str(date_value)