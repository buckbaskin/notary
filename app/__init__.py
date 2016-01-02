from flask import Flask

import sys
if not '/home/buck/Github/notary' in sys.path:
    sys.path.append('/home/buck/Github/notary')

print('app/__init__.py')
# print(sys.path)

from app.config import server_config

server = Flask(__name__)
server.config.from_object(server_config)

from db import Note

from app import routes
