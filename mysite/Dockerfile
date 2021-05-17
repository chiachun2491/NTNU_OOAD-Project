FROM node:15.14-buster AS node
ADD . /mysite
WORKDIR /mysite/frontend
RUN yarn install
RUN yarn build

FROM python:3.7
ENV PYTHONUNBUFFERED 1

COPY --from=node /mysite/requirements.txt /mysite/requirements.txt
RUN pip install -r /mysite/requirements.txt

COPY --from=node /mysite /mysite
WORKDIR /mysite

