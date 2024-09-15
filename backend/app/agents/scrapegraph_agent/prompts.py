from langchain.prompts import PromptTemplate

def real_estate_extractor_prompt() -> PromptTemplate:
    template = """
    Extract information about real estate properties from the website content that match: {user_description}

    For each relevant property, provide:
    {data_schema}

    Instructions:
    1. Extract only properties that match the user's description.
    2. Use "N/A" if information is missing.
    3. Clean URLs of tracking tags.
    4. For URLs:
       - If you encounter relative URLs (e.g., "Ficha.asp?xId=1518972"), attempt to construct a full URL based on context clues in the content.
       - If you can identify the website's domain from the content, use it to create absolute URLs.
       - If you cannot determine the full URL, include the relative URL as-is and note that it's incomplete.
    5. Return only a JSON array with the following structure:
    [
        {{
            data_schema
        }},
        ...
    ]
    6. Do not include any additional text outside the JSON array.

    Note: Ensure all URLs are as complete as possible given the available information.
    """
    return PromptTemplate(input_variables=["data_schema", "user_description"], template=template)