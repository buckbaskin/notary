from flask import Flask

import config

import sys
if not '/home/buck/Github/notary' in sys.path:
    sys.path.append('/home/buck/Github/notary')

print 'app/__init__.py'
print sys.path

server = Flask(__name__)
server.config.from_object(config)

from app import routes
