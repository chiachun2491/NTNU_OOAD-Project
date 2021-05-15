FROM nikolaik/python-nodejs:python3.7-nodejs15
ENV PYTHONUNBUFFERED 1
RUN mkdir /mysite
WORKDIR /mysite
COPY . /mysite/
RUN pip install -r requirements.txt
RUN python manage.py makemigrations
RUN python manage.py migrate

WORKDIR /mysite/frontend
RUN npm install
RUN npm rebuild node-sass
RUN npm run build

WORKDIR /mysite