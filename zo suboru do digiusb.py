import sys,usb

REQUEST_TYPE_SEND = usb.util.build_request_type(usb.util.CTRL_OUT, usb.util.CTRL_TYPE_CLASS, usb.util.CTRL_RECIPIENT_DEVICE)
USBRQ_HID_SET_REPORT = 0x09
USB_HID_REPORT_TYPE_FEATURE = 0x03

class ArduinoUsbDevice(object):
    def __init__(self, idVendor, idProduct):
        self.idVendor = idVendor
        self.idProduct = idProduct
        self.device = usb.core.find(idVendor=self.idVendor,idProduct=self.idProduct)
        if not self.device:
            raise Exception("Device not found")

    def write(self, byte):
        self._transfer(REQUEST_TYPE_SEND, USBRQ_HID_SET_REPORT, byte, [])

    def _transfer(self, request_type, request, index, value):
        return self.device.ctrl_transfer(request_type, request, (USB_HID_REPORT_TYPE_FEATURE << 8) | 0, index, value)

    @property
    def productName(self):
        return getStringDescriptor(self.device, self.device.iProduct)

    @property
    def manufacturer(self):
        return getStringDescriptor(self.device, self.device.iManufacturer)

sys.path.append("..")

device = ArduinoUsbDevice(idVendor=0x16c0, idProduct=0x05df)
file = open("volajaky_textovy_subor.txt")
while True:
    try:
        device.write(ord(file.read(1)))
    except:
        pass
