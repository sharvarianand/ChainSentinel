import asyncio
import aiohttp
import socketio

sio = socketio.AsyncClient()

@sio.event
async def connect():
    print("Connection established!")

@sio.event
async def connect_error(err):
    print(f"Connection error: {err}")

@sio.event
async def disconnect():
    print("Disconnected from server")

async def main():
    try:
        await sio.connect('http://localhost:8000', socketio_path='/ws/socket.io')
        await asyncio.sleep(2)
        await sio.disconnect()
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == '__main__':
    asyncio.run(main())
