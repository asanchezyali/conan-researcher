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
    4. Return only a JSON array with the following structure:
    [
        {{
            data_schema
        }},
        ...
    ]
    5. Do not include any additional text outside the JSON array.
    """
    return PromptTemplate(input_variables=["data_schema", "user_description"], template=template)