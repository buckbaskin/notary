from db import User, LoginToken

def check_login(content):
    if 'action' not in content or not content['action'] == 'login':
        raise AuthError()
    if 'username' not in content or 'password' not in content:
        raise AuthError()
    return User.check_password(content['username'], content['password'])

def check_auth(content):
	if 'atoken' not in content:
		raise AuthError()
	else:
		return LoginToken.check_token(*content['atoken'])



class AuthError(BaseException):
    pass
