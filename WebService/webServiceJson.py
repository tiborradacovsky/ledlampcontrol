#!/usr/bin/env python
import web
import json

json_data=open("./lamp_data.json")
data = json.load(json_data)
json_data.close()

urls = (
    '/', 'index',
    '/lamps', 'list_lamps',
    '/lamps/(.*)', 'get_lamp',
    '/save', 'saveLedColor',
    '/getLampsCount', 'getLampsCount'
)

app = web.application(urls, globals())

class index:
    def GET(self):
        print ('hi. service is up & running.')

class list_lamps:
    def GET(self):
        return json.dumps(data)

class get_lamp:
    def GET(self, lamp):
        print lamp
        for lampDetails in data:
            print lampDetails
            if lampDetails == lamp:
                print "lamp ID found: ", data[lamp]
                return json.dumps(data[lamp])
        return 
            
class saveLedColor:
    def POST(self):
        postData = json.loads(web.data())
        print data
        print
        print 'color: '
        print postData['color']
        print
        print 'ledId: '
        print postData['ledId']
        print
        print 'operation: '
        print postData['operation']
        
        print
        print data[postData['ledId']]
        data[postData['ledId']]['color'] = postData['color']
        data[postData['ledId']]['operation'] = postData['operation']
        print data[postData['ledId']]

class getLampsCount:
    def GET(self):
        print 'Request to lampCount:', len(data)
        return len(data)
        
            
if __name__ == "__main__":
    app.run()
