# Network Scanner

A simple network scanner with a beautiful dark web interface.

Fast, easy to use, automatic.

## Features

- IP information
- Threat Analysis
- Availability of services
- Internet speed test
- Checking IP in blacklists

## Quick Start

### Automatic installation (recommended):
> bash
```
git clone https://github.com/i0fliget/NetworkScanner.git
cd NetworkScanner/src
python run.py
```

### Self-installation:
> bash
```
git clone https://github.com/i0fliget/NetworkScanner.git
cd NetworkScanner/src
pip install -r requirements.txt
uvicorn api:app --reload
```
#### Next, copy the **full** path to src/site/index.html and paste it into your browser.