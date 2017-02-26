#!/usr/bin/env python
import web
import xml.etree.ElementTree as ET

tree = ET.parse('lamp_data.xml')
root = tree.getroot()

urls = (
    '/', 'index',
    '/lamps', 'list_lamps',
    '/lamps/(.*)', 'get_lamp'
)

app = web.application(urls, globals())

class index:
    def GET(self):
        print ('hi. service is up & running.')

class list_lamps:
    def GET(self):
        output = 'lamps:[';
        for child in root:
            print('child'), child.tag, child.attrib
            output += str(child.attrib) + ','
        output += ']';
        return output

class get_lamp:
    def GET(self, lamp):
        for child in root:
            if child.attrib['id'] == lamp:
                return str(child.attrib)

if __name__ == "__main__":
    app.run()
