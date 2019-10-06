[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/amosbastian/fullstack-coding-challenge">
    <img src="https://i.imgur.com/kwJYu9S.png" height="160px" width="160px" alt="Unbabel Logo">
  </a>

  <h3 align="center">Unbabel Translate</h3>

  <p align="center">
    An application built for Unbabel's full stack coding challenge which can be used for translating text from English to Spanish, or the other way around!
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About The Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Testing](#testing)
* [Live Demo](#live-demo)
* [Contact](#contact)

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

For the challenge I have created an application à la Google Translate, except using Unbabel's API. Some of its features are:

* Translation from English to Spanish (default) or Spanish to English
* Reflects the status of translations in real time using server-sent events
* Dynamically sorts translations by the length of their translated text (with pretty animations!)
* Deletion of translations
* Mobile first design; support for both small and large screens

Look at the GIFs below to see this in action!

#### Mobile
<p align="center">
    <img src="https://thumbs.gfycat.com/KeyBlissfulDog-size_restricted.gif" alt="Unbabel Translate Mobile">
</p>

#### Desktop
<p align="center">
    <img src="https://thumbs.gfycat.com/TheseCanineAmericanavocet-size_restricted.gif" alt="Unbabel Translate Desktop">
</p>


### Built With

* [React](https://reactjs.org/)
* [Flask](http://flask.palletsprojects.com/)
* [Tailwind.css](https://tailwindcss.com/)
* [PostgreSQL](https://www.postgresql.org/)

<!-- GETTING STARTED -->
## Getting Started

It is pretty easy to set everything up, but I will walk you through it step by step nevertheless!

### Prerequisites

First of all, you must clone the project!

```sh
git clone git@github.com:amosbastian/fullstack-coding-challenge.git
```
#### Backend

Since this project uses PostgreSQL as its database, you must install it first. On Ubuntu do the following

```sh
sudo apt-get install postgresql
sudo apt-get install python-psycopg2
sudo apt-get install libpq-dev
```

After installing, or if you already had it installed, you must create a two new databases; one for development and one for testing.

```sh
# Create superuser (if you haven't already)
sudo -u postgres createuser --superuser name_of_user

# Create database
psql -U name_of_user -d unbabel
psql -U name_of_user -d unbabel_test

# Set password (if you haven't already)
psql unbabel
\password
```

Once done, you must also set some environment variables in the `backend` folder. An easy way to do this is to create a `.env` file with the necessary variables (see `backend/.example.env`). Of course you should exchange `username` with the name of the superuser created above, `password` with the password you set and the Unbabel API and username with real values.

#### Frontend

The frontend is created in React and so you need either [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/lang/en/) to install it.

### Installation
 
#### Backend

```sh
cd backend

# Install everything using setup.py
pip install .

# Might not be necessary
flask db init
flask db migrate
flask db upgrade

flask run
```

If it doesn't work, then you probably didn't set up the PostgreSQL database correctly, or forgot to set the required environment variables.

#### Frontend

```sh
cd frontend

# With npm
npm install
npm start

# With yarn
yarn install
yarn start
```

## Testing

I have created tests for both the backend and the frontend using [pytest](https://docs.pytest.org/en/latest/) and [Jest](https://jestjs.io/) + [Enzyme](https://airbnb.io/enzyme/) respectively.

#### Backend

For mocking I used `pytest-mock` and for coverage I used `coverage`. To run the tests you can use either:

```sh
pytest
```
or

```sh
# With coverage
coverage run -m pytest
coverage report
```
which outputs

```
Name                       Stmts   Miss Branch BrPart  Cover   Missing
----------------------------------------------------------------------
unbabel/__init__.py           27      0      2      0   100%
unbabel/api.py                25      1      6      1    94%   43, 42->43
unbabel/configuration.py      17      0      0      0   100%
unbabel/models.py             19      0      0      0   100%
unbabel/translations.py       41      0      8      1    98%   111->108
unbabel/utilities.py          24      0      4      1    96%   26->22
----------------------------------------------------------------------
TOTAL                        153      1     20      3    98%
```

#### Frontend

Since the frontend is bootstrapped with `create-react-app` it already includes Jest, but I also used Enzyme to test components in isolation from the child components they render. You can run the tests with

```sh
npm run test
```

or 

```sh
npm test -- --coverage
```
to include a coverage report.

## Live Demo

A live demo is available on https://amosbastian.github.io/fullstack-coding-challenge/. **Note:** for some reason the server-sent events are being blocked because of CORS, despite the Flask application using `flask_cors` to prevent this specifically. 

## Contact

Amos Bastian - amosbastian@gmail.com

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/amosbastian
[product-screenshot]: images/screenshot.png
