import datetime
import pymongo

client = pymongo.MongoClient('localhost', 27017)

def save_call(fname, params=(), args=(), vargs=None, ret_val=None):
    if vargs is None:
        vargs = {}

    db = client.notary_database
    collection = db.access

    arg_queue = list(args)
    varg_queue = dict(vargs)
    out_queue = []

    # print('lp: '+str(len(params)))

    for i in range(0, len(params)):
        param = params[i]
        if len(arg_queue) > 0:
            if i == (len(params)-1):
                arg = arg_queue
                out_queue.append((param, arg,))
            else:
                arg = arg_queue.pop(0)
                out_queue.append((param, arg,))
        elif param in varg_queue:
            arg = varg_queue.pop(param)
            out_queue.append((param, arg,))
        else:
            # print('param not matched: '+str(param))
            pass

    record = {
        "date-utc": datetime.datetime.utcnow(),
        "function-name": fname,
        "call-data": list(out_queue),
        "return": ret_val
    }
    inserted_record = collection.insert_one(record)
    return inserted_record.inserted_id

def save_err_call(fname, params=(), args=(), vargs=None, error=None):
    if vargs is None:
        vargs = {}

    db = client.notary_database
    collection = db.access

    arg_queue = list(args)
    varg_queue = dict(vargs)
    out_queue = []

    # print('lp: '+str(len(params)))

    for i in range(0, len(params)):
        param = params[i]
        if len(arg_queue) > 0:
            if i == (len(params)-1):
                arg = arg_queue
                out_queue.append((param, arg,))
            else:
                arg = arg_queue.pop(0)
                out_queue.append((param, arg,))
        elif param in varg_queue:
            arg = varg_queue.pop(param)
            out_queue.append((param, arg,))
        else:
            # print('param not matched: '+str(param))
            pass

    record = {
        "date-utc": datetime.datetime.utcnow(),
        "function-name": fname,
        "call-data": list(out_queue),
        "error": error
    }
    inserted_record = collection.insert_one(record)
    return inserted_record.inserted_id

def trace(function):
    def wrapped_function(*args, **vargs):
        print('wrapped_function 1')
        call_name = function.__name__
        call_params = function.__code__.co_varnames
        call_args = args
        call_vargs = vargs
        try:
            val = function(*args, **vargs)
            save_call(fname=call_name, params=call_params, args=call_args,
                vargs=call_vargs, ret_val=str(val))
            return val
        except Exception as e:
            try:
                print('trace error ', call_name)
                save_err_call(fname=call_name, params=call_params,
                    args=call_args, vargs=call_vargs, error=e)
            finally:
                raise e
    return wrapped_function
