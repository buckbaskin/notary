from db import User

def check_auth(request, content):
    if 'action' not in content or not content['action'] == 'login':
        raise AuthError()
    if 'username' not in content or 'password' not in content:
        raise AuthError()
    return User.check_password(content['username'], content['password'])


class AuthError(BaseException):
    pass
