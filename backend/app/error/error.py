class DocumentNotFoundError(Exception):
    """Raised when there is no content available for a source"""

    def __init__(self, msg=None):
        self.msg = msg if msg else "No content available for the source."

    def __str__(self):
        return self.msg


class SourceNotFoundError(Exception):
    """Raised when a source is not found"""

    def __init__(self, msg=None):
        self.msg = msg if msg else "The requested source could not be found."

    def __str__(self):
        return self.msg
