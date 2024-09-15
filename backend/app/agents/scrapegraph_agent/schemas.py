from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

class PropertySchema(BaseModel):
    property_type: Optional[str] = Field(default=None, description="Type of property (e.g., Apartment, House, Commercial)")
    price: Optional[str] = Field(default=None, description="Listed price of the property")
    location: Optional[str] = Field(default=None, description="Address or area of the property")
    size: Optional[str] = Field(default=None, description="Size of the property in sq ft or sq m")
    source_url: Optional[str] = Field(default=None, description="URL of the webpage where the property is listed")

    @classmethod
    def generate_schema_dict(cls):
        return {
            "property_type": cls.model_fields["property_type"].description,
            "price": cls.model_fields["price"].description,
            "location": cls.model_fields["location"].description,
            "size": cls.model_fields["size"].description,
            "source_url": cls.model_fields["source_url"].description,
        }

class ResearchType(str, Enum):
    RealEstateDataExtraction = "real_estate_data_extraction"