# Saboteur Online Game Website

It's an online game website created by the well-known board game Saboteur. All game rules are according to the original version. Besides, the website supports RWD (Responsive Web Design), so you can play on any mobile device. If you want to play, you can directly navigate to https://saboteur.ooad.tk/, or we also provide a docker version that can deploy on the local server.

## Installation

### Docker-compose version (Suggest)

Export environment variable or add `.env` at repo root directory.

```bash
export SECRET_KEY='PUT_YOUR_SECRET_KEY_HERE'
export POSTGRES_PASSWORD='SET_YOUR_OWN_DATABASE_PASSWORD_HERE'
```

or 

```bash
# .env
SECRET_KEY=PUT_YOUR_SECRET_KEY_HERE
POSTGRES_PASSWORD=SET_YOUR_OWN_DATABASE_PASSWORD_HERE
```

Please prepare the [docker-compose]() and [docker]() environment first.

 ```bash
 docker-compose build --no-cache
 ```

### No-NGINX localhost version (For development)

Use the node.js package manager yarn to install react.js and other frontend requirements.

```bash
# if you don't have installed yarn install it first
brew install yarn 
# or 
npm install yarn --g

cd mysite/frontend/
yarn install
```

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install Django and other backend requirements.

```bash
cd mysite/
pip install -r requirements.txt
```

Add `local_settings.py` in `mysite/mysite/settings/`

```python
# mysite/mysite/settings/local_settings.py
import os
os.environ['SECRET_KEY'] = 'PUT_YOUR_SECRET_KEY_HERE'
os.environ['POSTGRES_PASSWORD'] = 'PUT_YOUR_DATABASE_PASSWORD_HERE' 

from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
CORS_ORIGIN_ALLOW_ALL = True
```

Becasue of Django need database, so you need to prepare database and redis in your envrionment, you can just start docker-compose redis and Postgres service.

```ba
docker-compose up -d db redis
```

Or if you have own database and redis server, you need to add your setting in Django settings file to connect you database servers.

```python
# mysite/mysite/settings/local_settings.py

# Channels
ASGI_APPLICATION = 'mysite.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('redis', 6379)],  # edit your redis service host and port here
        },
    },
}

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
# Edit following field to fit your database setting
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': str(os.environ['POSTGRES_PASSWORD']),
        'HOST': 'db',
        'PORT': 5432,
    }
}
```

## Usage

### Docker-compose version (Suggest)

#### Start server

Start docker-compose services up, then open your browser to view website http://localhost/.

```bash
docker-compose up -d
```

### No-NGINX localhost version (For development)

Start react and django server then open your browser to view website http://localhost:3000/.

#### Start Django server

```bash
cd mysite/

# first run need to initial database 
python manage.py makemigrations --settings=mysite.settings.local_settings
python manage.py migrate --settings=mysite.settings.local_settings

# runserver
python manage.py runserver --settings=mysite.settings.local_settings
```

#### Start React server 

```bash
cd mysite/frontend/

yarn start
```

## Content of this repo

```tree
├── docker-compose.ci.yml        # docker-compose github action setting 
├── docker-compose.prod.yml      # docker-compose production setting
├── docker-compose.yml           # docker-compose localhost setting
├── mysite/                      # Django project (backend) files
│   ├── Dockerfile                   # Docker general setting
│   ├── Dockerfile.ci                # Docker github action setting 
│   ├── Dockerfile.prod              # Docker production setting
│   ├── authentication/              # account django app files
│   ├── frontend/                    # react project (frontend) files
│   ├── game/                        # game django app files
│   ├── manage.py                    # django manage execution file
│   ├── mysite/                      # django project and setting files
│   ├── requirements.txt             # backend packages requirements
│   └── saboteur/                    # saboteur package (GameController, Card, Player...)
└── nginx/                       # nginx files 
    ├── Dockerfile                   # Docker general setting
    ├── Dockerfile.prod              # Docker production setting
    ├── my_nginx.conf                # nginx production configuration
    ├── my_nginx_local.conf          # nginx localhost configuration
    └── nginx.conf                   # nginx configuration
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Authors and acknowledgment

This repository is a team project work in OOAD class teached by [Prof. Chun-Han Lin](https://sites.google.com/site/aaronchlin/home_e?authuser=0).

### Course info

+ National Taiwan Normal University (NTNU)（國立臺灣師範大學）
+ Department of Computer Science and Information Engineering (CSIE) (資訊工程學系)
+ Course Name: Object-Oriented Analysis and Design (OOAD) （物件導向分析與設計）
+ Course Semester: 2021 Spring
+ Instructor: Chun-Han Lin （林均翰）
+ [More course information](http://courseap.itc.ntnu.edu.tw/acadmOpenCourse/SyllabusCtrl?year=109&term=2&courseCode=CSC0005&courseGroup=&deptCode=SU47&formS=&classes1=9&deptGroup=)

### Team members

+ [Jeffery Ho](https://github.com/chiachun2491)
+ [DannyLeee](https://github.com/DannyLeee) 
+ [Striper](https://github.com/justbuyyal)
+ [YuKai Lee](https://github.com/leeyk0501)
+ [Cayden-981102](https://github.com/Cayden-981102)

## License
[MIT](https://choosealicense.com/licenses/mit/)