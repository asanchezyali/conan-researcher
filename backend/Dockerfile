# Use the specified base image
# ARG BASE_IMAGE="rayproject/ray:nightly-py311-aarch64"
ARG BASE_IMAGE="rayproject/ray:nightly-py311-aarch64"

FROM ${BASE_IMAGE} as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.8.3 

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"

# Install dependencies
COPY pyproject.toml poetry.lock ./
# Generate requirements.txt
RUN poetry export -f requirements.txt --without-hashes --output requirements.txt
# Install dependencies with pip
RUN pip install -r requirements.txt

# Install scrapegraph (temporal solution)
RUN pip install scrapegraphai
RUN pip install scrapegraphai[other-language-models]
RUN pip install scrapegraphai[more-browser-options]
RUN pip install scrapegraphai[more-semantic-options]
RUN pip install scrapegraphai[burr]
RUN python3 -m playwright install-deps
RUN python3 -m playwright install
    
# Copy all application files including migrations
WORKDIR  /app
COPY ./main.py ./serve_config.yml ./alembic.ini ./migrations ./bin/start.sh ./
COPY ./app ./app

# Set the entrypoint or CMD
CMD ["bash"]