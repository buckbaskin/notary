def check_auth(request, content):
	return True

class AuthError(BaseException):
	pass