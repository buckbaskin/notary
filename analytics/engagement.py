import datetime
import pymongo

client = pymongo.MongoClient('localhost', 27017)

def save_call(fname, params=(), args=(), vargs={}, ret_val=None):

    db = client.notary_database
    collection = db.access

    arg_queue = list(args)
    varg_queue = dict(vargs)
    out_queue = []

    print('lp: '+str(len(params)))

    for i in range(0,len(params)):
        # print 'i: '+str(i)
        param = params[i]
        if len(arg_queue) > 0:
            if i == (len(params)-1):
                # print 'aq: '+str(arg_queue)
                # print 'vq: '+str(varg_queue)
                arg = arg_queue
                # print 'pair: '+str((param, arg,))
                out_queue.append((param, arg,))
                # varg = varg_queue
                # out_queue.append((param, varg,))
            else:
                arg = arg_queue.pop(0)
                out_queue.append((param, arg,))
        elif param in varg_queue:
            arg = varg_queue.pop(param)
            out_queue.append((param, arg,))
        else:
            # if i == (len(params)-1):
            #     print 'vq: '+str(varg_queue)
            #     varg = varg_queue
            #     out_queue.append((param, varg,))
            # elif len(arg_queue) == 0:
            #     arg = arg_queue
            #     # print 'pair: '+str((param, arg,))
            #     out_queue.append((param, arg,))
            # else:
                print('param not matched: '+str(param))

    # print str(datetime.datetime.now())
    # print str(fname)+'('+str(out_queue)+')'+' => '+str(ret_val)
    record = {
        "date-utc": datetime.datetime.utcnow(),
        "function-name": fname,
        "call-data": list(out_queue),
        "return": ret_val
    }
    inserted_record = collection.insert_one(record)
    return inserted_record.inserted_id

def trace(function):
    def wrapped_function(*args, **vargs):
        print(function.__name__)

        call_name = function.__name__
        call_params = function.__code__.co_varnames
        call_args = args
        call_vargs = vargs

        val = function(*args, **vargs)
        
        save_call(fname=call_name, params=call_params, args=call_args, vargs=call_vargs, ret_val=val)
        return val
    return wrapped_function
