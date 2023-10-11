from typing import Union
from fastapi import FastAPI
from fortigate_api import FortigateAPI
from pydantic import BaseModel
from secrets import secret
from fastapi import Response
from fastapi.middleware.cors import CORSMiddleware
import json
import ipaddress
import time

global fgt
data = None
app = FastAPI()
host = secret.get("host")
user = secret.get("username")
password = secret.get("password")
fgt = FortigateAPI(host = host, username=user, password=password)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    name: str = None
    status: str = None
    action: str = None
    srcintf: list = None
    dstintf: list = None
    srcaddr: list = None
    dstaddr: list = None
    service: list = None
    schedule: str = None
    logtraffic: str = None
    neighbor: str = None

class Addr(BaseModel):
    name: str = None
    subnet: str = None
    typ: str = None

def validate(data):
    new_data = {}
    err = []
    for i in data:
        val = data.get(i)
        if val != None:
            if i == "srcaddr":
                addr = fgt.address.get(uid=val)
                if addr != []:
                    err.append(i)
            elif i == "dstaddr":
                addr = fgt.address.get(uid=val)
                if addr != []:
                    err.append(i)
            new_data.update({i:data[i]})
    return new_data

def short_loop(data):
    result = [i.get("name") for i in data]
    return result

@app.get("/")
async def read_root():
    all_pol = fgt.policy.get()
    # print(all_pol)
    return json.dumps(all_pol, indent=2)
    

@app.get("/interfaces")
async def get_interface():
    inf = []
    interfaces = fgt.interface.get()
    for id, val in enumerate(interfaces):
        # inf.append({'id':id, 'label':val['name']})
        inf.append(val['name'])
    return inf

@app.get("/address/{addr}")
async def get_address(addr: str):
    lists = []
    # print(addr)
    if "--" in addr:
        addr = addr.replace("--", "/")
    # print(addr)

    address = fgt.address.get(uid=addr)
    if address != []:
        # print("address", address)
        ip_info = address[0]
        if ip_info.get('type') == "ipmask":
            address = address[0].get("subnet").replace(' ', '/')
            ipaddr = ipaddress.ip_network(address).with_prefixlen    
        elif ip_info.get('type') == "geography":
            ipaddr = "geography"
        elif ip_info.get('type') == "iprange":
            start_ip = ip_info.get('start-ip')
            end_ip = ip_info.get('end-ip')
            ipaddr = start_ip + ' - ' + end_ip
        lists.append(ipaddr)
        # print(lists)
    else:
        address_group = fgt.address_group.get(uid=addr)
        if address_group != []:
            for i in address_group[0].get('member'):
                lists.append(i.get("name"))
    return lists

@app.post("/address")
async def craete_address(addr: Addr):
    time.sleep(2)
    print(addr)
    ipaddr = ipaddress.ip_network(addr.subnet).with_netmask
    ipaddr = ipaddr.split('/')
    print(ipaddr)
    res = fgt.address.create({
        'name': addr.name,
        'type': addr.typ,
        'subnet': ipaddr[0] + ' ' + ipaddr[1]
    })
    print(res)
    return addr

@app.get("/address")
async def get_address():
    lists = []
    addr_all = fgt.address.get()
    for i in addr_all:
        lists.append(i.get('name'))
    # print(lists)
    return lists

@app.get("/service")
async def get_service():
    lists = []
    service_all = fgt.service.get()
    for i in service_all:
        lists.append(i.get('name'))
    # print(lists)
    return lists

@app.get("/policy/{vdom}")
async def get_apolicies(vdom: str):
    global fgt
    pol = []
    fgt = FortigateAPI(host = host, username=user, password=password, vdom=vdom)
    print(fgt)
    policies = fgt.policy.get()
    for i in policies:
        pol.append({
            "id": i.get("policyid"),
            "name": i.get("name"),
            "srcintf": short_loop(i.get("srcintf")),
            "dstintf": short_loop(i.get("dstintf")),
            "srcaddr": short_loop(i.get("srcaddr")),
            "dstaddr": short_loop(i.get("dstaddr")),
            "service": short_loop(i.get("service")),
            "action": i.get("action")
            })
    return pol

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/create/{uid}")
async def create_policy(uid: int, data: Item):
    try:
        print(uid)
        print(data)
        time.sleep(3)
        # print(data)
        print(type(data))
        fgt.policy.create(dict(
            name=data.name,
            status="enable",
            action=data.action,
            srcintf=data.srcintf,
            dstintf=data.dstintf,
            srcaddr=data.srcaddr,
            dstaddr=data.dstaddr,
            service=data.service,
            schedule="always",
            logtraffic='all'
        ))
        
        if data.neighbor != '':
            res = fgt.policy.get(filter="name=="+data.name)
            fgt.policy.move(uid=res[0].get("policyid"), position=data.neighbor.lower(), neighbor=uid)

        return data
    except Exception as error:
        print("An exception occurred:", error)


@app.post("/update/{uid}")
async def update_policy(uid: int, data: Item):
    try:
        print('Update')
        print(uid, type(uid))
        # print(data)
        data = dict(
            name=data.name,
            status="enable",
            action=data.action,
            srcintf=data.srcintf,
            dstintf=data.dstintf,
            srcaddr=data.srcaddr,
            dstaddr=data.dstaddr,
            service=data.service,
            schedule="always",
            logtraffic='all'
        )

        # print(json.dumps(data, indent=4))
        print(data)
        print(type(data))
        print(fgt)
        res = fgt.policy.update(data, uid)
        print(res)
        time.sleep(1)
        return data
    except Exception as error:
        print("An exception occurred:", error)