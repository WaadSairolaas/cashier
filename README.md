# cashier
A simple cashier UI that runs in web-browsers. The goal is to have a simple cashier UI that runs on any device with a browser. Kitchen and Customer receipts with order numbers should also be printable from the frontend.

## Getting Started

- Install/Have python3.6 and optionally virtualenv
- Clone repository
- (optional) Create and activate virtualenv
- Install requirements: ```pip install -r /path/to/requirements.txt```
- Install cashier. Run in project root: ```pip install --editable .```
- Export environment variables: ```FLASK_APP=cashier```, ```FLASK_DEBUG=true```
- Create DB: ```flask initdb```
- ```flask run```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
