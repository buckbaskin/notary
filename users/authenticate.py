from db import User, LoginToken

def check_login(content):
    if 'action' not in content or not content['action'] == 'login':
        raise AuthError()
    if 'username' not in content or 'password' not in content:
        raise AuthError()
    return User.check_password(content['username'], content['password'])

def check_auth(username, atoken):
    if atoken is None or username is None:
        raise AuthError()
    elif not LoginToken.check_token(username, atoken):
        print('login token did not match')
        raise AuthError()
    return True



class AuthError(BaseException):
    pass
