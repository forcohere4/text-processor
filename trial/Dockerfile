# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Install required dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    wget \
    libfontconfig1 \
    libcairo2 \
    libjpeg-turbo8 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pdf2htmlEX from .deb package
RUN wget https://github.com/pdf2htmlEX/pdf2htmlEX/releases/download/v0.18.8.rc1/pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb \
    && apt-get install -y ./pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb \
    && rm pdf2htmlEX-0.18.8.rc1-master-20200630-Ubuntu-bionic-x86_64.deb

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install required Python packages
RUN pip3 install flask

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["python3", "app.py"]
