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
        4. IMPORTANT - URL FORMATTING:
        - ALL property URLs MUST use "https://www.espaciourbano.com/" as the domain.
        - NEVER use "example.com" or any other placeholder domain.
        - For any URL path like "Ficha.asp?xId=1615235", the complete URL MUST be formatted as "https://www.espaciourbano.com/Ficha.asp?xId=1615235".
        - Any deviation from this URL format will cause the scraper to fail.
        5. Return ONLY a JSON array of properties. Do not include any additional text outside the JSON array.
        6. Do not include a "sources" field in your response - the system will add this automatically.

        Example of CORRECT URL formatting:
        ✓ "source_url": "https://www.espaciourbano.com/Ficha.asp?xId=1615235"

        Examples of INCORRECT URL formatting:
        ✗ "source_url": "https://example.com/Ficha.asp?xId=1615235"
        ✗ "source_url": "Ficha.asp?xId=1615235"
        ✗ "source_url": "https://www.espaciourbano.com/Ficha.asp?xId=1615235 (incomplete)"

        Note: The domain must ALWAYS be "https://www.espaciourbano.com/" - any other domain will cause the system to fail.
    """
    return PromptTemplate(input_variables=["data_schema", "user_description"], template=template)