# import sys
# import subprocess

# if not hasattr(sys, 'real_prefix'):
#   venv_activate = './venv/bin/activate'
#   subprocess.call(['source', venv_activate])

from app import server
server.run(debug=True)