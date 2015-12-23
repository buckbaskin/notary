import sys
sys.path.append('/home/buck/Github/notary')

import analytics

@analytics.trace
def doathing(a, b, c, *args):
    print(a)
    print('---')
    print(b)
    print('---')
    print(c)
    print('---')
    print(args)
    return 10

if __name__ == '__main__':
    doathing(1,2,3,4,5,6)