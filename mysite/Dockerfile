FROM node:15.14-buster AS node
RUN mkdir -p /mysite
COPY . /mysite/
WORKDIR /mysite/frontend
RUN yarn install
RUN yarn build

FROM python:3.7
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /mysite
COPY --from=node /mysite /mysite
WORKDIR /mysite

ARG POSTGRES_PASSWORD
ARG SECRET_KEY
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV SECRET_KEY=$SECRET_KEY

RUN pip install -r requirements.txt
RUN python manage.py collectstatic
# RUN python manage.py makemigrations
# RUN python manage.py migrate
