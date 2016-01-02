import sys
if '/home/buck/Github/notary' not in sys.path:
    sys.path.append('/home/buck/Github/notary')

from users import routes
from users.authenticate import check_auth, AuthError